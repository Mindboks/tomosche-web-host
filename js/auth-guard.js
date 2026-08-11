// ================================================================
// 認証ガード（全ページ共通・LIFF初期化はここに一元化）
// このファイルは <head> 内、他のアプリスクリプトより前に読み込むこと。
// ================================================================

window.currentUser = null;

// 認証確認が終わるまで画面を隠す（未ログイン状態のコンテンツがちらつくのを防ぐ）
document.documentElement.style.visibility = 'hidden';

async function requireAuth() {
    try {
        await liff.init({ liffId: '2010384200-BS1cr2CR' });

        if (!liff.isLoggedIn()) {
            // ログイン画面へリダイレクト。この後の処理は実行されない。
            liff.login();
            return false;
        }

        const profile = await liff.getProfile();
        window.currentUser = {
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl
        };

        // 認証OK。画面表示を許可する。
        document.documentElement.style.visibility = 'visible';
        return true;
    } catch (err) {
        console.error('❌ LIFF init error:', err);
        // 初期化に失敗した場合はトップページへ退避する
        window.location.href = '/';
        return false;
    }
}

// ★ スクリプト読み込み時に自動実行し、Promiseをグローバルに保持。
//   他のスクリプト（template.js 等）はこれを await することで、
//   認証・プロフィール取得が完了した後の状態を安全に参照できる。
window.liffReadyPromise = requireAuth();
