(function () {
  "use strict";

  const supported = ["de", "en", "fr"];
  const htmlLang = { de: "de-DE", en: "en-US", fr: "fr-CA" };
  let currentLanguage = "de";

  function chooseInitialLanguage() {
    const query = new URLSearchParams(window.location.search).get("lang");
    if (supported.includes(query)) return query;
    const saved = window.localStorage.getItem("s49-language");
    if (supported.includes(saved)) return saved;
    const browser = (navigator.language || "de").toLowerCase();
    if (browser.startsWith("fr")) return "fr";
    if (browser.startsWith("en")) return "en";
    return "de";
  }

  function text(key) {
    return window.SINNBILD_I18N[currentLanguage][key] || key;
  }

  function applyLanguage(language, remember) {
    if (!supported.includes(language)) return;
    currentLanguage = language;
    document.documentElement.lang = htmlLang[language];
    if (remember) window.localStorage.setItem("s49-language", language);
    fillContactDetails();

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = text(node.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      node.placeholder = text(node.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
      node.setAttribute("aria-label", text(node.dataset.i18nAria));
    });
    document.querySelectorAll("[data-lang-block]").forEach((node) => {
      node.hidden = node.dataset.langBlock !== language;
    });
    document.querySelectorAll("[data-language]").forEach((button) => {
      const active = button.dataset.language === language;
      button.setAttribute("aria-pressed", active ? "true" : "false");
      button.classList.toggle("is-active", active);
    });
    configureAmazonLinks();

    document.dispatchEvent(new CustomEvent("sinnbild:languagechange", {
      detail: { language }
    }));
  }

  function fillContactDetails() {
    const config = window.SINNBILD_CONFIG;
    document.querySelectorAll("[data-owner]").forEach((node) => { node.textContent = config.owner; });
    document.querySelectorAll("[data-email]").forEach((node) => {
      node.textContent = config.email;
      if (node.tagName === "A") node.href = `mailto:${config.email}`;
    });
    document.querySelectorAll("[data-address-1]").forEach((node) => { node.textContent = config.addressLine1; });
    const addressLine2 = typeof config.addressLine2 === "object"
      ? config.addressLine2[currentLanguage]
      : config.addressLine2;
    document.querySelectorAll("[data-address-2]").forEach((node) => { node.textContent = addressLine2; });
    document.querySelectorAll("[data-year]").forEach((node) => { node.textContent = new Date().getFullYear(); });
  }

  function configureAmazonLinks() {
    document.querySelectorAll("[data-amazon-link]").forEach((node) => {
      const language = node.dataset.amazonLink === "auto" ? currentLanguage : node.dataset.amazonLink;
      const url = window.SINNBILD_CONFIG.amazon[language];
      if (url) {
        node.href = url;
        node.removeAttribute("aria-disabled");
        node.classList.remove("is-disabled");
      } else {
        node.removeAttribute("href");
        node.setAttribute("aria-disabled", "true");
        node.classList.add("is-disabled");
      }
    });
  }

  function setUpNavigation() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const navigation = document.querySelector("[data-navigation]");
    if (!toggle || !navigation) return;
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      navigation.classList.toggle("is-open", !open);
    });
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        navigation.classList.remove("is-open");
      });
    });
  }

  function setUpLanguageButtons() {
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.addEventListener("click", () => applyLanguage(button.dataset.language, true));
    });
  }

  window.SINNBILD_SITE = Object.freeze({
    getLanguage: () => currentLanguage,
    text,
    applyLanguage
  });

  document.addEventListener("DOMContentLoaded", () => {
    fillContactDetails();
    configureAmazonLinks();
    setUpNavigation();
    setUpLanguageButtons();
    applyLanguage(chooseInitialLanguage(), false);
  });
}());
