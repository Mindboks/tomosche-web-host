// ================================================================
// Tomosche Cloud Functions
// LINE ID Token 検証 + Firebase カスタムトークン発行 + フィードバック
// ================================================================

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors')({ origin: true });

admin.initializeApp();

// ================================================================
// LINE ID Token を検証し、Firebase カスタムトークンを発行
// ================================================================
exports.verifyLineTokenV2 = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

        const { idToken } = req.body || {};

        if (!idToken) {
            res.status(400).json({ error: 'idToken is required' });
            return;
        }

        try {
            const params = new URLSearchParams();
            params.append('id_token', idToken);
            params.append('client_id', process.env.LINE_CHANNEL_ID);

            const response = await axios.post(
                'https://api.line.me/oauth2/v2.1/verify',
                params,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            const lineUser = response.data;
            const customToken = await admin.auth().createCustomToken(lineUser.sub);

            const userRef = admin.firestore().collection('users').doc(lineUser.sub);
            const userDoc = await userRef.get();

            if (!userDoc.exists) {
                await userRef.set({
                    displayName: lineUser.name || 'LINE User',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
            } else {
                await userRef.update({
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
            }

            res.status(200).json({ firebaseToken: customToken });

        } catch (error) {
            console.error('Token verification error:', error.response?.data || error.message);
            res.status(401).json({
                error: 'LINE ID Token verification failed: ' + (error.response?.data?.error_description || error.message)
            });
        }
    });
});

// ================================================================
// ✅ 新規：フィードバック送信（Cloud Functions経由）
// ================================================================
exports.submitFeedback = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

        // Firebase Auth トークンを検証
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const idToken = authHeader.split('Bearer ')[1];
        let decodedToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        const userId = decodedToken.uid;
        const { message, userName } = req.body;

        if (!message || message.length < 50) {
            res.status(400).json({ error: 'Message must be at least 5 characters' });
            return;
        }

        if (message.length > 500) {
            res.status(400).json({ error: 'Message too long (max 2000 characters)' });
            return;
        }

        try {
            // 今日の0時0分を取得
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // 過去24時間以内のフィードバックをチェック
            const feedbackRef = admin.firestore().collection('feedback');
            const snapshot = await feedbackRef
                .where('createdAt', '>=', today)
                .get();

            // メモリ上で userId をフィルタリング（インデックス不要）
            let alreadySent = false;
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.userId === userId) {
                    alreadySent = true;
                }
            });

            if (alreadySent) {
                res.status(429).json({ error: 'You have already sent feedback today.' });
                return;
            }

            // Firestoreに保存
            await feedbackRef.add({
                userId: userId,
                userName: userName || 'Anonymous',
                message: message,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            res.status(200).json({ success: true });

        } catch (error) {
            console.error('Feedback save error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// ================================================================
// ヘルスチェック（デプロイ確認用）
// ================================================================
exports.healthCheck = functions.https.onRequest((req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Tomosche Cloud Functions'
    });
});