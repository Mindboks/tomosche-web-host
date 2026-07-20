// ============================================================
// 🌍 Tomosche 共通テンプレート（一括管理）
// ============================================================

const TOMOSCHE_TEMPLATE = {
    // ====== 共通ヘッダー ======
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
    ${extraHead}
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
    <div class="footer-links">
        <a href="privacy.html">プライバシーポリシー</a>
        <span>|</span>
        <a href="terms.html">利用規約</a>
    </div>
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
    <div id="loadingOverlay" class="loading-overlay">
        <div class="spinner"></div>
        <div id="loadingText">読み込み中...</div>
    </div>
        `;
    },

    // ====== 共通メインフレーム ======
    mainFrame: function(content) {
        return `
    <div id="mainContent" style="display: none;">
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
