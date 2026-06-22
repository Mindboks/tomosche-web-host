// ============================================================
// 🌍 Tomosche アプリケーション設定（一元管理）
// ============================================================

const APP_CONFIG = {
    // バージョン情報
    version: 'v0.0.0',
    appName: 'Tomosche',
    
    // Firebase設定（後で追加）
    firebase: {
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: ''
    },
    
    // APIエンドポイント
    api: {
        baseUrl: 'https://tomosche.com',
        // 後で追加
    },
    
    // デバッグモード
    debug: true
};

// バージョン表示用関数
function getVersion() {
    return APP_CONFIG.version;
}

function getAppName() {
    return APP_CONFIG.appName;
}
