/**
 * Toast Notification System
 * Reusable feedback messaging: window.showToast(message, type, duration)
 */
(function() {
  function getOrCreateContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  const ICONS = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  window.showToast = function(message, type = 'info', duration = 3500) {
    const container = getOrCreateContainer();
    const toast = document.createElement('div');
    const validTypes = ['success', 'error', 'warning', 'info'];
    const toastType = validTypes.includes(type) ? type : 'info';
    
    toast.className = `toast toast-${toastType}`;
    toast.innerHTML = `
      <span class="toast-icon">${ICONS[toastType]}</span>
      <div class="toast-content">${message}</div>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    function removeToast() {
      if (toast.classList.contains('toast-hiding')) return;
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 250);
    }

    toast.querySelector('.toast-close').addEventListener('click', removeToast);

    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(removeToast, duration);
    }
  };
})();
