// ================================================================
// 認証ガード（全ページ共通・LIFF初期化はここに一元化）
// このファイルは <head> 内、他のアプリスクリプトより前に読み込むこと。
//
// 重要：LINEログインの失敗（要リダイレクト）と、
// Firebase連携の失敗（リダイレクトしない）を分けて扱う。
// この2つを同じtry-catchに入れてしまうと、Firebase連携が失敗するたびに
// '/' へリダイレクト→再度失敗→再度リダイレクト…という無限ループになる。
// ================================================================

window.currentUser = null;
window.firebaseUser = null;

const VERIFY_LINE_TOKEN_URL = 'https://us-central1-tomoche.cloudfunctions.net/verifyLineTokenV2';

// 認証確認が終わるまで画面を隠す（未ログイン状態のコンテンツがちらつくのを防ぐ）
document.documentElement.style.visibility = 'hidden';

console.log('🔐 auth-guard.js 読み込み開始');

async function requireAuth() {
    console.log('🔐 requireAuth() 開始');

    // ---------------------------------------------------------
    // ステップ1：LINEログイン確認
    // ここが失敗した場合のみ '/' へリダイレクトする。
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

    // LINEログインまでは成功。ここで画面を表示してよい。
    document.documentElement.style.visibility = 'visible';

    // ---------------------------------------------------------
    // ステップ2：Firebase連携（LINEのIDトークン → Firebaseカスタムトークン）
    // ここが失敗しても絶対にリダイレクトしない。
    // 失敗してもLINEログインの状態でアプリの表示は続行できる
    // （Firestore等を使う機能だけ動かない状態になるだけ）。
    // ---------------------------------------------------------
    try {
        const idToken = liff.getIDToken();
        console.log('📝 IDトークン:', idToken ? `取得済み（長さ: ${idToken.length}）` : 'null');

        if (!idToken) {
            console.error(
                '❌ liff.getIDToken() が null です。' +
                'LINE Developers Console → LIFFタブ → Scope で「openid」が有効か確認してください。'
            );
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
    }

    console.log('✅ 認証完了、画面を表示');
    return true;
}

// ★ スクリプト読み込み時に自動実行し、Promiseをグローバルに保持。
window.liffReadyPromise = requireAuth();