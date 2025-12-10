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

export { showStatusMessage };
