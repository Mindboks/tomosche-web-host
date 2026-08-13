// ================================================================
// Tomosche Cloud Functions
// LINE ID Token 検証 + Firebase カスタムトークン発行 + フィードバック + 友達追加
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
// フィードバック送信（Cloud Functions経由）
// ================================================================
exports.submitFeedback = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

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

        // 50文字以上500文字以内
        if (!message || message.length < 50) {
            res.status(400).json({ error: 'Message must be at least 50 characters' });
            return;
        }

        if (message.length > 500) {
            res.status(400).json({ error: 'Message too long (max 500 characters)' });
            return;
        }

        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const feedbackRef = admin.firestore().collection('feedback');
            const snapshot = await feedbackRef
                .where('createdAt', '>=', today)
                .get();

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

// ================================================================
// MySchedule 保存（Cloud Functions）
// ================================================================
exports.saveMySchedule = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

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
        const { date, schedules, userName } = req.body;

        if (!date) {
            res.status(400).json({ error: 'Date is required' });
            return;
        }

        if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
            res.status(400).json({ error: 'Schedules array is required' });
            return;
        }

        if (schedules.length > 10) {
            res.status(400).json({ error: 'Maximum 10 schedules allowed' });
            return;
        }

        try {
            const eventsRef = admin.firestore().collection('events');
            const batch = admin.firestore().batch();

            const existingSnapshot = await eventsRef
                .where('userId', '==', userId)
                .where('date', '==', date)
                .get();

            existingSnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });

            for (const schedule of schedules) {
                if (!schedule.title || schedule.title.trim() === '') {
                    continue;
                }
                const docRef = eventsRef.doc();
                batch.set(docRef, {
                    userId: userId,
                    date: date,
                    time: schedule.time || '12:00',
                    title: schedule.title.trim(),
                    person: userName || 'Me',
                    type: 'own',
                    status: 'own',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            }

            await batch.commit();

            res.status(200).json({
                success: true,
                count: schedules.length
            });

        } catch (error) {
            console.error('Save schedule error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// ================================================================
// ★ 新規：友達追加（QRコード経由・双方向のfriendshipを作成）
// クライアントからは他人のFirestoreデータを直接読み書きできないため、
// Admin SDK権限を持つこの関数を経由して処理する。
// ================================================================
exports.addFriendV2 = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

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

        const myUid = decodedToken.uid;
        const { friendId } = req.body || {};

        if (!friendId || typeof friendId !== 'string') {
            res.status(400).json({ error: 'friendId is required' });
            return;
        }

        if (friendId === myUid) {
            res.status(400).json({ error: 'You cannot add yourself.' });
            return;
        }

        try {
            const db = admin.firestore();

            // 相手が実在するユーザーか確認（Admin SDKなので他人のドキュメントも読める）
            const friendUserSnap = await db.collection('users').doc(friendId).get();
            if (!friendUserSnap.exists) {
                res.status(404).json({ error: 'Friend not found. Ask them to open Tomosche at least once first.' });
                return;
            }
            const friendName = friendUserSnap.data().displayName || 'Friend';

            // 自分の表示名も取得（相手側のfriendshipレコードに埋め込むため）
            const myUserSnap = await db.collection('users').doc(myUid).get();
            const myName = myUserSnap.exists ? (myUserSnap.data().displayName || 'Friend') : 'Friend';

            // 既に友達かどうかチェック（二重登録防止）
            const existing = await db.collection('friendships')
                .where('userId', '==', myUid)
                .where('friendId', '==', friendId)
                .limit(1)
                .get();

            if (!existing.empty) {
                res.status(200).json({ success: true, alreadyFriends: true, friendName });
                return;
            }

            const now = admin.firestore.FieldValue.serverTimestamp();
            const batch = db.batch();

            // 自分側のfriendshipレコード（friendNameを埋め込むので、
            // クライアント側は他人のusersコレクションを読みに行かなくてよい）
            const myFriendshipRef = db.collection('friendships').doc();
            batch.set(myFriendshipRef, {
                userId: myUid,
                friendId: friendId,
                friendName: friendName,
                status: 'shared',
                createdAt: now
            });

            // 相手側のfriendshipレコード
            const theirFriendshipRef = db.collection('friendships').doc();
            batch.set(theirFriendshipRef, {
                userId: friendId,
                friendId: myUid,
                friendName: myName,
                status: 'shared',
                createdAt: now
            });

            await batch.commit();

            res.status(200).json({ success: true, alreadyFriends: false, friendName });

        } catch (error) {
            console.error('Add friend error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
// ================================================================
// ✅ 友達に予定リクエストを送信
// ================================================================
exports.sendFriendEvent = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            res.status(405).json({ error: 'Method Not Allowed' });
            return;
        }

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

        const myUserId = decodedToken.uid;
        const { friendId, date, time, title, note } = req.body;

        if (!friendId || !date || !time || !title) {
            res.status(400).json({ error: 'friendId, date, time, title are required' });
            return;
        }

        try {
            const db = admin.firestore();

            // 友達関係を確認
            const friendship = await db.collection('friendships')
                .where('userId', '==', myUserId)
                .where('friendId', '==', friendId)
                .where('status', '==', 'shared')
                .limit(1)
                .get();

            if (friendship.empty) {
                res.status(403).json({ error: 'Not friends with this user' });
                return;
            }

            // 友達の情報を取得
            const friendRef = db.collection('users').doc(friendId);
            const friendSnap = await friendRef.get();
            const friendName = friendSnap.exists ? friendSnap.data().displayName : 'Friend';

            // 自分の情報を取得
            const myRef = db.collection('users').doc(myUserId);
            const mySnap = await myRef.get();
            const myName = mySnap.exists ? mySnap.data().displayName : 'Me';

            // イベントリクエストを作成
            const eventRef = db.collection('friendEvents').doc();
            await eventRef.set({
                fromUserId: myUserId,
                fromUserName: myName,
                toUserId: friendId,
                toUserName: friendName,
                date: date,
                time: time,
                title: title,
                note: note || '',
                status: 'pending',  // pending | confirmed | rejected | cancelled
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            res.status(200).json({
                success: true,
                message: `Event request sent to ${friendName}!`
            });

        } catch (error) {
            console.error('Send friend event error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
