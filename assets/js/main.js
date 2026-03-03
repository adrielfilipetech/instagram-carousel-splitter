/* ============================================
   Dark Mode
   ============================================ */
(function () {
    const saved = localStorage.getItem('airakit-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
})();

function toggleTheme(btn) {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('airakit-theme', next);
    if (btn) {
        btn.querySelector('.theme-icon').textContent = next === 'dark' ? '☀️' : '🌙';
        btn.querySelector('.theme-label').textContent = next === 'dark' ? 'Light' : 'Dark';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.btn-theme');
    const theme = document.documentElement.getAttribute('data-theme');
    if (btn) {
        btn.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.querySelector('.theme-label').textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
});

/* ============================================
   PWA Install
   ============================================ */
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'inline-flex';
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') installBtn.style.display = 'none';
        deferredPrompt = null;
    });
}

window.addEventListener('appinstalled', () => {
    if (installBtn) installBtn.style.display = 'none';
});

/* ============================================
   Service Worker
   ============================================ */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/instagram-carousel-splitter/service-worker.js')
            .then(reg => console.log('SW registrado:', reg.scope))
            .catch(err => console.error('SW erro:', err));
    });
}