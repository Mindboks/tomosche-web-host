// ================================================================
// 認証ガード（全ページ共通・LIFF初期化はここに一元化）
// ================================================================

window.currentUser = null;
window.firebaseUser = null;

const VERIFY_LINE_TOKEN_URL = 'https://us-central1-tomoche.cloudfunctions.net/verifyLineTokenV2';

// 認証確認が終わるまで画面を隠す
document.documentElement.style.visibility = 'hidden';

console.log('🔐 auth-guard.js 読み込み開始');

async function requireAuth() {
    console.log('🔐 requireAuth() 開始');

    // ---------------------------------------------------------
    // ステップ1：LINEログイン確認
    // ---------------------------------------------------------
    try {
        console.log('⏳ LIFF初期化中...');
        await liff.init({ liffId: '2010384200-BS1cr2CR' });
        console.log('✅ LIFF初期化完了');

        if (!liff.isLoggedIn()) {
            console.log('🔐 未ログイン: liff.login() を実行');
            liff.login();
            return false;
        }
        console.log('✅ ログイン済み');

        const profile = await liff.getProfile();
        console.log('✅ プロフィール取得:', profile.displayName);
        window.currentUser = {
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl
        };
    } catch (err) {
        console.error('❌ LIFF init error:', err);
        window.location.href = '/';
        return false;
    }

    // LINEログイン成功。画面を表示。
    document.documentElement.style.visibility = 'visible';

    // ---------------------------------------------------------
    // ステップ2：Firebase連携（トークン期限切れを自動リトライ）
    // ---------------------------------------------------------
    try {
        let idToken = liff.getIDToken();
        console.log('📝 IDトークン:', idToken ? `取得済み（長さ: ${idToken.length}）` : 'null');

        if (!idToken) {
            console.error(
                '❌ liff.getIDToken() が null です。' +
                'LINE Developers Console → LIFFタブ → Scope で「openid」が有効か確認してください。'
            );
            return true;
        }

        console.log('⏳ Cloud Functions に送信中...');
        let res = await fetch(VERIFY_LINE_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });
        console.log('📡 Cloud Functions 応答:', res.status);

        // ✅ トークン期限切れの場合（401）は再試行
        if (res.status === 401) {
            const errorText = await res.text().catch(() => '');
            if (errorText.includes('expired')) {
                console.log('🔄 トークン期限切れのため再取得します...');
                
                // LIFFを再初期化して新しいトークンを取得
                await liff.init({ liffId: '2010384200-BS1cr2CR' });
                idToken = liff.getIDToken();
                console.log('📝 新しいIDトークンを取得:', idToken ? `長さ: ${idToken.length}` : 'null');
                
                if (idToken) {
                    // 再送信
                    res = await fetch(VERIFY_LINE_TOKEN_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken })
                    });
                    console.log('📡 再送信後の応答:', res.status);
                } else {
                    throw new Error('新しいIDトークンの取得に失敗しました');
                }
            } else {
                throw new Error(`verifyLineTokenV2 failed: ${res.status} ${errorText}`);
            }
        }

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`verifyLineTokenV2 failed: ${res.status} ${text}`);
        }

        const data = await res.json();
        console.log('📦 サーバー応答:', data);
        const firebaseToken = data.firebaseToken;
        if (!firebaseToken) {
            throw new Error('verifyLineTokenV2のレスポンスに firebaseToken が含まれていません');
        }
        console.log('✅ Firebaseトークン取得成功');

        console.log('⏳ Firebase SDK 読み込み中...');
        const { initializeApp, getApps, getApp } = await import('https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js');
        const { getAuth, signInWithCustomToken } = await import('https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js');

        const firebaseConfig = {
            apiKey: 'AIzaSyAutsnScMxkcm6UXv0vhLs6hVDY_rxhLP0',
            authDomain: 'tomoche.firebaseapp.com',
            projectId: 'tomoche',
            storageBucket: 'tomoche.firebasestorage.app',
            messagingSenderId: '687415158427',
            appId: '1:687415158427:web:1efc4417146176da74c83e'
        };

        console.log('⏳ Firebase 初期化中...');
        const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        const auth = getAuth(app);

        console.log('⏳ カスタムトークンでサインイン中...');
        const userCredential = await signInWithCustomToken(auth, firebaseToken);

        window.firebaseUser = userCredential.user;
        console.log('✅ Firebase Auth サインイン成功:', userCredential.user.uid);
        
    } catch (err) {
        // ★ ここで絶対にリダイレクトしない。ログだけ出して処理を終える。
        console.error('❌ Firebase連携エラー（LINEログイン自体は成功しています）:', err);
        
        // ✅ トークン期限切れの場合はページをリロード
        if (err.message && err.message.includes('expired')) {
            console.log('🔄 トークン期限切れのためページをリロードします...');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }

    console.log('✅ 認証完了、画面を表示');
    return true;
}

// ★ スクリプト読み込み時に自動実行
window.liffReadyPromise = requireAuth();