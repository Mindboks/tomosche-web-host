// ============================================================
// Tomosche アプリケーション設定（一元管理）
// ============================================================

const APP_CONFIG = {
    version: '1.0.0',
    appName: 'Tomosche',
    appSubtitle: 'Social Scheduling',
    debug: true,
    firebase: {
        apiKey: "AIzaSyAutsnScMxkcm6UXv0vhLs6hVDY_rxhLP0",
        authDomain: "tomoche.firebaseapp.com",
        projectId: "tomoche",
        storageBucket: "tomoche.firebasestorage.app",
        messagingSenderId: "687415158427",
        appId: "1:687415158427:web:1efc4417146176da74c83e"
    }
};

function getVersion() {
    return APP_CONFIG.version;
}

function getAppName() {
    return APP_CONFIG.appName;
}

function getFullVersion() {
    return APP_CONFIG.appName + ' v' + APP_CONFIG.version;
}

function getAppTitle() {
    return APP_CONFIG.appName + ' - ' + APP_CONFIG.appSubtitle;
}

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
