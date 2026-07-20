// ================================================================
// ■ Tomosche アプリケーション設定ファイル
// ■ すべての設定はここで一元管理します
// ================================================================

const APP_CONFIG = {
    // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    // 【バージョン情報 変更方法】
    // 1. 下記 version の値を変更する（例: '1.0.1' → '1.0.2'）
    // 2. 保存して git commit → git push するだけで全ページに反映
    // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    version: '1.0.0',

    appName: 'Tomosche',
    appSubtitle: 'Social Scheduling',
    debug: true,

    // Firebase 設定（後で本番用に差し替え）
    firebase: {
        apiKey: "AIzaSyAutsnScMxkcm6UXv0vhLs6hVDY_rxhLP0",
        authDomain: "tomoche.firebaseapp.com",
        projectId: "tomoche",
        storageBucket: "tomoche.firebasestorage.app",
        messagingSenderId: "687415158427",
        appId: "1:687415158427:web:1efc4417146176da74c83e"
    }
};

// ================================================================
// 以下は内部関数（変更不要）
// ================================================================
function getVersion() { return APP_CONFIG.version; }
function getAppName() { return APP_CONFIG.appName; }
function getFullVersion() { return APP_CONFIG.appName + ' v' + APP_CONFIG.version; }
function getAppTitle() { return APP_CONFIG.appName + ' - ' + APP_CONFIG.appSubtitle; }

function initFirebase() {
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(APP_CONFIG.firebase);
        console.log('🔥 Firebase initialized');
        return true;
    }
    return false;
}

function getFirestore() {
    if (typeof firebase !== 'undefined' && firebase.apps.length) {
        return firebase.firestore();
    }
    return null;
}
