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

const VERIFY_LINE_TOKEN_URL = 'https://us-central1-tomoche.cloudfunctions.net/verifyLineToken';

// 認証確認が終わるまで画面を隠す（未ログイン状態のコンテンツがちらつくのを防ぐ）
document.documentElement.style.visibility = 'hidden';

async function requireAuth() {
    // ---------------------------------------------------------
    // ステップ1：LINEログイン確認
    // ここが失敗した場合のみ '/' へリダイレクトする。
    // ---------------------------------------------------------
    try {
        await liff.init({ liffId: '2010384200-BS1cr2CR' });

        if (!liff.isLoggedIn()) {
            liff.login();
            return false;
        }

        const profile = await liff.getProfile();
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
        if (!idToken) {
            console.error(
                '❌ liff.getIDToken() が null です。' +
                'LINE Developers Console → LIFFタブ → Scope で「openid」が有効か確認してください。'
            );
            return true;
        }

        const res = await fetch(VERIFY_LINE_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken })
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`verifyLineToken failed: ${res.status} ${text}`);
        }

        const data = await res.json();
        const firebaseToken = data.firebaseToken;
        if (!firebaseToken) {
            throw new Error('verifyLineTokenのレスポンスに firebaseToken が含まれていません');
        }

        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js');
        const { getAuth, signInWithCustomToken } = await import('https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js');

        const firebaseConfig = {
            apiKey: 'AIzaSyAutsnScMxkcm6UXv0vhLs6hVDY_rxhLP0',
            authDomain: 'tomoche.firebaseapp.com',
            projectId: 'tomoche',
            storageBucket: 'tomoche.firebasestorage.app',
            messagingSenderId: '687415158427',
            appId: '1:687415158427:web:1efc4417146176da74c83e'
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const userCredential = await signInWithCustomToken(auth, firebaseToken);

        window.firebaseUser = userCredential.user;
        console.log('✅ Firebase Authサインイン成功:', userCredential.user.uid);
    } catch (err) {
        // ★ ここで絶対にリダイレクトしない。ログだけ出して処理を終える。
        console.error('❌ Firebase連携エラー（LINEログイン自体は成功しています）:', err);
    }

    return true;
}

// ★ スクリプト読み込み時に自動実行し、Promiseをグローバルに保持。
window.liffReadyPromise = requireAuth();