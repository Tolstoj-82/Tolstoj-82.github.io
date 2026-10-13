# QR-Code Generator Plus

Static website: open index.html directly or serve this directory over HTTP(S).
No build step is required. Deferred feature scripts load in the order listed in
index.html, sharing a small QRGenerator namespace. Internet access is required
for the external QR and export libraries.

## JavaScript

- `script.js`: entry point.
- `js/qr-content.js`: flat JSON validation, QR content expressions and resolved previews.
- `js/app.js`: page state, import mapping, template editor, ribbons and exports.
- `js/qr-renderer.js`: canvas/SVG rendering and QR readability validation.
- `js/template-combo.js`: editable template names, autosuggest and overwrite confirmation.
- `js/templates.js`: separate single-code and bulk text-template libraries.
- `js/qr-presets.js`: shared QR appearance presets (shape, colors, logo and ribbons).
- `js/logos.js`: logo upload, selection and local storage.
- `js/logo-crop.js`: square crop dialog.
- `js/i18n.js` and `js/translations.js`: interface language and translations.
- `js/notifications.js`: toast queue.

## Styles

`styles.css` loads the feature styles in cascade order. `css/tokens.css` defines
the shared palette: neutral tones, one accent and success/warning/error colors.
Transparent shades are derived from these variables. User-selected QR and ribbon
export colors remain independent of the interface palette.

- `base.css`: typography, controls and notifications.
- `generator.css`: page, accordions, preview and import controls.
- `dialogs.css`: modal frames, headers and scroll areas.
- `editor.css`: template fields, drag controls and ribbon rules.
- `logos.css`: logo gallery and cropping.
- `templates.css`: saved-template controls.
- `presets.css`: QR settings accordion, variable chips and preset controls.

Keep shared colors in tokens.css and component rules in their feature file.
Existing local-storage keys are retained, preserving saved user settings,
logos, base URLs and templates.

Cart templates include a QR appearance snapshot and its QR-template reference.
Select Standard or a saved QR template below the Cart's QR preview. New QR
designs must be saved before applying the Cart or saving its template. Single
and bulk Carts keep independent appearances, including their logos.
PNG/JPEG logos up to 20 MB, 8192 pixels per side and 40 megapixels are accepted,
cropped if needed, and downscaled to at most 256 × 256 pixels before storage.
Drag logos to reorder them; Alt+Left/Right also reorders a focused logo.

Type a new template name and save to create it. Saving an existing name asks for
confirmation before replacing it. Names are matched without case sensitivity
within their own QR, single-text or bulk-text library.

Bulk imports accept flat records without URL fields. The required QR-content
expression combines literal text and JSON fields: `Stop {{Interne_ID}}` or
`{{"Base_URL"}}{{"Interne_ID"}}`. Field buttons insert quoted placeholders,
including keys containing spaces or punctuation. Missing fields and empty
resolved codes block export. Primitive arrays (such as lines) are supported;
nested objects are rejected. Expressions are saved with bulk text templates.

The main modes use tabs. Cart editing and QR appearance editing open in modal
dialogs with Apply changes and Cancel. The Cart includes an appearance selector
and a QR-settings accordion. `js/cart-appearance.js` manages these controls,
appearance snapshots and logo loading; `css/cart-appearance.css` styles them.
Bulk content is edited as reorderable typed cards (free text or imported field).
Card boundaries and types are saved with the Cart template. Bulk export retains
the loaded data and settings for another export. Export starts only from the main
page, with the format selector next to Start export below the preview toggle.
Tilted squares use deterministic angles within +/-6 degrees
so previews and exports share the same appearance.

Cart fonts include Roboto, Open Sans, Lato, Montserrat, Source Sans 3 and
Merriweather, loaded through the Google Fonts CSS2 API. PNG rendering waits for
the selected font; SVG exports embed its font files (cached for the session).
An internet connection is needed for the initial font download. Existing
templates using system fonts continue to work.

Title/subtitle source selection and visibility live on their draggable rows.
Click a source-key badge to change its field, or click the heading label to
override its displayed text. Choosing another source clears that override.
Bulk filenames still use the required mapped title field.

The CSV ↔ JSON converter supports column selection, key renaming and a preview.
CSV values remain strings, preserving leading zeros. Blank or duplicate output
keys block download. Used keys are saved locally as suggestions and can be
deleted with confirmation. No CSV content is sent to a server.


The converter is shown only in Bulk export. It accepts CSV/TSV or flat JSON,
lets you rename/select columns, and exports the opposite format. CSV detection
supports comma, semicolon, tab, pipe, colon, caret and tilde; the converter also
accepts a custom single-character delimiter. Encoding detection uses UTF-8,
UTF-16 BOMs and a Windows-1252 fallback. A manual encoding selector is available
when the source encoding is ambiguous. CSV downloads include a UTF-8 BOM.

URL-driven single QR codes support these query parameters:
- `url`: QR content; `title` and `subtitle`: optional Cart headings.
- `qrShape`: square, tilted, circle, rounded, diamond, horizontal, vertical, dot.
- `qrFinderShape`: square, circle, circular, rounded-square, diamond, ring,
  square-circle, circle-square.
- `qrColor` and `qrFinderColor`: six-digit hex colors, without a leading #
  (or URL-encode # as %23).
- `qrTemplate`: exact name or ID of a QR template saved in this browser.
  Explicit appearance parameters override the selected template.
- `preview=0`: suppress automatic opening of the large preview. Otherwise a
  link with `url` opens the preview automatically. The eye beside the QR code
  opens it again after closing. The single-code tab takes priority over `tab`.

Example: `?url=https%3A%2F%2Fexample.org&qrShape=rounded&qrColor=333333&qrFinderShape=circle`.
Unknown appearance values are ignored. Appearance parameters are not listed as
unused content fields. Local template names are not portable to other browsers.

The link icon beside each Cart copies a parameterized single-code URL for its
current preview (the first record in Bulk export). It includes QR content,
visible title/subtitle, displayed source fields and QR appearance parameters.
Only fields placed on the Cart are included, not the full imported record.
Logo/template references require the same locally saved QR template in the
receiving browser; the link does not embed image data or a complete Cart layout.
