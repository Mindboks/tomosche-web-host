// ================================================================
// Tomosche 共通テンプレート（部分挿入方式 + イベント統合）
// ================================================================

function renderPage(title, content, activeNav) {
    const navItems = [
        { id: 'home', href: '/', icon: 'bi-house-fill', label: 'Home' },
        { id: 'friends', href: 'friends.html', icon: 'bi-people-fill', label: 'Schedule' },
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

    // ✅ Moreメニューに Add Shortcut を追加
    const navFullHtml = `
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
                <a href="#" id="addShortcutBtn"><div class="icon-box"><i class="bi bi-plus-square" style="color:#2196f3;"></i></div><span>Add Shortcut</span></a>
                <a href="#" id="logoutMoreBtn"><div class="icon-box"><i class="bi bi-box-arrow-right" style="color:#e53935;"></i></div><span>Logout</span></a>
            </div>
            <div class="more-close"><button onclick="closeMorePopup()">Close</button></div>
        </div>

        <div class="modal-overlay" id="feedbackModal">
            <div class="modal-box">
                <h3 id="feedbackModalTitle">📝 Feedback</h3>
                <p style="font-size:13px;color:#888;margin-bottom:16px;" id="feedbackModalDesc">Share your feedback, feature requests, or report issues.</p>
                <label id="feedbackMessageLabel">Your Message</label>
                <textarea id="feedbackMessage" rows="4" placeholder="Write your feedback here..." style="width:100%;border:1px solid #ddd;border-radius:12px;padding:12px 14px;font-size:14px;outline:none;margin-top:4px;background:white;resize:vertical;"></textarea>
                <div class="modal-actions">
                    <button class="btn-cancel" onclick="closeFeedbackModal()" id="feedbackCancelBtn">Cancel</button>
                    <button class="btn-primary" id="feedbackSendBtn">Send</button>
                </div>
                <div id="feedbackStatus" style="margin-top:12px;font-size:13px;text-align:center;display:none;"></div>
            </div>
        </div>
    `;

    const appContainer = document.querySelector('.app-container');
    if (!appContainer) {
        console.error('renderPage(): ".app-container" 要素が見つかりません。');
        return;
    }

    appContainer.insertAdjacentHTML('afterbegin', headerHtml);
    appContainer.insertAdjacentHTML('beforeend', footerHtml);
    document.body.insertAdjacentHTML('beforeend', navFullHtml);

    const vEl = document.getElementById('versionDisplay');
    if (vEl) vEl.textContent = getFullVersion();

    if (window.liffReadyPromise) {
        window.liffReadyPromise.then(() => {
            updateProfileDisplay();
        }).catch(() => {
            updateProfileDisplay();
        });
    } else {
        updateProfileDisplay();
    }
    bindHeaderFooterEvents();
}

async function updateProfileDisplay() {
    const nameEl = document.getElementById('userNameDisplay');
    const iconEl = document.getElementById('profileIcon');
    
    if (!nameEl) return;

    try {
        if (window.liffReadyPromise) {
            await window.liffReadyPromise;
        }
        
        if (window.currentUser && window.currentUser.displayName) {
            nameEl.textContent = window.currentUser.displayName;
            
            if (window.currentUser.pictureUrl && iconEl) {
                iconEl.innerHTML = `<img src="${window.currentUser.pictureUrl}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid #06C755;" />`;
            }
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

// ============================================================
// ✅ Add to Home Screen 機能
// ============================================================
function addToHomeScreen() {
    // iOS の場合
    if (window.navigator && window.navigator.standalone) {
        alert('📱 Already running as standalone app.');
        return;
    }
    
    // Android の場合（Chrome）
    if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ User accepted the install prompt');
            } else {
                console.log('❌ User dismissed the install prompt');
            }
            window.deferredPrompt = null;
        });
        closeMorePopup();
        return;
    }
    
    // フォールバック：手動設定の案内
    alert('📱 To add to Home Screen:\n\n' +
          '📲 iOS: Tap Share → "Add to Home Screen"\n' +
          '📲 Android: Tap Menu → "Add to Home Screen"');
}

// ============================================================
// ✅ フィードバック送信（Cloud Functions 経由）
// ============================================================
async function submitFeedback() {
    console.log('🔍 submitFeedback 開始');
    const rawMessage = document.getElementById('feedbackMessage').value.trim();
    const status = document.getElementById('feedbackStatus');

    if (!rawMessage) {
        status.style.display = 'block';
        status.style.color = '#e53935';
        status.textContent = 'Please enter your feedback.';
        return;
    }

    if (rawMessage.length < 5) {
        status.style.display = 'block';
        status.style.color = '#e53935';
        status.textContent = 'Please provide more details (at least 5 characters).';
        return;
    }

    if (rawMessage.length > 2000) {
        status.style.display = 'block';
        status.style.color = '#e53935';
        status.textContent = 'Message is too long (max 2000 characters).';
        return;
    }

    const safeMessage = escapeHtml(rawMessage);

    try {
        const { getAuth } = await import('https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js');
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            status.style.display = 'block';
            status.style.color = '#e53935';
            status.textContent = 'Please log in to send feedback.';
            return;
        }

        const idToken = await user.getIdToken();

        const response = await fetch('https://us-central1-tomoche.cloudfunctions.net/submitFeedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
                message: safeMessage,
                userName: window.currentUser?.displayName || 'Anonymous'
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        status.style.display = 'block';
        status.style.color = '#06C755';
        status.textContent = '✅ Thank you for your feedback!';
        setTimeout(closeFeedbackModal, 1500);

    } catch (error) {
        console.error('❌ エラー詳細:', error);
        status.style.display = 'block';
        status.style.color = '#e53935';
        status.textContent = '❌ Failed to send. Please try again.';
    }
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

    // ✅ Add to Home Screen ボタン
    const addShortcutBtn = document.getElementById('addShortcutBtn');
    if (addShortcutBtn) {
        addShortcutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addToHomeScreen();
            closeMorePopup();
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
            const modal = document.getElementById('feedbackModal');
            if (modal) {
                modal.style.display = 'flex';
            }
            const msgEl = document.getElementById('feedbackMessage');
            const statusEl = document.getElementById('feedbackStatus');
            if (msgEl) msgEl.value = '';
            if (statusEl) statusEl.style.display = 'none';
            closeMorePopup();
        });
    }

    const sendBtn = document.getElementById('feedbackSendBtn');
    if (sendBtn) {
        console.log('✅ Sendボタンが見つかりました');
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('✅ Sendボタンがクリックされました');
            submitFeedback();
        });
    } else {
        console.warn('⚠️ Sendボタンが見つかりません');
    }

    const cancelBtn = document.getElementById('feedbackCancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeFeedbackModal();
        });
    }

    const feedbackModal = document.getElementById('feedbackModal');
    if (feedbackModal) {
        feedbackModal.addEventListener('click', function(e) {
            if (e.target === this) closeFeedbackModal();
        });
    }
}

// ============================================================
// ✅ PWA インストールプロンプトをキャプチャ
// ============================================================
if (window.addEventListener) {
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        window.deferredPrompt = e;
        console.log('✅ PWA install prompt captured');
    });
}

console.log('📦 template.js loaded (partial insertion mode)');