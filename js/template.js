// ============================================================
// Tomosche 共通テンプレート（一括管理）
// ============================================================

const TOMOSCHE_TEMPLATE = {
    // ====== 共通ヘッダー ======
    header: function(title, extraHead = '') {
        const appTitle = getAppTitle ? getAppTitle() : 'Tomosche - Social Scheduling';
        return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>${title} - ${appTitle}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://static.line-scdn.net/liff/edge/2.1/sdk.js"></script>
    <script src="https://www.gstatic.com/firebasejs/11.5.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/11.5.0/firebase-auth-compat.js"></script>
    <style>
        /* ====== 強制白背景 ====== */
        html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        /* ローディング */
        #loadingOverlay {
            position: fixed;
            inset: 0;
            background: rgba(255,255,255,0.95);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e0e0e0;
            border-top: 4px solid #06C755;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 16px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        /* メインコンテンツ */
        #mainContent {
            display: none;
            background: #ffffff;
            min-height: 100vh;
            padding-bottom: 80px;
        }
        /* ヘッダー */
        .header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px 8px 20px;
            background: #ffffff;
        }
        .header-left {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .logo-icon { font-size: 26px; }
        .logo-title {
            font-size: 18px;
            font-weight: 700;
            color: #06C755;
        }
        .logo-sub {
            font-size: 10px;
            color: #999;
            background: #f0f4f8;
            padding: 2px 8px;
            border-radius: 999px;
            margin-left: 6px;
        }
        .header-right .profile-icon {
            font-size: 30px;
            color: #06C755;
            cursor: pointer;
        }
        /* 下部ナビゲーション */
        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #ffffff;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 6px 8px 14px 8px;
            border-top: 1px solid #f0f4f8;
            box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
            z-index: 100;
        }
        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            text-decoration: none;
            color: #999;
            font-size: 10px;
            cursor: pointer;
            background: none;
            border: none;
            padding: 4px 10px;
        }
        .nav-item i {
            font-size: 20px;
            transition: all 0.2s;
        }
        .nav-item.active {
            color: #06C755;
        }
        .nav-item.active i {
            transform: translateY(-2px);
        }
        .nav-item:active {
            transform: scale(0.92);
        }
        /* Moreメニュー */
        #moreMenuPopup {
            display: none;
            position: fixed;
            bottom: 80px;
            left: 16px;
            right: 16px;
            background: white;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 8px 40px rgba(0,0,0,0.12);
            z-index: 999;
            border: 1px solid rgba(0,0,0,0.04);
        }
        #moreMenuPopup .menu-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            text-align: center;
        }
        #moreMenuPopup .menu-grid a {
            text-decoration: none;
            color: #333;
            font-size: 12px;
        }
        #moreMenuPopup .menu-grid .icon-box {
            background: #f0f4f8;
            border-radius: 14px;
            padding: 14px;
        }
        #moreMenuPopup .menu-grid .icon-box i {
            font-size: 24px;
        }
        #moreMenuPopup .menu-grid span {
            margin-top: 4px;
            display: block;
        }
        #moreMenuPopup .close-btn {
            text-align: center;
            margin-top: 12px;
        }
        #moreMenuPopup .close-btn button {
            background: none;
            border: none;
            color: #999;
            font-size: 13px;
            padding: 4px 16px;
            cursor: pointer;
        }
        /* 戻るボタン */
        .back-btn {
            background: none;
            border: none;
            font-size: 24px;
            color: #06C755;
            padding: 0;
            margin-right: 8px;
            cursor: pointer;
        }
        .page-title {
            font-size: clamp(1.2rem, 4vw, 1.8rem);
            font-weight: 600;
            margin: 0;
            color: #333;
        }
        /* バージョン表示 */
        .version-display {
            text-align: center;
            padding: 4px 0 16px 0;
            font-size: 10px;
            color: #ccc;
        }
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
    <div class="version-display">
        <span id="versionDisplay">${getFullVersion ? getFullVersion() : 'Tomosche v1.0.0'}</span>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const el = document.getElementById("versionDisplay");
            if (el && typeof getFullVersion === 'function') {
                el.textContent = getFullVersion();
            }
        });
    </script>
</body>
</html>
        `;
    },

    // ====== 共通ローディング ======
    loadingOverlay: function() {
        return `
    <div id="loadingOverlay">
        <div class="spinner"></div>
        <div id="loadingText">読み込み中...</div>
    </div>
        `;
    },

    // ====== 共通メインフレーム ======
    mainFrame: function(content) {
        return `
    <div id="mainContent">
        ${content}
    </div>
        `;
    },

    // ====== 共通下部ナビゲーション ======
    bottomNav: function(active = 'home') {
        const items = [
            { id: 'home', icon: 'bi-house-fill', label: 'Home', href: '/' },
            { id: 'friends', icon: 'bi-people-fill', label: 'Friends', href: 'friends.html' },
            { id: 'calendar', icon: 'bi-calendar-event-fill', label: 'Calendar', href: 'schedule.html' },
            { id: 'add', icon: 'bi-person-plus-fill', label: 'Add', href: 'add_friends.html' },
            { id: 'more', icon: 'bi-grid-fill', label: 'More', href: '#' }
        ];
        let html = `<div class="bottom-nav">`;
        items.forEach(item => {
            const isActive = (item.id === active) ? 'active' : '';
            if (item.id === 'more') {
                html += `
                    <div class="nav-item ${isActive}" id="moreMenuBtn">
                        <i class="bi ${item.icon}"></i>
                        <span>${item.label}</span>
                    </div>
                `;
            } else {
                html += `
                    <a href="${item.href}" class="nav-item ${isActive}">
                        <i class="bi ${item.icon}"></i>
                        <span>${item.label}</span>
                    </a>
                `;
            }
        });
        html += `</div>`;
        return html;
    },

    // ====== 共通Moreメニュー ======
    moreMenu: function(active = '') {
        const items = [
            { id: 'guide', icon: 'bi-book', label: '使い方', href: 'guide.html', color: '#6a1b9a' },
            { id: 'privacy', icon: 'bi-shield-lock', label: 'プライバシー', href: 'privacy.html', color: '#1565c0' },
            { id: 'terms', icon: 'bi-file-text', label: '利用規約', href: 'terms.html', color: '#e65100' },
            { id: 'feedback', icon: 'bi-chat-dots', label: 'フィードバック', href: '#', color: '#f9a825' },
            { id: 'logout', icon: 'bi-box-arrow-right', label: 'ログアウト', href: '#', color: '#e53935' }
        ];
        let html = `
        <div id="moreMenuPopup">
            <div class="menu-grid">
        `;
        items.forEach(item => {
            const isActive = (item.id === active) ? 'style="color:#06C755;"' : '';
            html += `
                <a href="${item.href}" ${isActive} data-id="${item.id}">
                    <div class="icon-box"><i class="bi ${item.icon}" style="color:${item.color};"></i></div>
                    <span>${item.label}</span>
                </a>
            `;
        });
        html += `
            </div>
            <div class="close-btn">
                <button onclick="document.getElementById('moreMenuPopup').style.display='none'">閉じる</button>
            </div>
        </div>
        `;
        return html;
    },

    // ====== 共通ヘッダー部分（ロゴ＋プロフィール） ======
    headerContent: function() {
        return `
        <div class="header-section">
            <div class="header-left">
                <span class="logo-icon">🌱</span>
                <span class="logo-title">Tomosche</span>
                <span class="logo-sub">Social Scheduling</span>
            </div>
            <div class="header-right">
                <div class="profile-icon" id="profileIcon">
                    <i class="bi bi-person-circle"></i>
                </div>
            </div>
        </div>
        `;
    }
};

// ====== ページレンダリング関数 ======
function renderPage(title, content, activeNav = 'home', extraHead = '') {
    const html = 
        TOMOSCHE_TEMPLATE.header(title, extraHead) +
        TOMOSCHE_TEMPLATE.loadingOverlay() +
        TOMOSCHE_TEMPLATE.mainFrame(
            TOMOSCHE_TEMPLATE.headerContent() +
            content +
            TOMOSCHE_TEMPLATE.bottomNav(activeNav) +
            TOMOSCHE_TEMPLATE.moreMenu()
        ) +
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
            const overlay = document.getElementById('loadingOverlay');
            const main = document.getElementById('mainContent');
            if (overlay) overlay.style.display = 'none';
            if (main) main.style.display = 'block';
            if (callback) callback();
        }

        // Moreメニュー共通処理
        const moreBtn = document.getElementById('moreMenuBtn');
        const popup = document.getElementById('moreMenuPopup');
        if (moreBtn && popup) {
            moreBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                popup.style.display = (popup.style.display === 'none' || popup.style.display === '') ? 'block' : 'none';
            });
        }

        // ポップアップ外クリックで閉じる
        document.addEventListener('click', function(e) {
            if (popup && popup.style.display === 'block') {
                if (!e.target.closest('#moreMenuPopup') && !e.target.closest('#moreMenuBtn')) {
                    popup.style.display = 'none';
                }
            }
        });

        // ログアウト
        const logoutBtn = document.querySelector('#moreMenuPopup a[data-id="logout"]');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('ログアウトしますか？')) {
                    if (typeof logout === 'function') logout();
                    else window.location.href = '/';
                }
            });
        }

        // フィードバック
        const feedbackBtn = document.querySelector('#moreMenuPopup a[data-id="feedback"]');
        if (feedbackBtn) {
            feedbackBtn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('📝 フィードバック機能は準備中です。\ntomosche.line@gmail.com へご連絡ください。');
            });
        }
    });
}
