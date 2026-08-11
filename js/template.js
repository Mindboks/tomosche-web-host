// ================================================================
// Tomosche 共通テンプレート v1.0.0.2
// 全ページのヘッダー・フッター・モーダルを一元管理
// ================================================================

function renderPage(title, content, activeNav) {
    const now = new Date();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dateStr = `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

    // ナビゲーション項目
    const navItems = [
        { id: 'home', href: '/', icon: 'bi-house-fill', label: 'Home' },
        { id: 'friends', href: 'friends.html', icon: 'bi-people-fill', label: 'Friends' },
        { id: 'calendar', href: 'calendar.html', icon: 'bi-calendar-event-fill', label: 'Calendar' },
        { id: 'add', href: 'add.html', icon: 'bi-person-plus-fill', label: 'Add' }
    ];

    let navHtml = navItems.map(item => {
        const isActive = (item.id === activeNav);
        // 現在のページのボタンは非表示（hidden-itemクラス）
        return `<a href="${item.href}" class="nav-item ${isActive ? 'hidden-item' : ''}" data-nav="${item.id}">
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
</head>
<body>
    <div class="app-container">
        <!-- ====== ヘッダー ====== -->
        <div class="header">
            <div class="logo">🌱 Tomosche <span class="logo-sub">Social Scheduling</span></div>
            <div class="profile-icon" id="profileIcon">
                <i class="bi bi-person-circle"></i>
                <span class="user-name" id="userNameDisplay">Loading...</span>
            </div>
        </div>

        <!-- ====== ページコンテンツ ====== -->
        ${content}

        <div class="version" id="versionDisplay">Tomosche v1.0.0.2</div>
    </div>

    <!-- ====== 下部ナビゲーション ====== -->
    <div class="bottom-nav">
        ${navHtml}
        <div class="nav-item" id="moreMenuBtn"><i class="bi bi-grid-fill"></i><span>More</span></div>
    </div>

    <!-- ====== Moreポップアップ ====== -->
    <div class="more-popup" id="moreMenuPopup">
        <div class="more-grid">
            <a href="guide.html"><div class="icon-box"><i class="bi bi-book" style="color:#6a1b9a;"></i></div><span>Guide</span></a>
            <a href="privacy.html"><div class="icon-box"><i class="bi bi-shield-lock" style="color:#1565c0;"></i></div><span>Privacy Policy</span></a>
            <a href="terms.html"><div class="icon-box"><i class="bi bi-file-text" style="color:#e65100;"></i></div><span>Terms of Service</span></a>
            <a href="#" id="feedbackMoreBtn"><div class="icon-box"><i class="bi bi-chat-dots" style="color:#f9a825;"></i></div><span>Feedback</span></a>
            <a href="#" id="logoutMoreBtn"><div class="icon-box"><i class="bi bi-box-arrow-right" style="color:#e53935;"></i></div><span>Logout</span></a>
        </div>
        <div class="more-close"><button onclick="document.getElementById('moreMenuPopup').style.display='none'">Close</button></div>
    </div>

    <!-- ====== フィードバックモーダル ====== -->
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
        document.addEventListener('DOMContentLoaded', function() {
            // ====== バージョン表示 ======
            const vEl = document.getElementById('versionDisplay');
            if (vEl) vEl.textContent = getFullVersion();

            // ====== プロフィールアイコン（LINEログイン情報） ======
            const nameEl = document.getElementById('userNameDisplay');
            if (nameEl) {
                if (currentUser && currentUser.displayName) {
                    nameEl.textContent = currentUser.displayName;
                } else {
                    // LIFFから取得を試みる
                    if (typeof liff !== 'undefined' && liff.isLoggedIn()) {
                        liff.getProfile().then(profile => {
                            nameEl.textContent = profile.displayName;
                            currentUser = { userId: profile.userId, displayName: profile.displayName };
                        }).catch(() => {
                            nameEl.textContent = 'Guest';
                        });
                    } else {
                        nameEl.textContent = 'Guest';
                    }
                }
            }

            // ====== Moreメニュー ======
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
                });
            }
        });

        // ====== フィードバック関数 ======
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
