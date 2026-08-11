// ================================================================
// Tomosche 共通テンプレート
// ================================================================

function renderPage(title, content, activeNav) {
    const navItems = [
        { id: 'home', href: '/', icon: 'bi-house-fill', label: 'Home' },
        { id: 'friends', href: 'friends.html', icon: 'bi-people-fill', label: 'Friends' },
        { id: 'calendar', href: 'calendar.html', icon: 'bi-calendar-event-fill', label: 'Calendar' },
        { id: 'add', href: 'add.html', icon: 'bi-person-plus-fill', label: 'Add' }
    ];

    let navHtml = navItems.map(item => {
        const isActive = (item.id === activeNav);
        const activeClass = isActive ? 'active-page' : '';
        return `<a href="${item.href}" class="nav-item ${activeClass}" data-nav="${item.id}">
            <i class="bi ${item.icon}"></i>
            <span>${item.label}</span>
        </a>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>${title} - Tomosche</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <script src="https://static.line-scdn.net/liff/edge/2.1/sdk.js"></script>
    <style>
        .bottom-nav {
            position: fixed; bottom: 0; left: 0; right: 0;
            background: #ffffff; display: flex; justify-content: space-around;
            padding: 6px 0 14px 0; border-top: 1px solid #f0f4f8;
            z-index: 100; box-shadow: 0 -2px 12px rgba(0,0,0,0.04);
            max-width: 420px; margin: 0 auto;
        }
        .nav-item {
            display: flex; flex-direction: column; align-items: center;
            font-size: clamp(9px, 1.8vw, 10px);
            text-decoration: none; gap: 2px; background: none; border: none;
            padding: 4px 12px; cursor: pointer; flex: 1; max-width: 80px; white-space: nowrap;
            transition: all 0.2s;
            color: #06C755;
        }
        .nav-item i { font-size: clamp(18px, 4vw, 20px); }
        .nav-item:hover { color: #049a44; }
        .nav-item:active { transform: scale(0.92); }
        .nav-item.active-page {
            color: #a5d6a7;
            pointer-events: none;
            cursor: default;
        }
        .app-container { max-width:420px; margin:0 auto; padding:0 16px 80px 16px; background:#fff; }
        .header { display:flex; justify-content:space-between; align-items:center; padding:16px 0 8px 0; }
        .logo { font-size:22px; font-weight:700; color:#06C755; }
        .logo-sub { font-size:11px; color:#999; font-weight:400; margin-left:6px; }
        .profile-icon { font-size:28px; color:#06C755; cursor:pointer; display:flex; align-items:center; gap:6px; }
        .profile-icon .user-name { font-size:12px; color:#333; font-weight:500; }
        .back-btn { background:none; border:none; font-size:22px; color:#06C755; padding:0; margin-right:8px; cursor:pointer; }
        .page-title { font-size:clamp(1.1rem,4vw,1.6rem); font-weight:600; margin:0; color:#333; white-space:nowrap; }
        .version { text-align:center; font-size:10px; color:#ccc; padding:8px 0 4px 0; }

        .more-popup {
            display:none; position:fixed; bottom:76px; left:50%; transform:translateX(-50%);
            background:white; border-radius:20px; padding:20px;
            box-shadow:0 8px 40px rgba(0,0,0,0.12); z-index:999;
            border:1px solid #f0f4f8; width:92%; max-width:400px;
        }
        .more-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; text-align:center; }
        .more-grid a { text-decoration:none; color:#333; font-size:12px; }
        .more-grid .icon-box { background:#f0f4f8; border-radius:14px; padding:14px; }
        .more-grid .icon-box i { font-size:24px; }
        .more-grid span { display:block; margin-top:4px; }
        .more-close { text-align:center; margin-top:12px; }
        .more-close button { background:none; border:none; color:#999; font-size:13px; padding:4px 16px; cursor:pointer; }

        .modal-overlay {
            display:none; position:fixed; inset:0;
            background:rgba(0,0,0,0.4); backdrop-filter:blur(4px);
            align-items:center; justify-content:center; z-index:9999;
        }
        .modal-box {
            background:white; border-radius:24px; padding:28px 24px;
            max-width:420px; width:92%; max-height:90vh; overflow-y:auto;
            box-shadow:0 20px 60px rgba(0,0,0,0.2);
        }
        .modal-box h3 { font-size:18px; font-weight:700; color:#333; margin-bottom:16px; }
        .modal-box label { font-size:13px; font-weight:600; color:#555; margin-top:12px; display:block; }
        .modal-box input, .modal-box select, .modal-box textarea {
            width:100%; border:1px solid #ddd; border-radius:12px;
            padding:12px 14px; font-size:14px; outline:none; margin-top:4px;
            background:white;
        }
        .modal-box input:focus, .modal-box select:focus, .modal-box textarea:focus { border-color:#06C755; }
        .time-row { display:flex; gap:12px; }
        .time-row > div { flex:1; }
        .modal-actions { display:flex; gap:12px; margin-top:20px; }
        .modal-actions button { flex:1; padding:12px; border-radius:999px; font-size:14px; font-weight:600; border:none; cursor:pointer; }
        .btn-cancel { background:#f0f0f0; color:#666; }
        .btn-cancel:hover { background:#e0e0e0; }
        .btn-primary { background:#06C755; color:white; }
        .btn-primary:hover { background:#049a44; }
        .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }

        @media (max-width:576px) {
            .app-container { padding:0 12px 80px 12px; }
            .logo { font-size:18px; }
            .logo-sub { font-size:10px; }
            .nav-item { padding:4px 8px; font-size:clamp(8px,1.6vw,9px); }
            .nav-item i { font-size:clamp(16px,3.5vw,18px); }
            .modal-box { padding:20px 16px; }
        }
        @media (min-width:768px) {
            .bottom-nav { max-width:420px; }
            .more-popup { max-width:400px; }
        }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="header">
            <div class="logo">🌱 Tomosche <span class="logo-sub">Social Scheduling</span></div>
            <div class="profile-icon" id="profileIcon">
                <i class="bi bi-person-circle"></i>
                <span class="user-name" id="userNameDisplay">Loading...</span>
            </div>
        </div>

        ${content}

        <div class="version" id="versionDisplay"></div>
    </div>

    <div class="bottom-nav">
        ${navHtml}
        <div class="nav-item" id="moreMenuBtn"><i class="bi bi-grid-fill"></i><span>More</span></div>
    </div>

    <div class="more-popup" id="moreMenuPopup">
        <div class="more-grid">
            <a href="guide.html"><div class="icon-box"><i class="bi bi-book" style="color:#6a1b9a;"></i></div><span>Guide</span></a>
            <a href="privacy.html"><div class="icon-box"><i class="bi bi-shield-lock" style="color:#1565c0;"></i></div><span>Privacy Policy</span></a>
            <a href="terms.html"><div class="icon-box"><i class="bi bi-file-text" style="color:#e65100;"></i></div><span>Terms of Service</span></a>
            <a href="#" id="feedbackMoreBtn"><div class="icon-box"><i class="bi bi-chat-dots" style="color:#f9a825;"></i></div><span>Feedback</span></a>
            <a href="#" id="logoutMoreBtn"><div class="icon-box"><i class="bi bi-box-arrow-right" style="color:#e53935;"></i></div><span>Logout</span></a>
        </div>
        <div class="more-close"><button onclick="closeMorePopup()">Close</button></div>
    </div>

    <div class="modal-overlay" id="feedbackModal">
        <div class="modal-box">
            <h3>📝 Feedback</h3>
            <p style="font-size:13px;color:#888;margin-bottom:16px;">Share your feedback, feature requests, or report issues.</p>
            <label>Your Message</label>
            <textarea id="feedbackMessage" rows="4" placeholder="Write your feedback here..." style="width:100%;border:1px solid #ddd;border-radius:12px;padding:12px 14px;font-size:14px;outline:none;margin-top:4px;background:white;resize:vertical;"></textarea>
            <div class="modal-actions">
                <button class="btn-cancel" onclick="closeFeedbackModal()">Cancel</button>
                <button class="btn-primary" onclick="submitFeedback()">Send</button>
            </div>
            <div id="feedbackStatus" style="margin-top:12px;font-size:13px;text-align:center;display:none;"></div>
        </div>
    </div>

    <script src="js/config.js"></script>
    <script src="js/app.js"></script>
    <script>
        // ====== プロフィール表示 ======
        function updateProfileDisplay() {
            const nameEl = document.getElementById('userNameDisplay');
            if (!nameEl) return;
            if (window.currentUser && window.currentUser.displayName) {
                nameEl.textContent = window.currentUser.displayName;
            } else if (typeof liff !== 'undefined' && liff.isLoggedIn()) {
                liff.getProfile().then(profile => {
                    nameEl.textContent = profile.displayName;
                    window.currentUser = { userId: profile.userId, displayName: profile.displayName };
                }).catch(() => { nameEl.textContent = 'Guest'; });
            } else {
                nameEl.textContent = 'Guest';
            }
        }

        // ====== Moreメニュー制御（共通化・確実に動作） ======
        function toggleMorePopup() {
            const popup = document.getElementById('moreMenuPopup');
            if (!popup) return;
            const isVisible = popup.style.display === 'block';
            popup.style.display = isVisible ? 'none' : 'block';
        }

        function closeMorePopup() {
            const popup = document.getElementById('moreMenuPopup');
            if (popup) popup.style.display = 'none';
        }

        document.addEventListener('DOMContentLoaded', function() {
            // ====== バージョン表示 ======
            const vEl = document.getElementById('versionDisplay');
            if (vEl) vEl.textContent = getFullVersion();

            // ====== プロフィール表示 ======
            updateProfileDisplay();
            setTimeout(updateProfileDisplay, 500);
            setTimeout(updateProfileDisplay, 1500);

            // ====== Moreメニュー（確実に動作） ======
            const moreBtn = document.getElementById('moreMenuBtn');
            const popup = document.getElementById('moreMenuPopup');
            
            if (moreBtn) {
                // クリックで切り替え
                moreBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleMorePopup();
                });
            }

            // ポップアップ外クリックで閉じる
            document.addEventListener('click', function(e) {
                if (!popup) return;
                if (popup.style.display === 'block') {
                    const isClickInside = popup.contains(e.target) || (moreBtn && moreBtn.contains(e.target));
                    if (!isClickInside) {
                        popup.style.display = 'none';
                    }
                }
            });

            // ====== ログアウト ======
            const logoutBtn = document.getElementById('logoutMoreBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('Logout?')) {
                        if (typeof liff !== 'undefined' && liff.isLoggedIn()) {
                            liff.logout();
                            window.location.reload();
                        } else {
                            window.location.href = '/';
                        }
                    }
                });
            }

            // ====== フィードバック ======
            const feedbackBtn = document.getElementById('feedbackMoreBtn');
            if (feedbackBtn) {
                feedbackBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById('feedbackModal').style.display = 'flex';
                    document.getElementById('feedbackMessage').value = '';
                    document.getElementById('feedbackStatus').style.display = 'none';
                    closeMorePopup(); // Moreポップアップを閉じる
                });
            }
        });

        function closeFeedbackModal() {
            document.getElementById('feedbackModal').style.display = 'none';
        }

        function submitFeedback() {
            const message = document.getElementById('feedbackMessage').value.trim();
            const status = document.getElementById('feedbackStatus');
            if (!message) {
                status.style.display = 'block';
                status.style.color = '#e53935';
                status.textContent = 'Please enter your feedback.';
                return;
            }
            status.style.display = 'block';
            status.textContent = 'Sending...';
            status.style.color = '#666';
            setTimeout(() => {
                status.style.color = '#06C755';
                status.textContent = '✅ Thank you for your feedback!';
                setTimeout(closeFeedbackModal, 1500);
            }, 1000);
        }

        document.getElementById('feedbackModal').addEventListener('click', function(e) {
            if (e.target === this) closeFeedbackModal();
        });
    </script>
</body>
</html>`;
    document.open();
    document.write(html);
    document.close();
}
