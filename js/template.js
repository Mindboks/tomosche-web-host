// ================================================================
// Tomosche 共通テンプレート（部分挿入方式 + イベント統合）
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

// ============================================================
// ★ フィードバック送信（デバッグ強化版）
// ============================================================
async function submitFeedback() {
    console.log('🔍 submitFeedback 開始');
    const rawMessage = document.getElementById('feedbackMessage').value.trim();
    const status = document.getElementById('feedbackStatus');

    if (!rawMessage) {
        console.warn('⚠️ メッセージが空です');
        status.style.display = 'block';
        status.style.color = '#e53935';
        status.textContent = 'Please enter your feedback.';
        return;
    }

    if (rawMessage.length < 5) {
        console.warn('⚠️ メッセージが短すぎます');
        status.style.display = 'block';
        status.style.color = '#e53935';
        status.textContent = 'Please provide more details (at least 5 characters).';
        return;
    }

    const safeMessage = escapeHtml(rawMessage);
    console.log('📝 メッセージ:', safeMessage);

    try {
        console.log('⏳ Firebase初期化開始');
        // Firebase初期化
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js');
        const { getFirestore, collection, query, where, getDocs, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js');

        console.log('✅ Firebase SDK 読み込み完了');

        const firebaseConfig = {
            apiKey: 'AIzaSyAutsnScMxkcm6UXv0vhLs6hVDY_rxhLP0',
            authDomain: 'tomoche.firebaseapp.com',
            projectId: 'tomoche',
            storageBucket: 'tomoche.firebasestorage.app',
            messagingSenderId: '687415158427',
            appId: '1:687415158427:web:1efc4417146176da74c83e'
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        console.log('✅ Firebase 初期化完了');

        // 現在のユーザーIDを取得
        let userId = window.currentUser?.userId;
        console.log('👤 window.currentUser:', window.currentUser);

        if (!userId) {
            console.log('⏳ LIFFからプロフィール取得を試行');
            try {
                const profile = await liff.getProfile();
                userId = profile.userId;
                console.log('✅ LIFFプロフィール取得成功:', userId);
            } catch (e) {
                console.error('❌ LIFFプロフィール取得失敗:', e);
                status.style.display = 'block';
                status.style.color = '#e53935';
                status.textContent = 'Please log in to send feedback.';
                return;
            }
        }

        // 今日の0時0分を取得
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log('📅 今日の日付:', today);

        // 過去24時間以内のフィードバックをチェック
        console.log('⏳ フィードバック履歴をチェック中...');
        const q = query(
            collection(db, 'feedback'),
            where('userId', '==', userId),
            where('createdAt', '>=', today)
        );
        const snapshot = await getDocs(q);
        console.log('📊 チェック結果:', snapshot.size, '件');

        if (!snapshot.empty) {
            console.warn('⚠️ 本日すでに送信済み');
            status.style.display = 'block';
            status.style.color = '#ff9800';
            status.textContent = '⚠️ You have already sent feedback today. Please try again tomorrow.';
            return;
        }

        // Firestoreに保存
        console.log('⏳ Firestoreに保存中...');
        await addDoc(collection(db, 'feedback'), {
            userId: userId,
            userName: window.currentUser?.displayName || 'Anonymous',
            message: safeMessage,
            createdAt: serverTimestamp()
        });
        console.log('✅ Firestore保存完了');

        status.style.display = 'block';
        status.style.color = '#06C755';
        status.textContent = '✅ Thank you for your feedback!';
        setTimeout(closeFeedbackModal, 1500);

    } catch (error) {
        console.error('❌ エラー詳細:', error);
        console.error('❌ エラー名:', error.name);
        console.error('❌ エラーメッセージ:', error.message);
        if (error.code) console.error('❌ エラーコード:', error.code);
        if (error.stack) console.error('❌ スタックトレース:', error.stack);
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

    // ★ フィードバックボタン（More内）
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

    // ★ フィードバックモーダルの「Send」ボタン
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

    // ★ フィードバックモーダルの「Cancel」ボタン
    const cancelBtn = document.getElementById('feedbackCancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeFeedbackModal();
        });
    }

    // モーダル外クリックで閉じる
    const feedbackModal = document.getElementById('feedbackModal');
    if (feedbackModal) {
        feedbackModal.addEventListener('click', function(e) {
            if (e.target === this) closeFeedbackModal();
        });
    }
}

console.log('📦 template.js loaded (partial insertion mode)');
