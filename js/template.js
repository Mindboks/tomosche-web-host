// ================================================================
// ■ Tomosche 共通テンプレート（全UI一括管理）
// ■ 更新日: 2026-07-20
// ■ バージョン: 1.0.0
// ================================================================

// ================================================================
// 共通UIコンポーネント
// ================================================================
const TOMOSCHE_UI = {
    // ---- ヘッダー ----
    header: function() {
        return `
        <div class="header">
            <div class="logo">🌱 <span id="appName" data-i18n="app_name">Tomosche</span> <span class="logo-sub" id="appTagline" data-i18n="tagline">Social Scheduling</span></div>
            <div class="profile-icon" id="profileIcon"><i class="bi bi-person-circle"></i></div>
        </div>
        `;
    },

    // ---- メイン画像＋日付＋検索 ----
    imageSection: function() {
        return `
        <div class="image-wrapper">
            <img src="assets/images/toppageTmocha.png" alt="Tomosche" />
            <div class="image-date" id="dateDisplay">読み込み中...</div>
            <div class="image-search">
                <div class="search-box">
                    <i class="bi bi-search"></i>
                    <input type="text" id="globalSearch" data-i18n-placeholder="search_placeholder" placeholder="イベントや友達を検索..." />
                </div>
            </div>
        </div>
        `;
    },

    // ---- 友達アイコン ----
    avatars: function() {
        const friends = [
            { name: '田中', initial: '田', color: '#e3f2fd' },
            { name: '佐藤', initial: '佐', color: '#e8f5e9' },
            { name: '鈴木', initial: '鈴', color: '#fff3e0' },
            { name: '山田', initial: '山', color: '#fce4ec' }
        ];
        let html = `<div class="avatars" id="avatars">`;
        friends.forEach(f => {
            html += `
                <div class="avatar-item">
                    <div class="avatar-circle" style="background:${f.color};">${f.initial}</div>
                    <span class="avatar-name">${f.name}</span>
                </div>
            `;
        });
        html += `
            <a href="add_friends.html" class="avatar-item">
                <div class="avatar-circle avatar-add"><i class="bi bi-plus"></i></div>
                <span class="avatar-name" data-i18n="nav_add">${t('nav_add')}</span>
            </a>
        </div>`;
        return html;
    },

    // ---- 今日の予定 ----
    todayEvents: function() {
        const events = [
            { time: '10:00', title: '田中さんと打ち合わせ', person: '田中' },
            { time: '14:00', title: 'カレンダー共有設定', person: '佐藤' }
        ];
        let html = `
        <div class="today-card">
            <div class="today-header">
                <span><i class="bi bi-clock-history"></i> <span data-i18n="today_events">今日の予定</span></span>
                <a href="schedule.html" class="today-more" data-i18n="see_all">すべて見る →</a>
            </div>
            <div id="todayList">
        `;
        events.forEach(e => {
            html += `
                <div class="today-item">
                    <span class="today-time">${e.time}</span>
                    <span class="today-title">${e.title}</span>
                    <span class="today-person">👤 ${e.person}</span>
                </div>
            `;
        });
        html += `</div></div>`;
        return html;
    },

    // ---- 下部ナビゲーション ----
    bottomNav: function() {
        return `
        <div class="bottom-nav">
            <a href="/" class="nav-item active" data-nav="home"><i class="bi bi-house-fill"></i><span data-i18n="nav_home">ホーム</span></a>
            <a href="friends.html" class="nav-item" data-nav="friends"><i class="bi bi-people-fill"></i><span data-i18n="nav_friends">友達</span></a>
            <a href="schedule.html" class="nav-item" data-nav="calendar"><i class="bi bi-calendar-event-fill"></i><span data-i18n="nav_calendar">カレンダー</span></a>
            <a href="add_friends.html" class="nav-item" data-nav="add"><i class="bi bi-person-plus-fill"></i><span data-i18n="nav_add">追加</span></a>
            <div class="nav-item" id="moreMenuBtn"><i class="bi bi-grid-fill"></i><span data-i18n="nav_more">その他</span></div>
        </div>
        `;
    },

    // ---- Moreポップアップ ----
    morePopup: function() {
        return `
        <div class="more-popup" id="moreMenuPopup">
            <div class="more-grid">
                <a href="guide.html"><div class="icon-box"><i class="bi bi-book" style="color:#6a1b9a;"></i></div><span data-i18n="more_guide">使い方</span></a>
                <a href="privacy.html"><div class="icon-box"><i class="bi bi-shield-lock" style="color:#1565c0;"></i></div><span data-i18n="more_privacy">プライバシー</span></a>
                <a href="terms.html"><div class="icon-box"><i class="bi bi-file-text" style="color:#e65100;"></i></div><span data-i18n="more_terms">利用規約</span></a>
                <a href="#" id="feedbackMoreBtn"><div class="icon-box"><i class="bi bi-chat-dots" style="color:#f9a825;"></i></div><span data-i18n="more_feedback">フィードバック</span></a>
                <a href="#" id="logoutMoreBtn"><div class="icon-box"><i class="bi bi-box-arrow-right" style="color:#e53935;"></i></div><span data-i18n="more_logout">ログアウト</span></a>
            </div>
            <div class="more-close"><button onclick="document.getElementById('moreMenuPopup').style.display='none'"><span data-i18n="modal_close">閉じる</span></button></div>
            <div class="lang-section">
                <div class="lang-label" data-i18n="language">言語</div>
                <div class="lang-buttons" id="langButtons">
                    <button class="lang-btn" data-lang="ja" onclick="switchLanguage('ja')">日本語</button>
                    <button class="lang-btn" data-lang="en" onclick="switchLanguage('en')">English</button>
                    <button class="lang-btn" data-lang="zh-CN" onclick="switchLanguage('zh-CN')">中文</button>
                    <button class="lang-btn" data-lang="vi" onclick="switchLanguage('vi')">Tiếng Việt</button>
                    <button class="lang-btn" data-lang="th" onclick="switchLanguage('th')">ภาษาไทย</button>
                    <button class="lang-btn" data-lang="ne" onclick="switchLanguage('ne')">नेपाली</button>
                    <button class="lang-btn" data-lang="hi" onclick="switchLanguage('hi')">हिन्दी</button>
                    <button class="lang-btn" data-lang="ur" onclick="switchLanguage('ur')">اردو</button>
                    <button class="lang-btn" data-lang="bn" onclick="switchLanguage('bn')">বাংলা</button>
                    <button class="lang-btn" data-lang="si" onclick="switchLanguage('si')">සිංහල</button>
                    <button class="lang-btn" data-lang="my" onclick="switchLanguage('my')">မြန်မာ</button>
                    <button class="lang-btn" data-lang="ta" onclick="switchLanguage('ta')">தமிழ்</button>
                </div>
            </div>
        </div>
        `;
    },

    // ---- 予定追加モーダル ----
    addEventModal: function() {
        return `
        <div class="modal-overlay" id="addEventModal">
            <div class="modal-box">
                <h3 data-i18n="add_event">📝 新しい予定</h3>
                <p style="font-size:13px;color:#888;" id="modalDate">日付を選択してください</p>
                <label data-i18n="select_friend">👤 友達を選択</label>
                <select id="friendSelect"><option value="" data-i18n="select_friend">-- 友達を選択してください --</option></select>
                <label data-i18n="event_name">📌 予定名</label>
                <input type="text" id="eventTitle" data-i18n-placeholder="event_placeholder" placeholder="例：ランチ、ミーティング..." />
                <div class="time-row">
                    <div><label data-i18n="start_time">⏰ 開始</label><input type="time" id="eventStart" step="900" /></div>
                    <div><label data-i18n="end_time">⏰ 終了</label><input type="time" id="eventEnd" step="900" /></div>
                </div>
                <label data-i18n="note">📝 メモ（任意）</label>
                <textarea id="eventNote" rows="2" data-i18n-placeholder="event_note_placeholder" placeholder="詳細があれば入力してください..."></textarea>
                <div class="modal-actions">
                    <button class="btn-cancel" onclick="closeAddEventModal()" data-i18n="cancel">キャンセル</button>
                    <button class="btn-primary" id="confirmAddEventBtn" onclick="confirmAddEvent()" disabled data-i18n="submit">送信する</button>
                </div>
                <div id="addEventStatus" style="margin-top:12px;font-size:13px;text-align:center;display:none;"></div>
            </div>
        </div>
        `;
    },

    // ---- バージョン表示 ----
    version: function() {
        return `<div class="version" id="versionDisplay">Tomosche v1.0.0</div>`;
    },

    // ---- フルレイアウト ----
    fullLayout: function(content) {
        return `
        <div class="app-container">
            ${this.header()}
            ${this.imageSection()}
            ${this.avatars()}
            ${this.todayEvents()}
            ${content || ''}
        </div>
        ${this.version()}
        ${this.bottomNav()}
        ${this.morePopup()}
        ${this.addEventModal()}
        `;
    }
};

// ================================================================
// ■ ページレンダリング関数（共通UI + 個別コンテンツ）
// ================================================================
function renderPage(title, content, extraHead = '') {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const monthNamesJP = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const dateStr = `${now.getMonth() + 1}月${now.getDate()}日 ${hh}:${mm}`;

    const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title data-i18n="app_name">${title} - Tomosche</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://static.line-scdn.net/liff/edge/2.1/sdk.js"></script>
    <script src="js/i18n.js"></script>
    <script src="js/app.js"></script>
    <style>
        /* ====== ベーススタイル ====== */
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
            font-size: clamp(11px, 3vw, 14px);
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
            font-size: clamp(12px, 2.5vw, 14px);
            color: #333;
        }
        .image-search .search-box input::placeholder { color: #bbb; }
        .avatars {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            padding: 12px 0 8px 0;
        }
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
            font-size: clamp(14px, 2.5vw, 16px);
            font-weight: 600;
            color: #333;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .avatar-add {
            border: 2px dashed #ccc;
            color: #999;
            background: #f0f4f8;
            font-size: 20px;
        }
        .avatar-name {
            font-size: clamp(9px, 2vw, 10px);
            color: #888;
            text-align: center;
            max-width: 56px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
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
            font-size: clamp(13px, 2.5vw, 14px);
            color: #333;
            margin-bottom: 8px;
        }
        .today-header i { color: #06C755; margin-right: 6px; }
        .today-more {
            font-size: clamp(11px, 2vw, 12px);
            font-weight: 400;
            color: #06C755;
            text-decoration: none;
            white-space: nowrap;
        }
        .today-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f0f4f8;
            gap: 10px;
            font-size: clamp(12px, 2.2vw, 13px);
            white-space: nowrap;
        }
        .today-item:last-child { border-bottom: none; }
        .today-time {
            color: #06C755;
            font-weight: 600;
            min-width: 44px;
            font-size: clamp(11px, 2vw, 12px);
        }
        .today-title {
            flex: 1;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .today-person {
            color: #888;
            background: #f0f4f8;
            padding: 2px 10px;
            border-radius: 999px;
            font-size: clamp(10px, 1.8vw, 11px);
            white-space: nowrap;
        }
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
            font-size: clamp(9px, 1.8vw, 10px);
            color: #999;
            text-decoration: none;
            gap: 2px;
            background: none;
            border: none;
            padding: 4px 12px;
            cursor: pointer;
            flex: 1;
            max-width: 80px;
            white-space: nowrap;
        }
        .nav-item i { font-size: clamp(18px, 4vw, 20px); }
        .nav-item.active { color: #06C755; }
        .nav-item.active i { transform: translateY(-2px); }
        .nav-item:active { transform: scale(0.92); }
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
            white-space: nowrap;
        }
        .version {
            text-align: center;
            font-size: 10px;
            color: #ccc;
            padding: 8px 0 4px 0;
        }
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
        .more-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            text-align: center;
        }
        .more-grid a {
            text-decoration: none;
            color: #333;
            font-size: 12px;
        }
        .more-grid .icon-box {
            background: #f0f4f8;
            border-radius: 14px;
            padding: 14px;
        }
        .more-grid .icon-box i { font-size: 24px; }
        .more-grid span { display: block; margin-top: 4px; }
        .more-close {
            text-align: center;
            margin-top: 12px;
        }
        .more-close button {
            background: none;
            border: none;
            color: #999;
            font-size: 13px;
            padding: 4px 16px;
            cursor: pointer;
        }
        .lang-section {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #f0f4f8;
        }
        .lang-section .lang-label {
            font-size: 11px;
            color: #888;
            text-align: center;
            margin-bottom: 6px;
        }
        .lang-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            justify-content: center;
        }
        .lang-btn {
            background: #f0f4f8;
            border: none;
            border-radius: 999px;
            padding: 3px 10px;
            font-size: 10px;
            color: #666;
            cursor: pointer;
            transition: all 0.2s;
        }
        .lang-btn:hover {
            background: #06C755;
            color: white;
        }
        .lang-btn.active {
            background: #06C755;
            color: white;
        }
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(4px);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        .modal-box {
            background: white;
            border-radius: 24px;
            padding: 28px 24px;
            max-width: 420px;
            width: 92%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        .modal-box h3 { font-size: 18px; font-weight: 700; color: #333; margin-bottom: 16px; }
        .modal-box label { font-size: 13px; font-weight: 600; color: #555; margin-top: 12px; display: block; }
        .modal-box input, .modal-box select, .modal-box textarea {
            width: 100%;
            border: 1px solid #ddd;
            border-radius: 12px;
            padding: 12px 14px;
            font-size: 14px;
            outline: none;
            margin-top: 4px;
            transition: border 0.2s;
            background: white;
        }
        .modal-box input:focus, .modal-box select:focus, .modal-box textarea:focus { border-color: #06C755; }
        .time-row { display: flex; gap: 12px; }
        .time-row > div { flex: 1; }
        .modal-actions {
            display: flex;
            gap: 12px;
            margin-top: 20px;
        }
        .modal-actions button {
            flex: 1;
            padding: 12px;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 600;
            border: none;
            cursor: pointer;
        }
        .btn-cancel { background: #f0f0f0; color: #666; }
        .btn-cancel:hover { background: #e0e0e0; }
        .btn-primary { background: #06C755; color: white; }
        .btn-primary:hover { background: #049a44; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .add-event-btn {
            position: fixed;
            bottom: 100px;
            right: 24px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #06C755;
            color: white;
            border: none;
            font-size: 32px;
            box-shadow: 0 4px 20px rgba(6,199,85,0.4);
            z-index: 100;
            cursor: pointer;
        }
        .add-event-btn:active { transform: scale(0.9); }
        @media (max-width: 576px) {
            .app-container { padding: 0 12px 80px 12px; }
            .logo { font-size: 18px; }
            .logo-sub { font-size: 10px; }
            .image-date { font-size: clamp(10px, 2.5vw, 12px); padding: 4px 14px; top: 12px; }
            .image-search .search-box { padding: 8px 12px; }
            .image-search .search-box input { font-size: clamp(11px, 2.2vw, 12px); }
            .avatar-circle { width: 44px; height: 44px; font-size: clamp(12px, 2.2vw, 14px); }
            .avatar-name { font-size: clamp(8px, 1.8vw, 9px); }
            .today-item { font-size: clamp(11px, 2vw, 12px); }
            .today-time { min-width: 36px; font-size: clamp(10px, 1.8vw, 11px); }
            .nav-item { padding: 4px 8px; font-size: clamp(8px, 1.6vw, 9px); }
            .nav-item i { font-size: clamp(16px, 3.5vw, 18px); }
            .modal-box { padding: 20px 16px; }
        }
        @media (min-width: 768px) {
            .bottom-nav { max-width: 420px; left: 50%; transform: translateX(-50%); }
            .more-popup { max-width: 400px; }
        }
        ${extraHead}
    </style>
</head>
<body>
    ${TOMOSCHE_UI.fullLayout(content)}
    <script>
        // ================================================================
        // ■ 多言語適用（全UI）
        // ================================================================
        function applyAllTranslations() {
            document.title = t('app_name') + ' - Tomosche';
            document.querySelectorAll('[data-i18n]').forEach(el => {
                el.textContent = t(el.dataset.i18n);
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                el.placeholder = t(el.dataset.i18nPlaceholder);
            });
            // 言語ボタン
            const currentLang = getCurrentLang();
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === currentLang);
            });
            // 日付表示
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const monthNamesJP = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            const dateEl = document.getElementById('dateDisplay');
            if (dateEl) dateEl.textContent = `${now.getMonth() + 1}月${now.getDate()}日 ${hh}:${mm}`;
        }

        // ================================================================
        // ■ 言語切替
        // ================================================================
        function switchLanguage(lang) {
            if (lang && SUPPORTED_LANGS.includes(lang)) {
                localStorage.setItem('tomosche_lang', lang);
                applyAllTranslations();
            }
        }

        // ================================================================
        // ■ 予定追加モーダル
        // ================================================================
        function openAddEventModal(dateStr) {
            document.getElementById('modalDate').textContent = dateStr || t('no_events');
            document.getElementById('addEventModal').style.display = 'flex';
            document.getElementById('confirmAddEventBtn').disabled = true;
            document.getElementById('addEventStatus').style.display = 'none';
        }
        function closeAddEventModal() {
            document.getElementById('addEventModal').style.display = 'none';
        }
        function checkAddEventForm() {
            const title = document.getElementById('eventTitle').value.trim();
            const start = document.getElementById('eventStart').value;
            const end = document.getElementById('eventEnd').value;
            const friend = document.getElementById('friendSelect').value;
            document.getElementById('confirmAddEventBtn').disabled = !(title && start && end && friend);
        }
        function confirmAddEvent() {
            const title = document.getElementById('eventTitle').value.trim();
            const start = document.getElementById('eventStart').value;
            const end = document.getElementById('eventEnd').value;
            const friend = document.getElementById('friendSelect').value;
            const status = document.getElementById('addEventStatus');
            if (!title || !start || !end || !friend) {
                status.style.display = 'block';
                status.style.color = '#e53935';
                status.textContent = t('event_error');
                return;
            }
            if (start >= end) {
                status.style.display = 'block';
                status.style.color = '#e53935';
                status.textContent = t('event_time_error');
                return;
            }
            status.style.display = 'block';
            status.style.color = '#06C755';
            status.textContent = t('event_added');
            setTimeout(closeAddEventModal, 1500);
        }

        // ================================================================
        // ■ イベントリスナー
        // ================================================================
        document.addEventListener('DOMContentLoaded', function() {
            applyAllTranslations();

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
                    if (confirm(t('confirm_logout'))) {
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
                    alert(t('feedback_message') + '\\n' + t('feedback_email'));
                });
            }

            // 検索
            const searchInput = document.getElementById('globalSearch');
            if (searchInput) {
                searchInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        const q = this.value.trim();
                        if (q) alert('🔍 "' + q + '" (' + t('search_placeholder') + ')');
                    }
                });
            }

            // モーダル外クリックで閉じる
            const modal = document.getElementById('addEventModal');
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === this) closeAddEventModal();
                });
            }

            // 入力チェック
            ['eventTitle', 'eventStart', 'eventEnd'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', checkAddEventForm);
            });
            const friendSelect = document.getElementById('friendSelect');
            if (friendSelect) friendSelect.addEventListener('change', checkAddEventForm);

            // LIFF初期化
            (async function() {
                try {
                    await liff.init({ liffId: '2010384200-BS1cr2CR' });
                    if (!liff.isLoggedIn()) {
                        liff.login();
                        return;
                    }
                    const profile = await liff.getProfile();
                    console.log('ログイン中:', profile.displayName);
                } catch (e) {
                    console.error('LIFF error:', e);
                }
            })();
        });
    </script>
</body>
</html>
    `;

    document.open();
    document.write(html);
    document.close();
}
