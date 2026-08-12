// ================================================================
// 認証ガード（全ページ共通・LIFF初期化はここに一元化）
// ================================================================

window.currentUser = null;
window.firebaseUser = null;

const VERIFY_LINE_TOKEN_URL = 'https://us-central1-tomoche.cloudfunctions.net/verifyLineTokenV2';

// 認証確認が終わるまで画面を隠す
document.documentElement.style.visibility = 'hidden';

console.log('🔐 auth-guard.js 読み込み開始');

// ✅ 無限ループ防止フラグ
const SESSION_STORAGE_KEY = 'tomosche_auth_retry_count';

function getRetryCount() {
    const count = parseInt(sessionStorage.getItem(SESSION_STORAGE_KEY) || '0', 10);
    return count;
}

function incrementRetryCount() {
    const count = getRetryCount() + 1;
    sessionStorage.setItem(SESSION_STORAGE_KEY, String(count));
    return count;
}

function resetRetryCount() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

async function requireAuth() {
    console.log('🔐 requireAuth() 開始');

    // ✅ リトライ回数をチェック（3回以上でリダイレクトを止める）
    const retryCount = getRetryCount();
    if (retryCount >= 3) {
        console.warn('⚠️ 認証リトライが3回を超えました。ログイン画面へ戻ります。');
        resetRetryCount();
        if (typeof liff !== 'undefined' && liff.isLoggedIn()) {
            liff.logout();
        }
        window.location.href = '/';
        return false;
    }

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
    // ステップ2：Firebase連携
    // ---------------------------------------------------------
    try {
        const idToken = liff.getIDToken();
        console.log('📝 IDトークン:', idToken ? `取得済み（長さ: ${idToken.length}）` : 'null');

        if (!idToken) {
            console.error('❌ liff.getIDToken() が null です。');
            return true;
        }

        console.log('⏳ Cloud Functions に送信中...');
        const res = await fetch(VERIFY_LINE_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });
        console.log('📡 Cloud Functions 応答:', res.status);

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            
            // ✅ トークン期限切れの場合はリトライカウントを増やすが、リロードはしない！
            if (res.status === 401 && text.includes('expired')) {
                console.warn('⚠️ トークン期限切れを検出しました。');
                const newCount = incrementRetryCount();
                console.log(`🔄 リトライ回数: ${newCount}/3`);
                
                if (newCount >= 3) {
                    console.error('❌ リトライ上限に達しました。ログアウトします。');
                    resetRetryCount();
                    if (typeof liff !== 'undefined' && liff.isLoggedIn()) {
                        liff.logout();
                    }
                    window.location.href = '/';
                    return false;
                }
                
                // ✅ リロードではなく、ログインし直す
                console.log('🔄 再ログインを実行します...');
                liff.logout();
                liff.login();
                return false;
            }
            
            throw new Error(`verifyLineTokenV2 failed: ${res.status} ${text}`);
        }

        // ✅ 成功したらリトライカウントをリセット
        resetRetryCount();

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
        console.error('❌ Firebase連携エラー:', err);
        // ❌ ここでは絶対にリロードしない！
    }

    console.log('✅ 認証完了、画面を表示');
    return true;
}

// ★ スクリプト読み込み時に自動実行
window.liffReadyPromise = requireAuth();