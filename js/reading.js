(function () {
  "use strict";

  const DRAW_COUNT = 10;
  let deck = [];
  let selected = [];
  let question = "";
  let code = "";
  let completed = false;

  const byId = (id) => document.getElementById(id);
  const cardByNumber = (number) => window.SINNBILD_DATA.cards.find((card) => card.number === number);
  const lang = () => window.SINNBILD_SITE.getLanguage();
  const ui = (key) => window.SINNBILD_SITE.text(key);

  function secureIndex(maxExclusive) {
    if (!window.crypto || !window.crypto.getRandomValues) {
      return Math.floor(Math.random() * maxExclusive);
    }
    const range = 0x100000000;
    const limit = range - (range % maxExclusive);
    const values = new Uint32Array(1);
    do {
      window.crypto.getRandomValues(values);
    } while (values[0] >= limit);
    return values[0] % maxExclusive;
  }

  function shuffledDeck() {
    const values = Array.from({ length: 49 }, (_, index) => String(index + 1).padStart(2, "0"));
    for (let index = values.length - 1; index > 0; index -= 1) {
      const swap = secureIndex(index + 1);
      [values[index], values[swap]] = [values[swap], values[index]];
    }
    return values;
  }

  function checksum(payload) {
    let value = 0;
    for (const character of payload) value = (value * 31 + character.charCodeAt(0)) % 1296;
    return value.toString(36).toUpperCase().padStart(2, "0");
  }

  function makeCode() {
    const payload = `V1L10${selected.join("")}`;
    return `S49-V1-L10-${selected.join("-")}-${checksum(payload)}`;
  }

  function setMessage(message, isError) {
    const node = byId("form-message");
    node.textContent = message;
    node.classList.toggle("is-error", Boolean(isError));
  }

  function updateCounter() {
    byId("selection-count").textContent = `${selected.length} / ${DRAW_COUNT}`;
    byId("undo-button").disabled = selected.length === 0 || completed;
  }

  function deckCardLabel(number, order) {
    if (!order) return ui("cardBack");
    const card = cardByNumber(number);
    return `${ui("cardSelected")} ${order}: ${card.title[lang()]}`;
  }

  function renderDeck() {
    const grid = byId("card-grid");
    grid.replaceChildren();
    deck.forEach((number, position) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "deck-card";
      button.dataset.card = number;
      button.dataset.position = String(position + 1);
      button.setAttribute("aria-label", deckCardLabel(number, 0));

      const inner = document.createElement("span");
      inner.className = "deck-card__inner";
      const back = document.createElement("span");
      back.className = "deck-card__face deck-card__back";
      const backImage = document.createElement("img");
      backImage.src = "assets/card-back.svg";
      backImage.alt = "";
      backImage.decoding = "async";
      back.append(backImage);

      const front = document.createElement("span");
      front.className = "deck-card__face deck-card__front";
      const frontImage = document.createElement("img");
      frontImage.alt = cardByNumber(number).title[lang()];
      frontImage.decoding = "async";
      front.append(frontImage);

      const badge = document.createElement("span");
      badge.className = "deck-card__order";
      badge.setAttribute("aria-hidden", "true");
      button.append(inner, badge);
      inner.append(back, front);
      button.addEventListener("click", () => selectCard(button, frontImage));
      grid.append(button);
    });
  }

  function selectCard(button, frontImage) {
    if (completed || selected.length >= DRAW_COUNT || button.classList.contains("is-selected")) return;
    const number = button.dataset.card;
    selected.push(number);
    frontImage.src = `assets/cards/card-${number}.webp`;
    button.classList.add("is-selected");
    button.querySelector(".deck-card__order").textContent = String(selected.length);
    button.setAttribute("aria-label", deckCardLabel(number, selected.length));
    button.disabled = true;
    updateCounter();
    if (selected.length === DRAW_COUNT) {
      completed = true;
      updateCounter();
      document.querySelectorAll(".deck-card:not(.is-selected)").forEach((card) => { card.disabled = true; });
      window.setTimeout(showResult, 500);
    }
  }

  function undoLast() {
    if (!selected.length || completed) return;
    const number = selected.pop();
    const button = document.querySelector(`.deck-card[data-card="${number}"]`);
    if (button) {
      button.classList.remove("is-selected");
      button.disabled = false;
      button.setAttribute("aria-label", deckCardLabel(number, 0));
      button.querySelector(".deck-card__order").textContent = "";
    }
    updateCounter();
  }

  function renderLayout() {
    const container = byId("reading-layout");
    container.replaceChildren();
    selected.forEach((number, index) => {
      const card = cardByNumber(number);
      const position = window.SINNBILD_DATA.positions[index];
      const figure = document.createElement("figure");
      figure.className = "layout-card";
      const image = document.createElement("img");
      image.src = `assets/cards/card-${number}.webp`;
      image.alt = `${position.number}. ${position.title[lang()]} — ${card.title[lang()]}`;
      image.width = 300;
      image.height = 500;
      const caption = document.createElement("figcaption");
      caption.innerHTML = `<span>${position.number}</span><strong>${position.title[lang()]}</strong>`;
      figure.append(image, caption);
      container.append(figure);
    });
  }

  function requestText() {
    return [
      ui("requestHeading"),
      "",
      `${ui("requestQuestion")}:`,
      question,
      "",
      `${ui("requestCode")}:`,
      code
    ].join("\n");
  }

  function updateResultLanguage() {
    if (!completed || !code) return;
    renderLayout();
    byId("request-block").value = requestText();
  }

  function showResult() {
    code = makeCode();
    renderLayout();
    byId("request-block").value = requestText();
    byId("result-section").hidden = false;
    byId("result-section").scrollIntoView({ behavior: "smooth", block: "start" });
  }

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
    const node = byId("toast");
    node.textContent = message;
    node.classList.add("is-visible");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => node.classList.remove("is-visible"), 2400);
  }

  function startReading(event) {
    event.preventDefault();
    const input = byId("question-input");
    const acknowledged = byId("limits-check").checked;
    question = input.value.trim().replace(/\s+/g, " ");
    if (question.length < 6 || !acknowledged) {
      setMessage(ui("questionError"), true);
      return;
    }
    setMessage("", false);
    deck = shuffledDeck();
    selected = [];
    completed = false;
    code = "";
    renderDeck();
    updateCounter();
    byId("draw-section").hidden = false;
    byId("result-section").hidden = true;
    byId("draw-section").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetReading() {
    deck = [];
    selected = [];
    completed = false;
    code = "";
    question = "";
    byId("question-input").value = "";
    byId("limits-check").checked = false;
    byId("draw-section").hidden = true;
    byId("result-section").hidden = true;
    setMessage("", false);
    byId("question-section").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openEmail() {
    const subject = encodeURIComponent(ui("emailSubject"));
    const body = encodeURIComponent(requestText());
    window.location.href = `mailto:${window.SINNBILD_CONFIG.email}?subject=${subject}&body=${body}`;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = byId("question-form");
    if (!form) return;
    form.addEventListener("submit", startReading);
    byId("undo-button").addEventListener("click", undoLast);
    byId("reset-button").addEventListener("click", resetReading);
    byId("result-reset-button").addEventListener("click", resetReading);
    byId("copy-request-button").addEventListener("click", async () => {
      await copyText(requestText());
      toast(ui("copied"));
    });
    byId("email-button").addEventListener("click", openEmail);
    byId("copy-ai-button").addEventListener("click", async () => {
      const prompt = window.SINNBILD_HANDBOOK.buildHandbookText(lang(), question, code);
      await copyText(prompt);
      toast(ui("aiCopied"));
    });
    document.addEventListener("sinnbild:languagechange", updateResultLanguage);
  });
}());
