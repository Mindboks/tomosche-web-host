// ================================================================
// Tomosche - LIFF連携（App Store / Play Store 審査対応版）
// ================================================================

const LIFF_ID = '2010384200-BS1cr2CR';

// LIFF初期化（エラーハンドリング強化）
async function initLiff() {
    try {
        await liff.init({ liffId: LIFF_ID });
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
        console.log('✅ LIFF initialized:', profile.displayName);
        return true;
    } catch (err) {
        console.error('❌ LIFF error:', err);
        return false;
    }
}

// ユーザー名表示
function setUserName(elementId) {
    const el = document.getElementById(elementId);
    if (el && window.currentUser) {
        el.textContent = window.currentUser.displayName;
    }
}

// ログアウト
function logout() {
    if (typeof liff !== 'undefined' && liff.isLoggedIn()) {
        liff.logout();
        window.location.reload();
    } else {
        window.location.href = '/';
    }
}
