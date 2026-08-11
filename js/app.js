// ================================================================
// Tomosche アプリケーション本体
// ================================================================

window.currentUser = null;

// LIFF初期化
async function initLiff() {
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
        console.log('✅ LIFF initialized for:', window.currentUser.displayName);
        return true;
    } catch (err) {
        console.error('❌ LIFF init error:', err);
        return false;
    }
}

// ★ ページ読み込み時に自動実行し、Promiseを保持
window.liffReadyPromise = initLiff();

// ユーザー名表示（同期用）
function setUserName(elementId) {
    const el = document.getElementById(elementId);
    if (el && window.currentUser) {
        el.textContent = window.currentUser.displayName;
    }
}

// ログアウト
function logout() {
    if (liff.isLoggedIn()) {
        liff.logout();
        window.location.reload();
    }
}

// ページ遷移
function navigateTo(page) {
    window.location.href = page;
}
