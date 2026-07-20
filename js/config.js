// ================================================================
// ■ Tomosche アプリケーション設定ファイル
// ■ すべての設定はここで一元管理します
// ■ 更新日: 2026-07-20
// ================================================================

// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
// 【バージョン情報 変更方法】
// 1. 下記 version の値を変更する（例: '1.0.1' → '1.0.2'）
// 2. 保存して git commit → git push するだけで全ページに反映
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
const APP_CONFIG = {
    version: '1.0.0',
    appName: 'Tomosche',
    appSubtitle: 'Shared Calendar',
    debug: false,  // 本番環境では false に設定

    // ================================================================
    // ■ Firebase 設定
    // ■ 取得方法: Firebase Console → プロジェクト設定 → 全般 → アプリ
    // ================================================================
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

/** バージョン情報を取得 */
function getVersion() {
    return APP_CONFIG.version;
}

/** アプリ名を取得 */
function getAppName() {
    return APP_CONFIG.appName;
}

/** フルバージョン表示（アプリ名 + バージョン） */
function getFullVersion() {
    return APP_CONFIG.appName + ' v' + APP_CONFIG.version;
}

/** アプリタイトル（アプリ名 + サブタイトル） */
function getAppTitle() {
    return APP_CONFIG.appName + ' - ' + APP_CONFIG.appSubtitle;
}

// ================================================================
// ■ Firebase 初期化関数
// ================================================================

/** Firebase SDKを初期化（各ページの読み込み時に呼び出す） */
function initFirebase() {
    // Firebaseが既に初期化されている場合はスキップ
    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(APP_CONFIG.firebase);
        console.log('🔥 Firebase initialized');
        return true;
    }
    return false;
}

/** Firestoreインスタンスを取得 */
function getFirestore() {
    if (typeof firebase !== 'undefined' && firebase.apps.length) {
        return firebase.firestore();
    }
    return null;
}

/** 現在のユーザー情報を取得（LINE連携と統合予定） */
function getCurrentUser() {
    // 後で実装
    return null;
}
