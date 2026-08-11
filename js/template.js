// ================================================================
// Tomosche 共通テンプレート v1.0.0.1
// ================================================================

function renderPage(title, content) {
    const now = new Date();
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dateStr = `Today・${monthNames[now.getMonth()]} ${now.getDate()}  ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

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
        .app-container { max-width:420px; margin:0 auto; padding:0 16px 80px 16px; background:#fff; }
        .header { display:flex; justify-content:space-between; align-items:center; padding:16px 0 8px 0; }
        .logo { font-size:22px; font-weight:700; color:#06C755; }
        .logo-sub { font-size:11px; color:#999; font-weight:400; margin-left:6px; }
        .profile-icon { font-size:28px; color:#06C755; cursor:pointer; }
        .back-btn { background:none; border:none; font-size:22px; color:#06C755; padding:0; margin-right:8px; cursor:pointer; }
        .page-title { font-size:clamp(1.1rem,4vw,1.6rem); font-weight:600; margin:0; color:#333; white-space:nowrap; }
        .version { text-align:center; font-size:10px; color:#ccc; padding:8px 0 4px 0; }
        .bottom-nav { position:fixed; bottom:0; left:0; right:0; background:#fff; display:flex; justify-content:space-around; padding:6px 0 14px 0; border-top:1px solid #f0f4f8; z-index:100; box-shadow:0 -2px 12px rgba(0,0,0,0.04); max-width:420px; margin:0 auto; }
        .nav-item { display:flex; flex-direction:column; align-items:center; font-size:clamp(9px,1.8vw,10px); color:#999; text-decoration:none; gap:2px; background:none; border:none; padding:4px 12px; cursor:pointer; flex:1; max-width:80px; white-space:nowrap; }
        .nav-item i { font-size:clamp(18px,4vw,20px); }
        .nav-item.active { color:#06C755; }
        .nav-item.active i { transform:translateY(-2px); }
        .nav-item:active { transform:scale(0.92); }
        .more-popup { display:none; position:fixed; bottom:76px; left:50%; transform:translateX(-50%); background:white; border-radius:20px; padding:20px; box-shadow:0 8px 40px rgba(0,0,0,0.12); z-index:999; border:1px solid #f0f4f8; width:92%; max-width:400px; }
        .more-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; text-align:center; }
        .more-grid a { text-decoration:none; color:#333; font-size:12px; }
        .more-grid .icon-box { background:#f0f4f8; border-radius:14px; padding:14px; }
        .more-grid .icon-box i { font-size:24px; }
        .more-grid span { display:block; margin-top:4px; }
        .more-close { text-align:center; margin-top:12px; }
        .more-close button { background:none; border:none; color:#999; font-size:13px; padding:4px 16px; cursor:pointer; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); backdrop-filter:blur(4px); display:none; align-items:center; justify-content:center; z-index:9999; }
        .modal-box { background:white; border-radius:24px; padding:28px 24px; max-width:420px; width:92%; max-height:90vh; overflow-y:auto; box-shadow:0 20px 60px rgba(0,0,0,0.2); }
        .modal-box h3 { font-size:18px; font-weight:700; color:#333; margin-bottom:16px; }
        .modal-box label { font-size:13px; font-weight:600; color:#555; margin-top:12px; display:block; }
        .modal-box input, .modal-box select, .modal-box textarea { width:100%; border:1px solid #ddd; border-radius:12px; padding:12px 14px; font-size:14px; outline:none; margin-top:4px; background:white; }
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
        .add-event-btn { position:fixed; bottom:100px; right:24px; width:60px; height:60px; border-radius:50%; background:#06C755; color:white; border:none; font-size:32px; box-shadow:0 4px 20px rgba(6,199,85,0.4); z-index:100; cursor:pointer; }
        .add-event-btn:active { transform:scale(0.9); }
        @media (max-width:576px) { .app-container { padding:0 12px 80px 12px; } .logo { font-size:18px; } .logo-sub { font-size:10px; } .nav-item { padding:4px 8px; font-size:clamp(8px,1.6vw,9px); } .nav-item i { font-size:clamp(16px,3.5vw,18px); } .modal-box { padding:20px 16px; } }
        @media (min-width:768px) { .bottom-nav { max-width:420px; } .more-popup { max-width:400px; } }
    </style>
</head>
<body>
    <div class="app-container">
        ${content}
    </div>
    <div class="version" id="versionDisplay">Tomosche v1.0.0.1</div>

    <!-- ====== 下部ナビゲーション ====== -->
    <div class="bottom-nav">
        <a href="/" class="nav-item" data-nav="home"><i class="bi bi-house-fill"></i><span>Home</span></a>
        <a href="friends.html" class="nav-item" data-nav="friends"><i class="bi bi-people-fill"></i><span>Friends</span></a>
        <a href="calendar.html" class="nav-item" data-nav="calendar"><i class="bi bi-calendar-event-fill"></i><span>Calendar</span></a>
        <a href="add.html" class="nav-item" data-nav="add"><i class="bi bi-person-plus-fill"></i><span>Add</span></a>
        <div class="nav-item" id="moreMenuBtn"><i class="bi bi-grid-fill"></i><span>More</span></div>
    </div>

    <!-- ====== Moreポップアップ（完全英語表記） ====== -->
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

    <!-- ====== 予定追加モーダル ====== -->
    <div class="modal-overlay" id="addEventModal">
        <div class="modal-box">
            <h3>📝 New Event</h3>
            <p style="font-size:13px;color:#888;" id="modalDate">Select a date</p>
            <label>👤 Select Friend</label>
            <select id="friendSelect"><option value="">-- Select a friend --</option></select>
            <label>📌 Event Name</label>
            <input type="text" id="eventTitle" placeholder="e.g., Lunch, Meeting..." />
            <div class="time-row">
                <div><label>⏰ Start</label><input type="time" id="eventStart" step="900" /></div>
                <div><label>⏰ End</label><input type="time" id="eventEnd" step="900" /></div>
            </div>
            <label>📝 Note (optional)</label>
            <textarea id="eventNote" rows="2" placeholder="Add details..."></textarea>
            <div class="modal-actions">
                <button class="btn-cancel" onclick="closeAddEventModal()">Cancel</button>
                <button class="btn-primary" id="confirmAddEventBtn" onclick="confirmAddEvent()" disabled>Send</button>
            </div>
            <div id="addEventStatus" style="margin-top:12px;font-size:13px;text-align:center;display:none;"></div>
        </div>
    </div>

    <script src="js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
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
            const feedbackBtn = document.getElementById('feedbackMoreBtn');
            if (feedbackBtn) {
                feedbackBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert('📝 Feedback is coming soon.\\nPlease contact tomosche.line@gmail.com');
                });
            }
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const pageMap = { 'index.html':'home', '':'home', 'friends.html':'friends', 'calendar.html':'calendar', 'add.html':'add' };
            const activeNav = pageMap[currentPage] || 'home';
            document.querySelectorAll('.nav-item').forEach(el => {
                if (el.dataset.nav === activeNav) el.classList.add('active');
            });
        });

        function openAddEventModal(dateStr) {
            document.getElementById('modalDate').textContent = dateStr || 'Select a date';
            document.getElementById('addEventModal').style.display = 'flex';
            document.getElementById('confirmAddEventBtn').disabled = true;
            document.getElementById('addEventStatus').style.display = 'none';
            ['eventTitle','eventStart','eventEnd'].forEach(id => {
                document.getElementById(id).addEventListener('input', checkAddEventForm);
            });
            document.getElementById('friendSelect').addEventListener('change', checkAddEventForm);
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
                status.style.display = 'block'; status.style.color = '#e53935'; status.textContent = 'Please fill in all fields.'; return;
            }
            if (start >= end) {
                status.style.display = 'block'; status.style.color = '#e53935'; status.textContent = '⚠️ End time must be after start time.'; return;
            }
            console.log('Event added:', { title, start, end, friend });
            status.style.display = 'block'; status.style.color = '#06C755'; status.textContent = '✅ Event added!';
            setTimeout(() => { closeAddEventModal(); location.reload(); }, 1500);
        }
    </script>
</body>
</html>`;
    document.open();
    document.write(html);
    document.close();
}
