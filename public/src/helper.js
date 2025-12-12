function showStatusMessage(message, type = 'info', duration = 5000) {
  const statusEl = document.getElementById('status-message');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `status-message ${type} show`;

  if (duration) {
    setTimeout(() => {
      statusEl.classList.remove('show');
    }, duration);
  }
}


function showLoading(message = 'Loading...') {
  const loadingOverlay = document.getElementById('loading-overlay'); 
  if (loadingOverlay) {
    loadingOverlay.style.display = 'flex';
    loadingOverlay.textContent = message;
  }
}

function hideLoading() {
const loadingOverlay = document.getElementById('loading-overlay'); 
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
    loadingOverlay.textContent = '';
  }
}

export { showStatusMessage ,hideLoading,showLoading};
