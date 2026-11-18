# QR-Coder

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
Select Standard or a saved QR template below the Cart's QR preview, or apply a
custom appearance directly. Saving a reusable QR template is optional. Single
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
Merriweather, Inter, Nunito Sans, Noto Sans, PT Sans, Libre Baskerville and
Roboto Slab, loaded through the Google Fonts CSS2 API. PNG rendering waits for
the selected font; SVG exports embed its font files (cached for the session).
An internet connection is needed for the initial font download. Existing
templates using system fonts continue to work.

Title/subtitle source selection and visibility live on their draggable rows.
Click a source-key badge to change its field, or click the heading label to
override its displayed text. Choosing another source clears that override.
Bulk filenames default to the mapped title field. A custom filename pattern overrides that requirement.

The CSV ↔ JSON converter supports column selection, key renaming and a preview.
CSV values remain strings, preserving leading zeros. Blank or duplicate output
keys block download. Used keys are saved locally as suggestions and can be
deleted with confirmation. No CSV content is sent to a server.


The converter is available in the header Tools menu. It accepts CSV/TSV or flat JSON,
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

The header theme toggle follows the system preference until a light/dark choice
is saved locally. Theme changes use a shared 220 ms color transition and respect
reduced-motion settings. QR artwork and exported colors are independent of the UI theme.

Single-code Simple mode keeps live shape, finder, color and logo controls open.
Its mode and appearance are stored separately under `qr-generator.simple-mode.v1`;
Cart templates are unchanged. Simple PNG/SVG downloads contain just the QR code.
On desktop, the Cart editor's cog opens an animated settings panel alongside the
QR preview; its close control restores the centered preview. On mobile, these
settings remain below the draggable fields. Reduced-motion preferences are respected.
Toasts follow the most recently opened modal and are raised in the browser top
layer, retaining their queue order and remaining display time.


The hammer menu contains CSV ↔ JSON and QR codes → table. The QR reader accepts
PNG, JPEG, WebP, GIF (first frame), BMP and SVG images, individually or inside ZIPs.
It processes locally, including up to 32 QR symbols per image, and keeps filenames,
decoded text and a status for unreadable/unsupported inputs. Nested ZIPs are not
expanded. Limits are 20 MB per image, 50 MB per ZIP, 500 files per batch and
200 MB of image data in a batch (including decompressed entries); images are
limited to 8192 pixels per side and 40 megapixels. Closing/cancelling stops after
the current decoding step and retains completed results for reopening.
CSV exports use semicolons and UTF-8 with BOM; clipboard output is tab-separated
with quoted multiline cells for spreadsheets. Formula-like spreadsheet values
receive a leading apostrophe. JSON preserves the original decoded text exactly.

## Bulk filename patterns and compact SVG exports

The main bulk export panel has a Define filenames button. Its modal offers Title
(default) and a custom card editor, separate from QR content and Cart headings.
The underlying definition combines literals and quoted field placeholders, for
example `{{"Line"}}-{{"Direction"}};{{"Project"}};{{"Stop"}}`.
Use field cards to insert exact imported keys, including spaces and accents.
Select Title (default) to retain title-based naming. The extension is added
from the chosen export format. A preview displays the first three filenames;
missing fields, empty names and names longer than 180 characters block export.
Windows-invalid characters are replaced with underscores. Duplicate filenames
receive _2, _3, etc., with a warning in the preview.

The PDF identifier preset combines these columns in order:
Betriebszweig-Liniennummer-Linienergaenzung-Linienversionsnummer-Richtung;
Projekt-Kuerzel;Haltestellennummer. It recognizes the original CSV column names
with their example suffixes. It uses the imported version as supplied; it does
not infer or correct PDF/CSV version differences. No station name is required.
For example: `2-10-A-2-H;j27;158.svg`.

QR content expressions and their free-text cards are session data. They are no
longer automatically saved or restored with appearance preferences. Clearing the
import clears active QR content. Named Cart templates and explicitly saved text
snippets still keep content when the user deliberately saves them. Bulk export
retains the current session so another export is possible without re-entry.

For codes intended for PDF insertion, choose SVG and check QR code only (without
Cart). This exports the QR, its quiet zone and chosen logo, without Cart labels,
headings or ribbons. No fonts are embedded when there is no SVG text. Text-bearing
SVGs embed fonts subset to batch characters rather than full multilingual font
files. Adjacent square modules are combined into paths, path coordinates use
three decimal places, and ZIP archives use DEFLATE compression. Export dimensions
remain unchanged; SVG is scalable. Logos can still dominate file size.

External QR/font dependencies still require internet access, as before. There is
no new server or build requirement.

## Filename modal

Bulk filenames use the mapped Title field by default. Define filenames opens a
modal with Title (default) and Custom definition. Custom mode reuses the QR
content editor: add free-text or imported-field cards, edit them, and drag to
reorder them. The PDF identifier preset is available inside this modal.
Apply validates all imported rows and commits the definition. Cancel, close,
and Escape discard draft changes. Switching back to Title clears the custom
filename definition. Filename edits do not change the QR payload or Cart text.
The filename definition is session-only and starts with Title on reload.

## Regression checks

With Node.js 20.19 or newer, run `npm install` and `npm test`. These are test-only
dependencies; the website still runs directly without a build step.

The integration checks load all application scripts into a DOM test environment,
render real QR images, and decode PNG and SVG exports. They cover bulk import,
preview updates, invalid-content recovery, filename Apply/Cancel, and single and
ZIP downloads. Separate checks simulate rendering failures in each preview.
The DOM checks do not replace visual browser testing.

The filename editor reuses the existing Cart dialog, select, text-card, preview
and action-button rules. Bulk QR-only export uses the existing preview switch.

## Bulk export workflow

Apply Cart changes first, then apply QR appearance and define filenames. Applying
a Cart does not require a filename/title yet; applying appearance does not require
saving a QR template. Start export validates the QR content and filenames and
reports errors on the bulk page without automatically opening editors.

For SVG without Cart labels, enable QR code only and select SVG. The preview
switch independently controls previews during generation. Each enabled preview
gets a paint opportunity, and the last preview stays open after a successful ZIP
download. Closing it does not turn previews off for future exports; closing it
during generation hides previews for that batch only.
