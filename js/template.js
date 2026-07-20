// ============================================================
// 🌍 Tomosche 共通テンプレート（一括管理）
// ============================================================

const TOMOSCHE_TEMPLATE = {
    // ====== 共通ヘッダー（白背景指定） ======
    header: function(title, extraHead = '') {
        return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>${title} - Tomosche</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <script src="https://static.line-scdn.net/liff/edge/2.1/sdk.js"></script>
    <script src="https://www.gstatic.com/firebasejs/11.5.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/11.5.0/firebase-auth-compat.js"></script>
    <style>
        /* ====== 強制的に白背景 ====== */
        html, body {
            background: #ffffff !important;
            margin: 0;
            padding: 0;
            min-height: 100vh;
        }
        /* その他、共通で使うスタイル */
        .back-btn { background: none; border: none; font-size: 24px; color: #06C755; padding: 0; margin-right: 8px; }
        .page-title { font-size: clamp(1.2rem, 4vw, 1.8rem); font-weight: 600; margin: 0; color: #333; }
        .footer-links { text-align: center; padding: 16px 0 8px 0; font-size: 12px; color: #bbb; }
        .footer-links a { color: #999; text-decoration: none; margin: 0 6px; }
        .footer-links a:hover { color: #06C755; }
        .footer-sep { color: #ddd; margin: 0 4px; }
        ${extraHead}
    </style>
</head>
<body>
        `;
    },

    // ====== 共通フッター ======
    footer: function() {
        return `
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/app.js"></script>
    <script src="js/i18n.js"></script>
    <script src="js/config.js"></script>
    <div style="text-align: center; padding: 4px 0 16px 0; font-size: 10px; color: #ccc;">
        <span id="versionDisplay"></span>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const el = document.getElementById("versionDisplay");
            if (el) el.textContent = getFullVersion();
        });
    </script>
</body>
</html>
        `;
    },

    // ====== 共通ローディングオーバーレイ ======
    loadingOverlay: function() {
        return `
    <div id="loadingOverlay" class="loading-overlay" style="position:fixed;inset:0;background:rgba(255,255,255,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;">
        <div class="spinner" style="width:40px;height:40px;border:4px solid #e0e0e0;border-top:4px solid #06C755;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:16px;"></div>
        <div id="loadingText" style="color:#666;">読み込み中...</div>
    </div>
    <style>
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
        `;
    },

    // ====== 共通メインフレーム ======
    mainFrame: function(content) {
        return `
    <div id="mainContent" style="display: none; background: #ffffff; min-height: 100vh;">
        ${content}
    </div>
        `;
    }
};

// ====== ページレンダリング関数 ======
function renderPage(title, content, extraHead = '') {
    const html = 
        TOMOSCHE_TEMPLATE.header(title, extraHead) +
        TOMOSCHE_TEMPLATE.loadingOverlay() +
        TOMOSCHE_TEMPLATE.mainFrame(content) +
        TOMOSCHE_TEMPLATE.footer();
    
    document.open();
    document.write(html);
    document.close();
}

// ====== ページロード後の共通処理 ======
function afterPageLoad(callback) {
    document.addEventListener('DOMContentLoaded', async function() {
        const success = await initLiff();
        if (success) {
            setUserName('userName');
            document.getElementById('loadingOverlay').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            if (callback) callback();
        }
    });
}
