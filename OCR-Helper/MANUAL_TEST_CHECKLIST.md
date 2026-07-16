# config.html Manual Test Checklist

Version Beta 1.3

- [ ] Game-name autosuggest options retain black text on hover and keyboard focus, matching the recognition-screen dropdown.

- [ ] The purple Two Player link opens index.html and shows a link symbol.
- [ ] The Two Player link warns before discarding named or unnamed unsaved configuration changes.
- [ ] The Two Player link navigates immediately when the current configuration has no unsaved changes.
- [ ] All circular × delete controls use the same size and borderless muted style, turning red on hover or keyboard focus.
- [ ] Captured snapshots persist after reloading config.html and retain their preview palette.
- [ ] Snapshot names persist after editing and pressing Enter or leaving the field.
- [ ] Snapshots can be rearranged by their drag handles and retain the new order after reload.
- [ ] Snapshot drag targets show a yellow insertion bar on the left or right side, matching tile-card reordering.
- [ ] Deleting a snapshot removes it from the library and local storage after confirmation.
- [ ] The Snapshot modal header keeps the drag handle, title, and close × aligned on one row like the other application modals.

## Project/storage

- [ ] New project from empty and non-empty state.
- [ ] New project button says "+Add Game".
- [ ] Save locally, overwrite saved game, delete saved game.
- [ ] Saved games dropdown hidden when empty, visible when entries exist.
- [ ] Select saved game when current project is empty: should load directly.
- [ ] Select/load saved game with current project active: should confirm.
- [ ] Import one JSON into empty project: should load immediately and appear in saved games.
- [ ] Import one JSON into active project: should confirm overwrite.
- [ ] Import multiple JSONs: should add all valid ones to saved games.
- [ ] Import multiple JSONs with duplicate game names: latest export should be kept, dropped files should be listed.
- [ ] Export JSON with no saved games, with saved games, and with unsaved current changes.
- [ ] Export JSON button says "Export JSON".
- [ ] Export JSON saves unsaved current settings to local storage first when exporting that unsaved game.
- [ ] Exported JSON should include exportVersion and exportedAt at the root.
- [ ] Game name field offers autosuggest from known game names without forcing a selection.
- [ ] Selecting a known game name can associate the available boxart metadata.
- [ ] Boxart image metadata exports/imports with the game JSON when present.

## Camera/calibration/LUT

- [ ] Camera auto-start after selecting device.
- [ ] Calibrate with normal 4-shade frame.
- [ ] Try calibrating on flat/low-contrast image; verify it fails visibly, not "success with bad thresholds."
- [ ] Snapshot button enabled only after calibration.
- [ ] Calibrate blocked while snapshot paused.
- [ ] Take Snapshot and Snapshots buttons sit next to each other.
- [ ] Snapshots button appears only after at least one snapshot exists.
- [ ] Returning from a loaded snapshot to live feed does not create a duplicate snapshot.
- [ ] Snapshot modal stores up to 10 snapshots and lets each one be restored.
- [ ] LUT dropdown changes canvas, tiles, identifier tiles, and grid contrast.
- [ ] Manual LUT color picker updates all rendered surfaces.
- [ ] LUT area is an initially closed accordion.
- [ ] OCR Stability area is an initially closed accordion.
- [ ] Ignore artefacts (ms) accepts only integers from 0 to 1000.
- [ ] Retain value while unknown keeps the last OCR value when an ROI contains unknown tiles.
- [ ] Fast OCR toggle is inside OCR Stability.
- [ ] Fast OCR uses tileset scan pixels; disabling it uses full 8x8 tile matching.
- [ ] Animated/blinking tiles visibly demonstrate whether scan-pixel matching is required for stable OCR.
- [ ] Camera refresh remains stable after camera permission errors or unplug/replug cycles.

## Screens/regions/identifiers

- [ ] Add, rename, delete screens.
- [ ] Drag reorder screens, including first/last.
- [ ] Add identifier tile, delete from identifier panel, confirm dialog works.
- [ ] Switch screens: identifier panel updates immediately.
- [ ] Identifiers area is its own accordion and starts closed when identifiers exist.
- [ ] Screen with no identifier tiles forces Identifiers accordion open.
- [ ] Screen with no identifier tiles shows the identifier plus button in orange.
- [ ] Identifiers accordion cannot stay closed until at least one identifier tile exists.
- [ ] Identify at least dropdown is hidden until at least one identifier tile exists.
- [ ] Identify at least dropdown offers all/1/2/... and disables when only one identifier exists.
- [ ] Clicking identifier plus enters tile-pick mode for 10 seconds, shows tooltip, and can be cancelled by clicking again.
- [ ] After selecting an identifier tile, the Identifiers accordion opens.
- [ ] Identifier matching respects "Identify at least" when detecting screens.
- [ ] Add, rename, delete regions.
- [ ] Renaming a tileset updates every tileset dropdown, including region-panel dropdowns.
- [ ] Draw/remove region tiles on canvas.
- [ ] Show Regions toggle hides/shows regions and identifier outlines.
- [ ] Auto Detect Screens bridges short detection gaps using Ignore artefacts (ms).
- [ ] Stalled OCR values appear orange in Live OCR.
- [ ] Region picker: select multiple regions, then rename/select another region and confirm multi-selection is not unexpectedly lost.
- [ ] Assign tileset to region, then delete that tileset; region should become unassigned.
- [ ] Workflow hints remain visible and show a compact checklist.
- [ ] Workflow Tiles hint is OK when either discovered tiles or saved tileset tiles exist.

## Demo detectors

- [ ] Global and per-screen demo detector areas show only the + Demo detector action until created.
- [ ] Empty detector sections are omitted from exported game JSON.
- [ ] Sequence mode persists metric, sequence, starting value, and Track until screens after reload.
- [ ] Held value mode persists metric, held value, hold duration, Confirm on screen exit, and Track until screens after reload.
- [ ] Track until may remain empty in both detector modes without showing an invalid/red state.
- [ ] Removing a completely empty detector does not ask for confirmation.
- [ ] Removing a detector with metric, sequence, held value, or Track until data asks for confirmation.
- [ ] Export/import round-trip preserves both sequence and held-value detector modes.
- [ ] Importing older demo-detector JSON without mode fields falls back to sequence mode.

## Achievements

- [ ] Add a new achievement: it should start open.
- [ ] New achievement metric dropdown should show an empty/placeholder value first.
- [ ] Empty/placeholder metric option should not be choosable as a real metric.
- [ ] New achievement should appear in the Unassigned group before all metric groups.
- [ ] Select a metric: achievement should move to that metric group immediately and remain open.
- [ ] Only one achievement accordion should be open at a time.
- [ ] Editing metric, comparer, value, message, and tier should update JSON on the fly.
- [ ] Changing tier should update the achievement background/border immediately.
- [ ] Achievement lifecycle defaults to Reset: This screen.
- [ ] Achievement lifecycle should allow selecting multiple reset screens.
- [ ] Tetris-style achievement with Reset: This screen should reset when re-entering that screen.
- [ ] Mario-style achievement with Reset: another screen should stay fired across world screens and reset when that reset screen is reached.
- [ ] Renaming a screen should update achievement reset-screen references.
- [ ] Deleting a referenced reset screen should fall affected achievements back to Reset: This screen.
- [ ] Achievement groups should be grouped by metric.
- [ ] Drag reorder achievements within the same metric group.
- [ ] Drag reorder should not allow moving achievements across metric groups.
- [ ] Delete achievement, confirm dialog works, JSON updates.
- [ ] Export JSON includes screen achievements with metric, comparer, value, message, tier, and resetScreens.
- [ ] Import JSON restores achievements into the correct screens and groups.
- [ ] Runtime trigger state should not be saved to JSON.
- [ ] Start/read a screen where an achievement condition is already true; it should be ignored as baseline.
- [ ] Trigger a false-to-true achievement transition; toast should appear.
- [ ] Trigger multiple achievements at once; toasts should queue, not overlap.
- [ ] Switch away from a screen and back; achievement baseline should reset for the new run.
- [ ] Toast should appear slightly above the canvas.

## Tile discovery/import

- [ ] Start/stop discoverer with no region selected: should block.
- [ ] Discover tiles from one region and multiple regions.
- [ ] Upload PNG via button.
- [ ] Drop PNG from Explorer onto upload button.
- [ ] Valid 4-shade PNG imports correctly.
- [ ] Valid 2-shade PNG imports only black/white values.
- [ ] Invalid PNG dimensions, alpha, colored pixels, or wrong shade count show an error.
- [ ] Invert toggle updates preview/import.
- [ ] Cancel PNG import leaves tiles unchanged.
- [ ] Trailing empty tiles are ignored.

## Tile selection/actions

- [ ] Single click selects one tile.
- [ ] Click selected single tile deselects it.
- [ ] Ctrl/Shift multi-select works.
- [ ] Marquee select in discovered tiles.
- [ ] Marquee select inside tileset.
- [ ] Selecting tiles from another source clears previous selection.
- [ ] Right-click selected tiles: dialog shows direct buttons, not dropdown.
- [ ] Cancel right-click dialog keeps/clears visual state sensibly.
- [ ] Create new tileset from selected tiles, with custom name.
- [ ] Move selected tiles to existing tileset.
- [ ] Delete selected tiles.
- [ ] Blue outlines remain visible while dialog is open.

## Drag/drop tiles

- [ ] Drag one discovered tile before/after another.
- [ ] Drag multiple selected discovered tiles before/after another discovered tile.
- [ ] Drag selected discovered tiles into empty tileset.
- [ ] Drag selected discovered tiles into existing tileset at a specific position.
- [ ] Drag selected tiles within same tileset before/after another tile.
- [ ] Ctrl-drag/copy behavior into tileset, if still desired.
- [ ] Drop selected tiles on global delete zone.
- [ ] Drop selected tiles on tileset delete dropzone.
- [ ] Confirm green insertion marker and target border are visible.

## Tilesets

- [ ] Main >> Tileset button moves all discovered tiles, regardless of selection.
- [ ] Main + Tileset can create empty tileset.
- [ ] Accordion arrow appears and rotates.
- [ ] Rename tileset title.
- [ ] Change tileset type: Text/Number and Counter.
- [ ] Delete tileset updates region assignments.
