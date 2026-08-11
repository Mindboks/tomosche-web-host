// ================================================================
// Tomosche 共通テンプレート（部分挿入方式）
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

    const headerHtml = `
        <div class="header">
            <div class="logo">🌱 Tomosche <span class="logo-sub">Social Scheduling</span></div>
            <div class="profile-icon" id="profileIcon">
                <i class="bi bi-person-circle"></i>
                <span class="user-name" id="userNameDisplay">Loading...</span>
            </div>
        </div>
    `;

    const footerHtml = `
        <div class="version" id="versionDisplay"></div>
    `;

    const navHtmlFull = `
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
    `;

    const appContainer = document.querySelector('.app-container');
    if (!appContainer) {
        console.error('renderPage(): ".app-container" 要素が見つかりません。HTML側で <div id="app"> を <div class="app-container"> に変更してください。');
        return;
    }

    appContainer.insertAdjacentHTML('afterbegin', headerHtml);
    appContainer.insertAdjacentHTML('beforeend', footerHtml);
    document.body.insertAdjacentHTML('beforeend', navHtmlFull);

    const vEl = document.getElementById('versionDisplay');
    if (vEl) vEl.textContent = getFullVersion();

    updateProfileDisplay();
    bindHeaderFooterEvents();
}

async function updateProfileDisplay() {
    const nameEl = document.getElementById('userNameDisplay');
    if (!nameEl) return;

    try {
        if (window.liffReadyPromise) {
            await window.liffReadyPromise;
        }
        if (window.currentUser && window.currentUser.displayName) {
            nameEl.textContent = window.currentUser.displayName;
        } else {
            nameEl.textContent = 'Guest';
        }
    } catch (e) {
        console.error('Profile display error:', e);
        nameEl.textContent = 'Guest';
    }
}

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

function closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) modal.style.display = 'none';
}

function submitFeedback() {
    const rawMessage = document.getElementById('feedbackMessage').value.trim();
    const status = document.getElementById('feedbackStatus');
    if (!rawMessage) {
        status.style.display = 'block';
        status.style.color = '#e53935';
        status.textContent = 'Please enter your feedback.';
        return;
    }
    const safeMessage = escapeHtml(rawMessage);
    status.style.display = 'block';
    status.textContent = 'Sending...';
    status.style.color = '#666';
    setTimeout(() => {
        status.style.color = '#06C755';
        status.textContent = '✅ Thank you for your feedback!';
        setTimeout(closeFeedbackModal, 1500);
    }, 1000);
}

let _headerFooterEventsBound = false;
function bindHeaderFooterEvents() {
    if (_headerFooterEventsBound) return;
    _headerFooterEventsBound = true;

    const moreBtn = document.getElementById('moreMenuBtn');
    const popup = document.getElementById('moreMenuPopup');
    if (moreBtn && popup) {
        moreBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            toggleMorePopup();
        });
        document.addEventListener('click', function(e) {
            if (popup.style.display === 'block') {
                const isClickInside = popup.contains(e.target) || moreBtn.contains(e.target);
                if (!isClickInside) {
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
    const feedbackModal = document.getElementById('feedbackModal');
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (feedbackModal) {
                feedbackModal.style.display = 'flex';
            }
            const msgEl = document.getElementById('feedbackMessage');
            const statusEl = document.getElementById('feedbackStatus');
            if (msgEl) msgEl.value = '';
            if (statusEl) statusEl.style.display = 'none';
            closeMorePopup();
        });
    }

    if (feedbackModal) {
        feedbackModal.addEventListener('click', function(e) {
            if (e.target === this) closeFeedbackModal();
        });
    }
}

console.log('📦 template.js loaded (partial insertion mode)');
