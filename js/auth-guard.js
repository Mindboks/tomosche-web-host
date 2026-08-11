// ================================================================
// 認証ガード（各ページで読み込み）
// ================================================================

async function requireAuth() {
    try {
        await liff.init({ liffId: '2010384200-BS1cr2CR' });
        if (!liff.isLoggedIn()) {
            // ログインしていない場合はログイン
            liff.login();
            return false;
        }
        return true;
    } catch (err) {
        console.error('LIFF init error:', err);
        // エラー時はトップへ
        window.location.href = '/';
        return false;
    }
}
