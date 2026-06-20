// ====== 共通アプリケーションロジック ======

// LIFF ID（環境変数化推奨）
const LIFF_ID = '2010384200-BS1cr2CR';

// 現在のユーザー情報
let currentUser = null;

// LIFF初期化（共通）
async function initLiff() {
    try {
        await liff.init({ liffId: LIFF_ID });
        if (!liff.isLoggedIn()) {
            liff.login();
            return false;
        }
        const profile = await liff.getProfile();
        currentUser = {
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl
        };
        return true;
    } catch (err) {
        console.error('LIFF init error:', err);
        return false;
    }
}

// ユーザー名表示ヘルパー
function setUserName(elementId) {
    const el = document.getElementById(elementId);
    if (el && currentUser) {
        el.textContent = currentUser.displayName;
    }
}

// ログアウト
function logout() {
    if (liff.isLoggedIn()) {
        liff.logout();
        window.location.reload();
    }
}

// ページ遷移ヘルパー（SPA風）
function navigateTo(page) {
    window.location.href = `?page=${page}`;
}
