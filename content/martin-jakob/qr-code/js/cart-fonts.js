(() => {
  "use strict";
  const cssURL = (font) =>
    "https://fonts.googleapis.com/css2?family=" +
    encodeURIComponent(font).replace(/%20/g, "+") +
    ":wght@400;700&display=swap";
  const embedded = new Map();
  async function ready(font = "Roboto") {
    if (!document.fonts) return;
    const loaded=await Promise.all([
      document.fonts.load('400 36px "' + font + '"'),
      document.fonts.load('700 36px "' + font + '"'),
    ]);
    if(window.QRGenerator['cart-fields'].fonts.includes(font)&&loaded.some(faces=>!faces.length))throw Error(window.QRGenerator.i18n.t('Schriftart konnte nicht geladen werden.')+' '+font);
  }
  async function svgStyle(font = "Roboto") {
    if (!window.QRGenerator["cart-fields"].fonts.includes(font)) return "";
    if (!embedded.has(font))
      embedded.set(
        font,
        (async () => {
          const response = await fetch(cssURL(font));
          if (!response.ok) throw Error("Font: " + font);
          let css = await response.text();
          const urls = [
            ...new Set(
              [
                ...css.matchAll(
                  /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g,
                ),
              ].map((match) => match[1]),
            ),
          ];
          if (!urls.length) throw Error("Font: " + font);
          for (const url of urls) {
            const file = await fetch(url);
            if (!file.ok) throw Error("Font: " + font);
            const blob = await file.blob();
            const data = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            css = css.split(url).join(data);
          }
          return "<defs><style><![CDATA[" + css + "]]></style></defs>";
        })().catch((error) => {
          embedded.delete(font);
          throw error;
        }),
      );
    return embedded.get(font);
  }
  window.QRGenerator["cart-fonts"] = { ready, svgStyle };
})();
