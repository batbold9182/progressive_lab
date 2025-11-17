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
    return;
  }

  try {
    const response = await fetch('/pictures/logo.png', { method: 'HEAD', cache: 'no-store' });
    if (response.ok) {
      hideOfflineBanner();
      console.log('Online - banner hidden');
    } else {
      showOfflineBanner();
    }
  } catch (err) {
    showOfflineBanner();
    console.log('Offline (fetch failed) - banner shown:', err.message);
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
