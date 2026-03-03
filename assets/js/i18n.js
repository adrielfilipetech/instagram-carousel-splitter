const translations = {
  en: {
    title: "Instagram Carousel Splitter",
    subtitle: "Auto split your instagram carousel",
    tabSingle: "Single Image",
    tabBatch: "Batch Mode",
    dropText: "Drop your image here",
    dropHint: "or",
    selectBtn: "Select image",
    dropTextBatch: "Drop multiple images here",
    selectBtnBatch: "Select images",
    fileName: "Filename:",
    fileSize: "Size:",
    filePages: "Number of pages:",
    processBtn: "Process and Download",
    processBatchBtn: "Process All",
    loading: "Processing your image",
    loadingPlural: "s"
  },
  pt: {
    title: "Divisor de Carrossel do Instagram",
    subtitle: "Divida automaticamente seu carrossel do Instagram",
    tabSingle: "Imagem Única",
    tabBatch: "Modo em Lote",
    dropText: "Solte sua imagem aqui",
    dropHint: "ou",
    selectBtn: "Selecionar imagem",
    dropTextBatch: "Solte várias imagens aqui",
    selectBtnBatch: "Selecionar imagens",
    fileName: "Nome do arquivo:",
    fileSize: "Tamanho:",
    filePages: "Número de páginas:",
    processBtn: "Processar e Baixar",
    processBatchBtn: "Processar Tudo",
    loading: "Processando sua imagem",
    loadingPlural: "ns"
  },
  es: {
    title: "Divisor de Carrusel de Instagram",
    subtitle: "Divide automáticamente tu carrusel de Instagram",
    tabSingle: "Imagen Única",
    tabBatch: "Modo por Lotes",
    dropText: "Suelta tu imagen aquí",
    dropHint: "o",
    selectBtn: "Seleccionar imagen",
    dropTextBatch: "Suelta varias imágenes aquí",
    selectBtnBatch: "Seleccionar imágenes",
    fileName: "Nombre del archivo:",
    fileSize: "Tamaño:",
    filePages: "Número de páginas:",
    processBtn: "Procesar y Descargar",
    processBatchBtn: "Procesar Todo",
    loading: "Procesando tu imagen",
    loadingPlural: "es"
  }
};

const flags = { en: "🇺🇸", pt: "🇧🇷", es: "🇪🇸" };
const langNames = { en: "EN", pt: "PT", es: "ES" };

let currentLang = localStorage.getItem("lang") || "en";

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;
  currentLang = lang;
  localStorage.setItem("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Update active state on buttons
  document.querySelectorAll(".lang-option").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

function initI18n() {
  const wrapper = document.querySelector(".lang-switcher");
  if (!wrapper) return;

  const current = translations[currentLang];
  
  wrapper.innerHTML = `
    <div class="lang-dropdown">
      <button class="lang-selected" id="langToggle">
        ${flags[currentLang]} ${langNames[currentLang]} <span class="lang-arrow">▾</span>
      </button>
      <div class="lang-menu" id="langMenu">
        ${Object.keys(translations).map(lang => `
          <button class="lang-item ${lang === currentLang ? 'active' : ''}" data-lang="${lang}">
            ${flags[lang]} ${langNames[lang]}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  // Toggle dropdown
  document.getElementById('langToggle').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('langMenu').classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', () => {
    document.getElementById('langMenu')?.classList.remove('open');
  });

  // Select language
  wrapper.querySelectorAll('.lang-item').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTranslations(btn.dataset.lang);
      document.getElementById('langMenu').classList.remove('open');
      // Update button label
      document.getElementById('langToggle').innerHTML = 
        `${flags[btn.dataset.lang]} ${langNames[btn.dataset.lang]} <span class="lang-arrow">▾</span>`;
      // Update active state
      wrapper.querySelectorAll('.lang-item').forEach(b => 
        b.classList.toggle('active', b.dataset.lang === btn.dataset.lang)
      );
    });
  });

  applyTranslations(currentLang);
}

document.addEventListener("DOMContentLoaded", initI18n);