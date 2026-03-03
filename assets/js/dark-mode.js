/* ============================================
   AiraKit — Dark Mode Toggle
   Inclua esse arquivo antes do </body>
   ============================================ */

(function () {
  const STORAGE_KEY = 'airakit-theme';
  const root = document.documentElement;

  // Detecta preferência salva ou usa a do sistema
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Aplica o tema no <html> via data-theme
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Atualiza todos os botões de toggle na página
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
      btn.setAttribute('data-current-theme', theme);
    });
  }

  // Alterna entre claro e escuro
  function toggleTheme() {
    const current = root.getAttribute('data-theme') || getPreferredTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Aplica tema imediatamente (evita flash)
  applyTheme(getPreferredTheme());

  // Inicializa os botões quando o DOM estiver pronto
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });
  });

  // Escuta mudança de preferência do sistema em tempo real
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    // Só atualiza automaticamente se o usuário não tiver escolhido manualmente
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Expõe funções globalmente caso precise usar no seu próprio JS
  window.AiraKit = {
    toggleTheme: toggleTheme,
    setTheme: applyTheme,
    getTheme: function () { return root.getAttribute('data-theme'); }
  };
})();