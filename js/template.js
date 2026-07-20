// ================================================================
// Tomosche 共通テンプレート（Moreメニュー言語対応版）
// ================================================================

// ----- 共通UIコンポーネント -----
const UI = {
    header: () => `
        <div class="header">
            <div class="logo">🌱 Tomosche <span class="logo-sub">Shared Calendar</span></div>
            <div class="profile-icon"><i class="bi bi-person-circle"></i></div>
        </div>
    `,

    footer: () => `
        <div class="version">Tomosche v1.0.0</div>
    `,

    bottomNav: (active) => {
        const items = [
            { id: 'home', href: '/', icon: 'house-fill', label: 'Home' },
            { id: 'friends', href: 'friends.html', icon: 'people-fill', label: 'Friends' },
            { id: 'calendar', href: 'schedule.html', icon: 'calendar-event-fill', label: 'Calendar' },
            { id: 'add', href: 'add_friends.html', icon: 'person-plus-fill', label: 'Add' },
        ];
        const nav = items.map(item => `
            <a href="${item.href}" class="nav-item ${item.id === active ? 'active' : ''}">
                <i class="bi bi-${item.icon}"></i>
                <span>${item.label}</span>
            </a>
        `).join('');
        return `
            <div class="bottom-nav">
                ${nav}
                <div class="nav-item" id="moreMenuBtn"><i class="bi bi-grid-fill"></i><span>More</span></div>
            </div>
        `;
    },

    // ================================================================
    // Moreポップアップ（言語対応リンク）
    // ================================================================
    morePopup: () => {
        // 現在の言語を取得（i18n.js の関数を使用）
        const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'en';
        // サポート言語（フォールバックは 'en'）
        const supported = ['ja', 'en', 'vi', 'th', 'ne', 'hi', 'ur', 'bn', 'si', 'my', 'ta'];
        const currentLang = supported.includes(lang) ? lang : 'en';

        return `
        <div class="more-popup" id="moreMenuPopup">
            <div class="more-grid">
                <!-- Guide: 言語対応URL -->
                <a href="/docs/${currentLang}/guide.html">
                    <div class="icon-box"><i class="bi bi-book"></i></div>
                    <span>Guide</span>
                </a>
                <!-- Privacy: 言語対応URL -->
                <a href="/docs/${currentLang}/privacy.html">
                    <div class="icon-box"><i class="bi bi-shield-lock"></i></div>
                    <span>Privacy</span>
                </a>
                <!-- Terms: 言語対応URL -->
                <a href="/docs/${currentLang}/terms.html">
                    <div class="icon-box"><i class="bi bi-file-text"></i></div>
                    <span>Terms</span>
                </a>
                <a href="#" id="feedbackMoreBtn">
                    <div class="icon-box"><i class="bi bi-chat-dots"></i></div>
                    <span>Feedback</span>
                </a>
                <a href="#" id="logoutMoreBtn">
                    <div class="icon-box"><i class="bi bi-box-arrow-right"></i></div>
                    <span>Logout</span>
                </a>
            </div>
            <div class="more-close"><button onclick="document.getElementById('moreMenuPopup').style.display='none'">Close</button></div>
            <div class="lang-section">
                <div class="lang-label">Language</div>
                <div class="lang-buttons">
                    ${['ja','en','vi','th','ne','hi','ur','bn','si','my','ta'].map(l =>
                        `<button class="lang-btn ${l === currentLang ? 'active' : ''}" data-lang="${l}" onclick="switchLanguage('${l}')">${l}</button>`
                    ).join('')}
                </div>
            </div>
        </div>
        `;
    },

    // ----- フィードバックモーダル（変更なし） -----
    feedbackModal: () => `
        <div class="feedback-modal" id="feedbackModal">
            <div class="feedback-box">
                <h3>📝 Send Feedback</h3>
                <p>Your feedback helps us improve.</p>
                <textarea id="fbMessage" placeholder="Write your message here..."></textarea>
                <div class="fb-actions">
                    <button class="fb-cancel" onclick="closeFeedback()">Cancel</button>
                    <button class="fb-send" id="fbSendBtn" onclick="sendFeedback()">Send</button>
                </div>
                <div id="fbStatus"></div>
            </div>
        </div>
    `,

    // ----- 予定追加モーダル（変更なし） -----
    eventModal: () => `
        <div class="modal-overlay" id="addEventModal">
            <div class="modal-box">
                <h3>📝 New Event</h3>
                <p style="font-size:13px;color:#888;" id="modalDate">Select a date</p>
                <label>👤 Select a friend</label>
                <select id="friendSelect"><option value="">-- Select a friend --</option></select>
                <label>📌 Event name</label>
                <input type="text" id="eventTitle" placeholder="e.g. Lunch, Meeting..." />
                <div class="time-row">
                    <div><label>⏰ Start</label><input type="time" id="eventStart" step="900" /></div>
                    <div><label>⏰ End</label><input type="time" id="eventEnd" step="900" /></div>
                </div>
                <label>📝 Note (optional)</label>
                <textarea id="eventNote" rows="2" placeholder="Add details..."></textarea>
                <div class="modal-actions">
                    <button class="btn-cancel" onclick="closeAddEventModal()">Cancel</button>
                    <button class="btn-primary" id="confirmAddEventBtn" onclick="confirmAddEvent()" disabled>Submit</button>
                </div>
                <div id="addEventStatus" style="margin-top:12px;font-size:13px;text-align:center;display:none;"></div>
            </div>
        </div>
    `
};

// ----- 共通JavaScript処理（モーダル制御など） -----
const App = {
    openFeedback() {
        document.getElementById('feedbackModal').style.display = 'flex';
        document.getElementById('fbMessage').value = '';
        document.getElementById('fbStatus').style.display = 'none';
    },
    closeFeedback() {
        document.getElementById('feedbackModal').style.display = 'none';
    },
    sendFeedback() {
        const msg = document.getElementById('fbMessage').value.trim();
        const status = document.getElementById('fbStatus');
        if (!msg) { status.style.display = 'block'; status.style.color = '#e53935'; status.textContent = 'Please enter a message.'; return; }
        if (msg.length < 5) { status.style.display = 'block'; status.style.color = '#e53935'; status.textContent = 'Please provide more details.'; return; }
        window.location.href = `mailto:tomosche.line@gmail.com?subject=${encodeURIComponent('Tomosche Feedback')}&body=${encodeURIComponent(msg + '\n\n---\nSent from Tomosche app')}`;
        status.style.display = 'block'; status.style.color = '#06C755'; status.textContent = '✅ Thank you!';
        setTimeout(() => document.getElementById('feedbackModal').style.display = 'none', 1500);
    },

    openEventModal(dateStr) {
        document.getElementById('modalDate').textContent = dateStr || 'Select a date';
        document.getElementById('addEventModal').style.display = 'flex';
        document.getElementById('confirmAddEventBtn').disabled = true;
        document.getElementById('addEventStatus').style.display = 'none';
        const select = document.getElementById('friendSelect');
        select.innerHTML = '<option value="">-- Select a friend --</option>';
        ['Friend A', 'Friend B', 'Friend C'].forEach(f => {
            const opt = document.createElement('option');
            opt.value = f;
            opt.textContent = f;
            select.appendChild(opt);
        });
    },
    closeEventModal() {
        document.getElementById('addEventModal').style.display = 'none';
    },
    checkEventForm() {
        const title = document.getElementById('eventTitle').value.trim();
        const start = document.getElementById('eventStart').value;
        const end = document.getElementById('eventEnd').value;
        const friend = document.getElementById('friendSelect').value;
        document.getElementById('confirmAddEventBtn').disabled = !(title && start && end && friend);
    },
    confirmEvent() {
        const title = document.getElementById('eventTitle').value.trim();
        const start = document.getElementById('eventStart').value;
        const end = document.getElementById('eventEnd').value;
        const friend = document.getElementById('friendSelect').value;
        const status = document.getElementById('addEventStatus');
        if (!title || !start || !end || !friend) {
            status.style.display = 'block'; status.style.color = '#e53935'; status.textContent = 'Please fill in all fields.';
            return;
        }
        if (start >= end) {
            status.style.display = 'block'; status.style.color = '#e53935'; status.textContent = '⚠️ End time must be after start time.';
            return;
        }
        status.style.display = 'block'; status.style.color = '#06C755'; status.textContent = '✅ Event added!';
        setTimeout(() => document.getElementById('addEventModal').style.display = 'none', 1500);
    },

    switchLanguage(lang) {
        if (lang && ['ja','en','vi','th','ne','hi','ur','bn','si','my','ta'].includes(lang)) {
            localStorage.setItem('tomosche_lang', lang);
            location.reload();
        }
    },

    init(callback) {
        document.addEventListener('DOMContentLoaded', function() {
            // Moreメニュー
            const moreBtn = document.getElementById('moreMenuBtn');
            const popup = document.getElementById('moreMenuPopup');
            if (moreBtn && popup) {
                moreBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
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

            // フィードバック
            document.getElementById('feedbackMoreBtn').addEventListener('click', function(e) {
                e.preventDefault();
                App.openFeedback();
            });

            // ログアウト
            document.getElementById('logoutMoreBtn').addEventListener('click', function(e) {
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

            // モーダル外クリックで閉じる
            document.getElementById('addEventModal').addEventListener('click', function(e) {
                if (e.target === this) App.closeEventModal();
            });
            document.getElementById('feedbackModal').addEventListener('click', function(e) {
                if (e.target === this) App.closeFeedback();
            });

            // 予定追加フォーム
            ['eventTitle', 'eventStart', 'eventEnd'].forEach(id => {
                document.getElementById(id).addEventListener('input', App.checkEventForm);
            });
            document.getElementById('friendSelect').addEventListener('change', App.checkEventForm);

            if (callback) callback();

            (async function() {
                try {
                    await liff.init({ liffId: '2010384200-BS1cr2CR' });
                    if (!liff.isLoggedIn()) { liff.login(); return; }
                    const profile = await liff.getProfile();
                    console.log('✅ Logged in:', profile.displayName);
                } catch (e) {
                    console.error('❌ LIFF error:', e);
                }
            })();
        });
    }
};

// ----- ページレンダリング関数 -----
function renderPage(title, content, activeNav = 'home') {
    const html = `
<!DOCTYPE html>
<html lang="en">
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
    <script src="js/config.js"></script>
    <script src="js/i18n.js"></script>
    <script src="js/app.js"></script>
    <script src="js/template.js"></script>
</head>
<body>
    <div class="app-container">
        ${UI.header()}
        ${content}
        ${UI.footer()}
    </div>
    ${UI.bottomNav(activeNav)}
    ${UI.morePopup()}
    ${UI.feedbackModal()}
    ${UI.eventModal()}
    <script>
        window.openFeedback = App.openFeedback;
        window.closeFeedback = App.closeFeedback;
        window.sendFeedback = App.sendFeedback;
        window.openAddEventModal = App.openEventModal;
        window.closeAddEventModal = App.closeEventModal;
        window.confirmAddEvent = App.confirmEvent;
        window.switchLanguage = App.switchLanguage;
        window.checkAddEventForm = App.checkEventForm;
        App.init();
    </script>
</body>
</html>
    `;

    document.open();
    document.write(html);
    document.close();
}
