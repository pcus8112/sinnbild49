(function () {
  "use strict";

  const labels = {
    de: {
      principle: "GRUNDSATZ",
      principleText: "SINNBILD49 ist kein Wahrsagen. Die Karten kennen weder die Zukunft noch die Gedanken anderer Menschen. Bedeutung entsteht in der Begegnung zwischen einer Frage, zufällig gezogenen Bildern und den Gedanken des betrachtenden Menschen.",
      rules: "DEUTUNGSREGELN",
      positions: "DIE ZEHN POSITIONEN",
      cards: "DIE 49 KARTEN",
      field: "Themenfeld",
      meaning: "Mögliche Lesart",
      reflection: "Reflexionsfrage",
      input: "ZU DEUTENDE LEGUNG",
      question: "Frage",
      code: "Code",
      codeHelp: "Die zehn zweistelligen Kartennummern nach L10 stehen in Ziehungsreihenfolge und entsprechen den Positionen 1 bis 10. Die letzten zwei Zeichen sind nur eine Prüfsumme."
    },
    en: {
      principle: "FOUNDATION",
      principleText: "SINNBILD49 is not fortune-telling. The cards know neither the future nor another person's thoughts. Meaning arises in the encounter between a question, randomly drawn images, and the thoughts of the person viewing them.",
      rules: "INTERPRETATION RULES",
      positions: "THE TEN POSITIONS",
      cards: "THE 49 CARDS",
      field: "Theme",
      meaning: "Possible reading",
      reflection: "Reflection question",
      input: "LAYOUT TO INTERPRET",
      question: "Question",
      code: "Code",
      codeHelp: "The ten two-digit card numbers after L10 are in draw order and correspond to positions 1 through 10. The final two characters are only a checksum."
    },
    fr: {
      principle: "PRINCIPE",
      principleText: "SINNBILD49 n'est pas de la voyance. Les cartes ne connaissent ni l'avenir ni les pensées d'une autre personne. Le sens naît de la rencontre entre une question, des images tirées au hasard et les pensées de la personne qui les regarde.",
      rules: "RÈGLES D'INTERPRÉTATION",
      positions: "LES DIX POSITIONS",
      cards: "LES 49 CARTES",
      field: "Thème",
      meaning: "Lecture possible",
      reflection: "Question de réflexion",
      input: "DISPOSITION À INTERPRÉTER",
      question: "Question",
      code: "Code",
      codeHelp: "Les dix numéros de carte à deux chiffres après L10 suivent l'ordre du tirage et correspondent aux positions 1 à 10. Les deux derniers caractères ne sont qu'une somme de contrôle."
    }
  };

  function buildHandbookText(language, question, code) {
    const lang = ["de", "en", "fr"].includes(language) ? language : "de";
    const l = labels[lang];
    const ui = window.SINNBILD_I18N[lang];
    const data = window.SINNBILD_DATA;
    const lines = [
      ui.handbookPromptTitle.toUpperCase(),
      "",
      l.principle,
      l.principleText,
      "",
      l.rules,
      ui.handbookPromptRules,
      "",
      l.positions
    ];

    data.positions.forEach((position) => {
      lines.push(`${position.number}. ${position.title[lang]} — ${position.meaning[lang]}`);
    });

    lines.push("", l.cards);
    data.cards.forEach((card) => {
      lines.push(
        `${card.number}. ${card.title[lang]}`,
        `${l.field}: ${data.fields[card.field][lang]}`,
        `${l.meaning}: ${card.meaning[lang]}`,
        `${l.reflection}: ${card.ask[lang]}`,
        ""
      );
    });

    if (question && code) {
      lines.push(
        l.input,
        l.codeHelp,
        `${l.question}: ${question}`,
        `${l.code}: ${code}`
      );
    }

    return lines.join("\n").trim();
  }

  window.SINNBILD_HANDBOOK = Object.freeze({ buildHandbookText });
}());
