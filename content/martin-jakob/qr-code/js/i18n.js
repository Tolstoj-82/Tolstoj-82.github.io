(() => {
"use strict";
const {english} = window.QRGenerator["translations"];
const {toast} = window.QRGenerator["notifications"];
let language = "de";
try {
  if (localStorage.getItem("qr-generator.language") === "en") language = "en";
} catch {
  /* Optional preference. */
}
function t(text) {
  return language === "en" ? (english[text] ?? text) : text;
}
class LocalizedError extends Error {
  constructor(render) {
    super();
    this.render = render;
  }
  get message() {
    return this.render();
  }
}
// Retain render functions so visible feedback can change language without changing user data.
const localizedMessages = new Map();
function setMessage(node, render, tone = "success") {
  localizedMessages.set(node, render);
  node.dataset.tone = tone;
  node.textContent = render();
  if (["logoStatus", "baseURLStorageStatus"].includes(node.id) && ["warning", "error"].includes(tone) && node.textContent.trim()) toast(node.textContent, tone);
}
const localizedNodes = [];
function captureTranslations() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
  );
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent.trim();
    if (Object.hasOwn(english, text))
      localizedNodes.push({
        node,
        text,
        prefix: node.textContent.match(/^\s*/)[0],
        suffix: node.textContent.match(/\s*$/)[0],
      });
  }
  for (const node of document.querySelectorAll(
    "[aria-label], [title], [placeholder]",
  )) {
    for (const attribute of ["aria-label", "title", "placeholder"]) {
      const text = node.getAttribute(attribute);
      if (Object.hasOwn(english, text))
        localizedNodes.push({ node, text, attribute });
    }
  }
}
function translateInterface() {
  document.documentElement.lang = language;
  for (const item of localizedNodes) {
    if (!item.node.isConnected) continue;
    if (item.attribute) item.node.setAttribute(item.attribute, t(item.text));
    else item.node.textContent = item.prefix + t(item.text) + item.suffix;
  }
  for (const button of document.querySelectorAll("[data-language]"))
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.language === language),
    );
  if (!new URLSearchParams(location.search).get("title"))
    document.title = t("QR-Code Generator Plus");
}



function setLanguage(value) { language = value === "en" ? "en" : "de"; try { localStorage.setItem("qr-generator.language", language); } catch { /* Optional preference. */ } }

window.QRGenerator["i18n"] = {setLanguage, get language() { return language; }, t, LocalizedError, localizedMessages, setMessage, captureTranslations, translateInterface};
})();
