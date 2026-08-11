// ================================================================
// XSS対策：HTMLエスケープ関数
// ================================================================

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// オブジェクトの各値をエスケープ
function escapeEvent(event) {
    return {
        time: escapeHtml(event.time),
        title: escapeHtml(event.title),
        person: escapeHtml(event.person),
        note: escapeHtml(event.note || ''),
        status: escapeHtml(event.status || ''),
        type: escapeHtml(event.type || '')
    };
}
