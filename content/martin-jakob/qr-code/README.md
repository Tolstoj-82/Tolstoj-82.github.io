# QR-Code Generator Plus

Static website: open index.html directly or serve this directory over HTTP(S).
No build step is required. Deferred feature scripts load in the order listed in
index.html, sharing a small QRGenerator namespace. Internet access is required
for the external QR and export libraries.

## JavaScript

- `script.js`: entry point.
- `js/app.js`: page state, import mapping, template editor, ribbons and exports.
- `js/qr-renderer.js`: canvas/SVG rendering and QR readability validation.
- `js/templates.js`: local template library and save/delete dialogs.
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

Keep shared colors in tokens.css and component rules in their feature file.
Existing local-storage keys are retained, preserving saved user settings,
logos, base URLs and templates.
