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

The CSV → JSON converter supports column selection, key renaming and a preview.
CSV values remain strings, preserving leading zeros. Blank or duplicate output
keys block download. Used keys are saved locally as suggestions and can be
deleted with confirmation. No CSV content is sent to a server.
