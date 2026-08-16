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
// ✅ Add to Home Screen 機能（改善版）
// ============================================================
function addToHomeScreen() {
    // iOS のスタンドアロンモード（既にホーム画面から起動）
    if (window.navigator && window.navigator.standalone) {
        alert('📱 Tomosche is already running as a standalone app.');
        return;
    }

    // Android の PWA インストールプロンプト（Chrome）
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
        return;
    }

    // ✅ 改善: 分かりやすい手順モーダルを表示
    showShortcutGuide();
}

// ============================================================
// ✅ ショートカット作成ガイドモーダル
// ============================================================
function showShortcutGuide() {
    // 既存のモーダルを削除（重複防止）
    const existing = document.getElementById('shortcutGuideModal');
    if (existing) {
        existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'shortcutGuideModal';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;

    overlay.innerHTML = `
        <div style="background:white;border-radius:24px;max-width:400px;width:100%;padding:32px 24px;box-shadow:0 20px 60px rgba(0,0,0,0.3);position:relative;max-height:90vh;overflow-y:auto;">
            <button onclick="closeShortcutGuide()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:24px;color:#999;cursor:pointer;">&times;</button>
            
            <div style="text-align:center;margin-bottom:20px;">
                <i class="bi bi-star" style="font-size:48px;color:#06C755;display:block;margin-bottom:8px;"></i>
                <h3 style="font-weight:700;margin-bottom:4px;font-size:20px;">✨ Add Tomosche to Home Screen</h3>
                <p style="color:#888;font-size:14px;margin:0;">Use Tomosche like a native app!</p>
            </div>

            <div style="background:#f8f9fa;border-radius:16px;padding:20px;margin-bottom:20px;">
                <div style="display:flex;align-items:flex-start;gap:14px;padding:8px 0;border-bottom:1px solid #e9ecef;">
                    <span style="background:#06C755;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;margin-top:2px;">1</span>
                    <div>
                        <div style="font-weight:600;font-size:15px;color:#333;">Open Share Menu</div>
                        <div style="font-size:13px;color:#888;">
                            <span id="platformShareHint">Tap the share icon </span>
                            <span id="platformShareIcon" style="font-size:18px;">📤</span>
                            <span id="platformShareLabel"> in your browser</span>
                        </div>
                    </div>
                </div>
                <div style="display:flex;align-items:flex-start;gap:14px;padding:8px 0;border-bottom:1px solid #e9ecef;">
                    <span style="background:#06C755;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;margin-top:2px;">2</span>
                    <div>
                        <div style="font-weight:600;font-size:15px;color:#333;">Select "Add to Home Screen"</div>
                        <div style="font-size:13px;color:#888;">Scroll down and find the option</div>
                    </div>
                </div>
                <div style="display:flex;align-items:flex-start;gap:14px;padding:8px 0;">
                    <span style="background:#06C755;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;margin-top:2px;">3</span>
                    <div>
                        <div style="font-weight:600;font-size:15px;color:#333;">Tap "Add"</div>
                        <div style="font-size:13px;color:#888;">Done! Tomosche is on your home screen 🎉</div>
                    </div>
                </div>
            </div>

            <div style="display:flex;gap:12px;">
                <button onclick="closeShortcutGuide()" style="flex:1;padding:12px;border-radius:999px;border:none;background:#f0f4f8;color:#666;font-weight:600;font-size:14px;cursor:pointer;">Close</button>
                <button onclick="copyAppUrl()" style="flex:1;padding:12px;border-radius:999px;border:none;background:#06C755;color:white;font-weight:600;font-size:14px;cursor:pointer;">
                    📋 Copy URL
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // プラットフォームに合わせて表示を調整
    updatePlatformHints();
}

function closeShortcutGuide() {
    const modal = document.getElementById('shortcutGuideModal');
    if (modal) modal.remove();
}

function updatePlatformHints() {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isSafari = /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent);

    const labelEl = document.getElementById('platformShareLabel');
    const iconEl = document.getElementById('platformShareIcon');
    const hintEl = document.getElementById('platformShareHint');

    if (isIOS && isSafari) {
        if (labelEl) labelEl.textContent = ' (the box with arrow up)';
        if (iconEl) iconEl.textContent = '📤';
        if (hintEl) hintEl.textContent = 'Tap the share icon ';
    } else if (isAndroid) {
        if (labelEl) labelEl.textContent = ' (three dots menu)';
        if (iconEl) iconEl.textContent = '⋮';
        if (hintEl) hintEl.textContent = 'Tap the menu icon ';
    } else {
        if (labelEl) labelEl.textContent = ' in your browser';
        if (iconEl) iconEl.textContent = '📤';
        if (hintEl) hintEl.textContent = 'Find the share or menu option ';
    }
}

// ============================================================
// ✅ URL コピー機能
// ============================================================
function copyAppUrl() {
    const url = window.location.origin + window.location.pathname;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyUrl(url);
        });
    } else {
        fallbackCopyUrl(url);
    }
}

function fallbackCopyUrl(url) {
    const input = document.createElement('input');
    input.value = url;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (e) {
        alert('📋 Please copy this URL manually:\n\n' + url);
    }
    document.body.removeChild(input);
}

function showCopySuccess() {
    // 一時的な成功メッセージ
    const existing = document.querySelector('.copy-success-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'copy-success-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #06C755;
        color: white;
        padding: 12px 24px;
        border-radius: 999px;
        font-weight: 600;
        font-size: 14px;
        z-index: 10001;
        box-shadow: 0 4px 20px rgba(6,199,85,0.4);
        animation: fadeInUp 0.3s ease;
    `;
    toast.textContent = '✅ URL copied! Share it with friends.';
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// CSSアニメーションを追加
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(styleSheet);

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