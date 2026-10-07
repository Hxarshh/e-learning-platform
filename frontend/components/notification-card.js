/**
 * Notification Card Component — Design System Aligned
 */
function renderNotificationCard(notif) {
    const timeAgo = notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : 'Recently';
    return `
        <div class="card" style="padding: var(--space-4); margin-bottom: var(--space-3);" data-notif-id="${notif.id}">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <h4 style="font-size:0.95rem; font-weight:600;">${notif.title || 'Notification'}</h4>
                <span style="font-size:0.75rem; color:var(--text-subtle);">${timeAgo}</span>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">${notif.message || ''}</p>
        </div>
    `;
}
