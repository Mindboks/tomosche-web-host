// ============================================================
// Tomosche 共通テンプレート
// ============================================================

function renderPage(title, content) {
    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>${title} - Tomosche</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://static.line-scdn.net/liff/edge/2.1/sdk.js"></script>
    <style>
        html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .app-container {
            max-width: 420px;
            margin: 0 auto;
            padding: 0 16px 80px 16px;
            background: #ffffff;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0 8px 0;
        }
        .logo { font-size: 22px; font-weight: 700; color: #06C755; }
        .logo-sub { font-size: 11px; color: #999; font-weight: 400; margin-left: 6px; }
        .profile-icon { font-size: 28px; color: #06C755; cursor: pointer; }
        .image-wrapper {
            position: relative;
            width: 100%;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            margin: 4px 0 0 0;
        }
        .image-wrapper img { width: 100%; height: auto; display: block; }
        .image-date {
            position: absolute;
            top: 16px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255,255,255,0.92);
            backdrop-filter: blur(6px);
            padding: 6px 18px;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 600;
            color: #333;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            border: 1px solid rgba(255,255,255,0.6);
            white-space: nowrap;
            z-index: 5;
        }
        .image-search {
            position: absolute;
            bottom: 16px;
            left: 50%;
            transform: translateX(-50%);
            width: 88%;
            max-width: 360px;
            z-index: 5;
        }
        .image-search .search-box {
            display: flex;
            align-items: center;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(6px);
            border-radius: 12px;
            padding: 10px 16px;
            gap: 10px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            border: 1px solid rgba(255,255,255,0.6);
        }
        .image-search .search-box i { color: #999; font-size: 16px; }
        .image-search .search-box input {
            border: none;
            background: none;
            outline: none;
            flex: 1;
            font-size: 14px;
            color: #333;
        }
        .image-search .search-box input::placeholder { color: #bbb; }
        .avatars { display: flex; gap: 12px; flex-wrap: wrap; padding: 12px 0 8px 0; }
        .avatar-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            text-decoration: none;
            color: #333;
            width: 56px;
        }
        .avatar-circle {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 600;
            color: #333;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .avatar-add { border: 2px dashed #ccc; color: #999; background: #f0f4f8; font-size: 20px; }
        .avatar-name { font-size: 10px; color: #888; text-align: center; max-width: 56px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .today-card {
            background: white;
            border-radius: 16px;
            padding: 16px;
            border: 1px solid #f0f4f8;
            margin-top: 8px;
        }
        .today-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
        }
        .today-header i { color: #06C755; margin-right: 6px; }
        .today-more { font-size: 12px; font-weight: 400; color: #06C755; text-decoration: none; }
        .today-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f0f4f8;
            gap: 10px;
            font-size: 13px;
        }
        .today-item:last-child { border-bottom: none; }
        .today-time { color: #06C755; font-weight: 600; min-width: 44px; }
        .today-title { flex: 1; color: #333; }
        .today-person { color: #888; background: #f0f4f8; padding: 2px 10px; border-radius: 999px; font-size: 11px; }
        /* 下部ナビ - フル幅（Bootstrap連携） */
        .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #ffffff;
            display: flex;
            justify-content: space-around;
            padding: 6px 0 14px 0;
            border-top: 1px solid #f0f4f8;
            z-index: 100;
            box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
        }
        .nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 10px;
            color: #999;
            text-decoration: none;
            gap: 2px;
            background: none;
            border: none;
            padding: 4px 12px;
            cursor: pointer;
            flex: 1;
            max-width: 80px;
        }
        .nav-item i { font-size: 20px; }
        .nav-item.active { color: #06C755; }
        .nav-item.active i { transform: translateY(-2px); }
        .nav-item:active { transform: scale(0.92); }
        /* 戻るボタン */
        .back-btn {
            background: none;
            border: none;
            font-size: 22px;
            color: #06C755;
            padding: 0;
            margin-right: 8px;
            cursor: pointer;
        }
        .page-title {
            font-size: clamp(1.1rem, 4vw, 1.6rem);
            font-weight: 600;
            margin: 0;
            color: #333;
        }
        .version { text-align: center; font-size: 10px; color: #ccc; padding: 8px 0 4px 0; }
        .more-popup {
            display: none;
            position: fixed;
            bottom: 76px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 8px 40px rgba(0,0,0,0.12);
            z-index: 999;
            border: 1px solid #f0f4f8;
            width: 92%;
            max-width: 400px;
        }
        .more-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; text-align: center; }
        .more-grid a { text-decoration: none; color: #333; font-size: 12px; }
        .more-grid .icon-box { background: #f0f4f8; border-radius: 14px; padding: 14px; }
        .more-grid .icon-box i { font-size: 24px; }
        .more-grid span { display: block; margin-top: 4px; }
        .more-close { text-align: center; margin-top: 12px; }
        .more-close button { background: none; border: none; color: #999; font-size: 13px; padding: 4px 16px; cursor: pointer; }

        /* Bootstrap レスポンシブ補助 */
        @media (max-width: 576px) {
            .app-container { padding: 0 12px 80px 12px; }
            .logo { font-size: 18px; }
            .logo-sub { font-size: 10px; }
            .image-date { font-size: 12px; padding: 4px 14px; top: 12px; }
            .image-search .search-box { padding: 8px 12px; }
            .image-search .search-box input { font-size: 12px; }
            .avatar-circle { width: 44px; height: 44px; font-size: 14px; }
            .avatar-name { font-size: 9px; }
            .today-item { font-size: 12px; }
            .today-time { min-width: 36px; font-size: 11px; }
            .nav-item { padding: 4px 8px; font-size: 9px; }
            .nav-item i { font-size: 18px; }
        }
        @media (min-width: 768px) {
            .bottom-nav { max-width: 420px; left: 50%; transform: translateX(-50%); }
            .more-popup { max-width: 400px; }
        }
    </style>
</head>
<body>
    <div class="app-container">
        ${content}
    </div>
    <div class="version" id="versionDisplay">Tomosche v1.0.0</div>

    <!-- 下部ナビ（フル幅） -->
    <div class="bottom-nav">
        <a href="/" class="nav-item active" data-nav="home"><i class="bi bi-house-fill"></i><span>Home</span></a>
        <a href="friends.html" class="nav-item" data-nav="friends"><i class="bi bi-people-fill"></i><span>Friends</span></a>
        <a href="schedule.html" class="nav-item" data-nav="calendar"><i class="bi bi-calendar-event-fill"></i><span>Calendar</span></a>
        <a href="add_friends.html" class="nav-item" data-nav="add"><i class="bi bi-person-plus-fill"></i><span>Add</span></a>
        <div class="nav-item" id="moreMenuBtn"><i class="bi bi-grid-fill"></i><span>More</span></div>
    </div>

    <!-- Moreメニュー -->
    <div class="more-popup" id="moreMenuPopup">
        <div class="more-grid">
            <a href="guide.html"><div class="icon-box"><i class="bi bi-book" style="color:#6a1b9a;"></i></div><span>使い方</span></a>
            <a href="privacy.html"><div class="icon-box"><i class="bi bi-shield-lock" style="color:#1565c0;"></i></div><span>プライバシー</span></a>
            <a href="terms.html"><div class="icon-box"><i class="bi bi-file-text" style="color:#e65100;"></i></div><span>利用規約</span></a>
            <a href="#" id="feedbackMoreBtn"><div class="icon-box"><i class="bi bi-chat-dots" style="color:#f9a825;"></i></div><span>フィードバック</span></a>
            <a href="#" id="logoutMoreBtn"><div class="icon-box"><i class="bi bi-box-arrow-right" style="color:#e53935;"></i></div><span>ログアウト</span></a>
        </div>
        <div class="more-close"><button onclick="document.getElementById('moreMenuPopup').style.display='none'">閉じる</button></div>
    </div>

    <script src="js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Moreメニュー
            const moreBtn = document.getElementById('moreMenuBtn');
            const popup = document.getElementById('moreMenuPopup');
            if (moreBtn && popup) {
                moreBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    popup.style.display = (popup.style.display === 'none' || popup.style.display === '') ? 'block' : 'none';
                });
                document.addEventListener('click', function(e) {
                    if (popup.style.display === 'block') {
                        if (!e.target.closest('#moreMenuPopup') && !e.target.closest('#moreMenuBtn')) {
                            popup.style.display = 'none';
                        }
                    }
                });
            }
            // ログアウト
            const logoutBtn = document.getElementById('logoutMoreBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('ログアウトしますか？')) {
                        if (typeof liff !== 'undefined' && liff.isLoggedIn()) {
                            liff.logout();
                            window.location.reload();
                        } else {
                            window.location.href = '/';
                        }
                    }
                });
            }
            // フィードバック
            const feedbackBtn = document.getElementById('feedbackMoreBtn');
            if (feedbackBtn) {
                feedbackBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert('📝 フィードバック機能は準備中です。\ntomosche.line@gmail.com へご連絡ください。');
                });
            }
        });
    </script>
</body>
</html>
    `;
    
    document.open();
    document.write(html);
    document.close();
}
