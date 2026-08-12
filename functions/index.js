// ================================================================
// Tomosche Cloud Functions
// LINE ID Token 検証 + Firebase カスタムトークン発行
// ================================================================

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors')({ origin: true });

admin.initializeApp();

// ================================================================
// LINE ID Token を検証し、Firebase カスタムトークンを発行
// onCall ではなく onRequest + cors で実装（生のfetch()から呼べるようにするため）
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
            // 1. LINEのID Tokenを検証
            const params = new URLSearchParams();
            params.append('id_token', idToken);
            // ★ functions.config() は廃止済みのため、.env の LINE_CHANNEL_ID を参照する
            params.append('client_id', process.env.LINE_CHANNEL_ID);

            const response = await axios.post(
                'https://api.line.me/oauth2/v2.1/verify',
                params,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            const lineUser = response.data;

            // 2. LINEユーザーID（sub）をuidとしてFirebaseカスタムトークンを発行
            const customToken = await admin.auth().createCustomToken(lineUser.sub);

            // 3. ユーザー情報をFirestoreに保存（初回のみ）
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

            // ★ クライアント（auth-guard.js）が読む項目名は firebaseToken に統一
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
// ヘルスチェック（デプロイ確認用）
// ================================================================
exports.healthCheck = functions.https.onRequest((req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Tomosche Cloud Functions'
    });
});