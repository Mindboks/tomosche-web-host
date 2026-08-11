// ================================================================
// Tomosche アプリケーション本体
// ================================================================
// LIFFの初期化・ログイン確認・window.currentUser のセットは
// js/auth-guard.js が一元的に行う（このファイルでは liff.init() を呼ばない）。
// このファイルは auth-guard.js より後に読み込むこと。

// ユーザー名表示（同期用・window.currentUser がセット済みの場合のみ有効）
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
    }
}

// ページ遷移
function navigateTo(page) {
    window.location.href = page;
}
