# index.html Manual Test Checklist

## Project/storage

- [ ] New project from empty and non-empty state.
- [ ] Save locally, overwrite saved game, delete saved game.
- [ ] Saved games dropdown hidden when empty, visible when entries exist.
- [ ] Select saved game when current project is empty: should load directly.
- [ ] Select/load saved game with current project active: should confirm.
- [ ] Import one JSON into empty project: should load immediately and appear in saved games.
- [ ] Import one JSON into active project: should confirm overwrite.
- [ ] Import multiple JSONs: should add all valid ones to saved games.
- [ ] Import multiple JSONs with duplicate game names: latest export should be kept, dropped files should be listed.
- [ ] Export JSON with no saved games, with saved games, and with unsaved current changes.
- [ ] Exported JSON should include exportVersion and exportedAt at the root.

## Camera/calibration/LUT

- [ ] Camera auto-start after selecting device.
- [ ] Calibrate with normal 4-shade frame.
- [ ] Try calibrating on flat/low-contrast image; verify it fails visibly, not "success with bad thresholds."
- [ ] Snapshot button enabled only after calibration.
- [ ] Calibrate blocked while snapshot paused.
- [ ] LUT dropdown changes canvas, tiles, identifier tiles, and grid contrast.
- [ ] Manual LUT color picker updates all rendered surfaces.

## Screens/regions/identifiers

- [ ] Add, rename, delete screens.
- [ ] Drag reorder screens, including first/last.
- [ ] Add identifier tile, delete from identifier panel, confirm dialog works.
- [ ] Switch screens: identifier panel updates immediately.
- [ ] Add, rename, delete regions.
- [ ] Draw/remove region tiles on canvas.
- [ ] Show Regions toggle hides/shows regions and identifier outlines.
- [ ] Region picker: select multiple regions, then rename/select another region and confirm multi-selection is not unexpectedly lost.
- [ ] Assign tileset to region, then delete that tileset; region should become unassigned.

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
