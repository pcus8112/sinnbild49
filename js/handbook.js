(function () {
  "use strict";

  const lang = () => window.SINNBILD_SITE.getLanguage();
  const ui = (key) => window.SINNBILD_SITE.text(key);
  let activeField = "all";

  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const fallback = document.createElement("textarea");
    fallback.value = value;
    fallback.setAttribute("readonly", "");
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.append(fallback);
    fallback.select();
    document.execCommand("copy");
    fallback.remove();
  }

  function toast(message) {
    const node = document.getElementById("toast");
    node.textContent = message;
    node.classList.add("is-visible");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => node.classList.remove("is-visible"), 2400);
  }

  function renderPositions() {
    const container = document.getElementById("positions-list");
    container.replaceChildren();
    window.SINNBILD_DATA.positions.forEach((position) => {
      const article = document.createElement("article");
      article.className = "position-card";
      article.innerHTML = `
        <span class="position-card__number">${position.number}</span>
        <div>
          <h3>${position.title[lang()]}</h3>
          <p>${position.meaning[lang()]}</p>
        </div>`;
      container.append(article);
    });
  }

  function populateFilter() {
    const select = document.getElementById("field-filter");
    const previous = select.value || activeField;
    select.replaceChildren();
    const all = document.createElement("option");
    all.value = "all";
    all.textContent = ui("allFields");
    select.append(all);
    Object.entries(window.SINNBILD_DATA.fields).forEach(([number, title]) => {
      const option = document.createElement("option");
      option.value = number;
      option.textContent = title[lang()];
      select.append(option);
    });
    select.value = previous;
  }

  function renderCards() {
    const container = document.getElementById("handbook-cards");
    container.replaceChildren();
    window.SINNBILD_DATA.cards
      .filter((card) => activeField === "all" || String(card.field) === activeField)
      .forEach((card) => {
        const article = document.createElement("article");
        article.className = "handbook-card";
        const image = document.createElement("img");
        image.src = `assets/cards/card-${card.number}.webp`;
        image.alt = card.title[lang()];
        image.loading = "lazy";
        image.width = 300;
        image.height = 500;
        const body = document.createElement("div");
        body.className = "handbook-card__body";
        body.innerHTML = `
          <p class="handbook-card__field">${window.SINNBILD_DATA.fields[card.field][lang()]}</p>
          <h3><span>${card.number}</span>${card.title[lang()]}</h3>
          <h4>${ui("meaningLabel")}</h4>
          <p>${card.meaning[lang()]}</p>
          <h4>${ui("reflectionLabel")}</h4>
          <p class="handbook-card__question">${card.ask[lang()]}</p>`;
        article.append(image, body);
        container.append(article);
      });
  }

  function renderAll() {
    renderPositions();
    populateFilter();
    renderCards();
  }

  function downloadHandbook() {
    const content = window.SINNBILD_HANDBOOK.buildHandbookText(lang());
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SINNBILD49-handbook-${lang()}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const filter = document.getElementById("field-filter");
    if (!filter) return;
    filter.addEventListener("change", () => {
      activeField = filter.value;
      renderCards();
    });
    document.getElementById("copy-handbook-button").addEventListener("click", async () => {
      await copyText(window.SINNBILD_HANDBOOK.buildHandbookText(lang()));
      toast(ui("handbookCopied"));
    });
    document.getElementById("download-handbook-button").addEventListener("click", downloadHandbook);
    document.addEventListener("sinnbild:languagechange", renderAll);
    renderAll();
  });
}());
