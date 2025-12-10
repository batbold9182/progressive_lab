import { showStatusMessage } from "./helper.js";
const offlineBanner = document.getElementById('offline-banner');

function showOfflineBanner() {
  offlineBanner.classList.add('show');
}

function hideOfflineBanner() {
  offlineBanner.classList.remove('show');
}

async function updateOnlineStatus() {
  if (!navigator.onLine) {
    showOfflineBanner();
    console.log('Offline (navigator.onLine) - banner shown');
    showStatusMessage('You are offline.', 'error');
    return;
  }

  try {
    const response = await fetch('/pictures/logo.png', { method: 'HEAD', cache: 'no-store' });
    if (response.ok) {
      hideOfflineBanner();
      console.log('Online - banner hidden');
      showStatusMessage('You are back online.', 'success');
    } else {
      showOfflineBanner();
      showStatusMessage('You are offline.', 'error');
    }
  } catch (err) {
    showOfflineBanner();
    console.log('Offline (fetch failed) - banner shown:', err.message);
    showStatusMessage('You are offline (fetch faled).', 'error');
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered with scope:', reg.scope))
      .catch(err => console.log('Service Worker registration failed:', err));
  }
}

export { registerServiceWorker, updateOnlineStatus, showOfflineBanner, hideOfflineBanner };