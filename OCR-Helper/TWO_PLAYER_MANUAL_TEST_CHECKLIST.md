# two-player.html Manual Test Checklist

## Project/game setup

- [ ] Header hides into the top edge and opens on hover.
- [ ] Saved games from the same local storage as index.html appear in the single Game dropdown.
- [ ] There is only one Game dropdown in the header.
- [ ] Import JSON adds valid game settings to local storage.
- [ ] Top header first row is Game, Active Leaderboard, Game Settings, Import JSON.
- [ ] Top header second row contains Player Names, High Score Data, Show available Achievements, and the info button.
- [ ] Info button is pinned in the top-right corner of the header.
- [ ] Info button remains a perfect circle in narrow/mobile viewports.
- [ ] Imported games appear immediately in the game dropdown.
- [ ] Selecting a game loads it for both players.
- [ ] Active Leaderboard dropdown shows the selected game's high-score tracking settings.
- [ ] Selecting an Active Leaderboard chooses the Screen/Metric combination for the current session.
- [ ] Selected Active Leaderboard persists after reload.
- [ ] Active Leaderboard falls back safely when the saved setting no longer exists.
- [ ] Game Settings button opens the game-settings modal.
- [ ] Game Settings modal can add a new Screen/Metric tracking setting.
- [ ] Game Settings groups all Screen/Metric settings by screen section.
- [ ] Game Settings can edit screen, metric, label, min leaderboard score, track-until screens, fireworks screens, and demo detector.
- [ ] Screen/Metric setting name is generated as Screen -> Metric and is read-only.
- [ ] Game Settings modal can delete a setting while keeping at least one setting.
- [ ] Deleting a setting asks for confirmation.
- [ ] Game Settings modal can export settings for the selected game.
- [ ] Game Settings modal can import settings for the selected game.
- [ ] Importing settings for another game shows an error.
- [ ] High score panel title shows only the loaded game name in uppercase.
- [ ] High score panel subtitle shows the active leaderboard in brackets, e.g. "(A-Type -> Score)".
- [ ] Setup checklist appears inside each player's settings accordion.
- [ ] Game-level Fast OCR setting uses the same visual toggle style as index.html.
- [ ] Game-level Fast OCR on/off changes OCR behavior without breaking screen detection.
- [ ] Fast OCR uses scan pixels while disabled Fast OCR requires full 8x8 tile matches.
- [ ] Tetris A-Leaderboard module reads names with scan pixels whether the global Fast OCR toggle is enabled or disabled.
- [ ] Player Names button opens the Player Names modal.
- [ ] Player Names modal has Import Names and Export Names above the Name/Add row.
- [ ] Player Names modal can import a plain name array or exported name-data JSON.
- [ ] Player Names modal exports name data as player-names.json.
- [ ] Imported, added, edited, and deleted names persist in local storage after reload.
- [ ] Each name row shows its number before the editable text input.
- [ ] Name-list scrollbar has a separate gutter and does not overlap name panels or delete buttons.
- [ ] Import Names accepts file drop without changing the controls' height or shifting the modal.
- [ ] Name rows support click, Ctrl/Shift, and held-pointer range selection without checkboxes.
- [ ] Clicking outside the name rows clears their selection.
- [ ] Dragging selected names shows a useful drag ghost and temporarily turns Delete selected into a drop target.
- [ ] Dropping selected names back over the list does not insert browser drag text into an input.
- [ ] Use name list toggle is inside the Player Names modal.
- [ ] Button text in the top header and Player Names modal does not wrap.

## Cameras/calibration/LUT

- [ ] Both camera selectors populate.
- [ ] Selecting a camera auto-starts that player feed.
- [ ] The same camera cannot be selected for both players.
- [ ] Camera choice persists after reload.
- [ ] LUT choice persists per player after reload.
- [ ] LUT color squares are visible for each player.
- [ ] LUT color squares open a color picker.
- [ ] Custom LUT colors persist per player after reload.
- [ ] Calibration persists per player after reload.
- [ ] Calibration works independently for both players.
- [ ] A lost camera/video signal attempts to recover automatically.
- [ ] Replugging a cable resumes the video feed without manual reload.
- [ ] Cable-loss overlay appears on top of the canvas with the red message.
- [ ] Startup/offline interceptor screens show the correct overlay and clear when normal gameplay returns.
- [ ] Startup interceptor screen changes to restart-required message after 10 seconds.
- [ ] Interceptor overlays do not show the old red x badge.

## Layout/responsiveness

- [ ] Page never scrolls vertically; all three main panels fit inside the viewport.
- [ ] Both Game Boy screens remain fully visible and keep aspect ratio.
- [ ] Player panels use the light blue/light red panel background against white panel interiors.
- [ ] Player titles are centered, uppercase, and match the player border color.
- [ ] Blue/red canvas borders are thick enough and do not shift layout.
- [ ] Ahead player gets a green glow directly around the canvas.
- [ ] Behind player gets an orange glow directly around the canvas.
- [ ] Glow does not affect canvas size or position.
- [ ] Settings accordion trigger is sticky at the bottom of each player panel.
- [ ] Settings accordion opens upward and closes when clicking outside.
- [ ] Accordion trigger does not exceed the panel width.
- [ ] Accordion content scrolls internally if needed.
- [ ] Player name input is inside each settings accordion.
- [ ] Player names default to Player 1 and Player 2.
- [ ] Changing player name updates the player title and future score entries.
- [ ] Player names persist after reload.
- [ ] Achievement toast area above each canvas has enough headroom.

## Screen/OCR behavior

- [ ] Active screen name appears on the white player panel, not on the canvas.
- [ ] OCR reads all regions needed for the selected game.
- [ ] Scores are tracked from the active leaderboard screen/metric.
- [ ] If Track until screens are configured, score tracking continues through intermediate screens until one of those screens appears.
- [ ] Reaching a Track until screen finalizes the current score and resets tracking.
- [ ] Interceptor screens before Track until finalize the current score as interrupted and do not leave an active score behind.
- [ ] Changing the active leaderboard resets in-progress scoring runs cleanly.
- [ ] Screen detection respects required identifier counts from the exported game JSON.
- [ ] OCR value retention on unknown tiles is respected from the exported game JSON.
- [ ] Short screen-detection artefacts are bridged using the exported game grace setting.
- [ ] A fully recognized lower OCR value replaces a previously misread higher value.
- [ ] Duplicate score entries are blocked when the same finalized score is seen again after interceptor/offline screens.
- [ ] Numbers are formatted with commas, e.g. 12,345 and 1,234,567.
- [ ] Current Rank panel appears only when there is rank content.
- [ ] Current Rank panel says "Current Rank: #n".
- [ ] Current Rank panel does not move or resize the canvas when appearing.
- [ ] Current Rank panel updates when the player rank changes.
- [ ] Rank-change animation is obvious but does not change panel height or position.
- [ ] Top 3 current rank styling uses the podium appearance only when appropriate.
- [ ] Fireworks trigger only for screens selected in the active leaderboard's Fireworks multiselect.
- [ ] Fireworks overlay is transparent and does not hide the game screen.
- [ ] Game recognition starts after interceptor screens clear, not while they are active.
- [ ] If no game is recognized within the recognition window, the previous selected game is restored and the user is told to select manually.

## Achievements

- [ ] Achievements button opens a modal listing achievements from the loaded game JSON.
- [ ] Modal clearly shows achievement conditions, tiers, and messages.
- [ ] Clicking an achievement panel toggles it without a checkbox; Space/Enter does the same when focused.
- [ ] Disabled achievements are muted and show a bordered INACTIVE badge centered in the panel with readable contrast.
- [ ] Disabled achievements do not trigger toasts for either player.
- [ ] Re-enabling an achievement allows it to trigger again after the normal baseline/reset logic.
- [ ] Achievement enabled/disabled state persists in local storage.
- [ ] Achievement enabled/disabled state exports/imports with the game JSON.
- [ ] Each player has an independent achievement toast area above their screen.
- [ ] Player 1 and Player 2 achievement state is tracked separately.
- [ ] Achievements use the same trigger/baseline logic as index.html.
- [ ] Conditions already true at the start of a run are ignored as baseline.
- [ ] False-to-true condition transitions trigger a toast.
- [ ] Multiple achievements queue instead of overlapping.
- [ ] Achievement lifecycle reset screens reset only the matching achievements.
- [ ] Toast appears slightly above the corresponding canvas.
- [ ] Toast uses tier styling and gamer-achievement pill appearance.

## Live leaderboard

- [ ] High score panel stretches from top to bottom.
- [ ] Top 3 entries stay sticky and always visible.
- [ ] Ranks #4 and lower are inside their own lower scroll area.
- [ ] Scrollbar in the rank list is invisible.
- [ ] Ranks #4+ auto-scroll smoothly up and down when there are too many to fit.
- [ ] Auto-scroll speed is readable.
- [ ] Auto-scroll pauses while the pointer is inside the leaderboard and resumes after it leaves.
- [ ] User cannot manually disturb the auto-scroll position.
- [ ] Ranking order is correct for all visible and hidden ranks.
- [ ] Rank numbers are correct after many rank changes.
- [ ] When scores tie, the newer score ranks above the older one.
- [ ] Top 3 podium styling is only applied to finalized entries.
- [ ] No two entries visually claim the same podium place.
- [ ] If an entry loses podium rank, it returns to normal styling.
- [ ] Top 3 entries show trophy-in-circle styling.
- [ ] Top 3 entries show all-time rank in the upper right when available.
- [ ] Current in-progress boxes use player color, not final podium colors.
- [ ] Name-entry boxes keep the same general shape as normal live boxes.
- [ ] Boxes below 10 points disappear.
- [ ] Demo boxes disappear after confirmed demo completion.
- [ ] Removing a demo box leaves no visual artifacts on other rank panels.
- [ ] Rank swap animation appears when one score surpasses another.
- [ ] Top 3 rank swaps animate like lower-rank swaps.
- [ ] Finalized score panels show a vertically centered delete × only on hover.
- [ ] Deleting a finalized score shows a bottom undo toast without shifting the leaderboard.
- [ ] Undo restores the exact deleted entry to today's and all-time data before the toast expires.
- [ ] Letting the undo toast expire permanently keeps the entry deleted.

## Demo handling

- [ ] Demo detector can be configured globally, per screen, and per Screen/Metric setting.
- [ ] Demo detector controls are created only after pressing + Demo detector.
- [ ] Empty demo detector can be removed immediately without confirmation.
- [ ] Non-empty demo detector asks for confirmation before removal.
- [ ] Demo detector sequence input has no placeholder; example sequence appears in the label.
- [ ] Demo detector Label-as-Demo control has no placeholder.
- [ ] Detector mode switches between Sequence and Held value.
- [ ] Held value mode exposes Metric, Held value, Hold duration, Confirm on screen exit, and Track until.
- [ ] Held value mode can confirm a demo after the configured duration.
- [ ] Held value mode can confirm a previously matched value when leaving the screen if enabled.
- [ ] Track until is optional and does not show an invalid/red state when empty.
- [ ] Setting-, screen-, and game-level held detectors resolve in the same priority order as sequence detectors.
- [ ] Held detector mode and all fields persist after reload and score-settings export/import.
- [ ] Demo detection follows the configured sequence.
- [ ] Demo label appears only after the configured "Label as Demo from" value is reached.
- [ ] Demo box is visually fainter than real score boxes.
- [ ] Demo box is discarded when the configured sequence completes.
- [ ] A real score equal to the final configured demo value can still be tracked once if it did not follow the demo sequence.
- [ ] Scores above the final configured demo value are kept if they are not a completed demo.

## Game modules

- [ ] Game Settings Screen/Metric accordion shows the module + button inside the accordion content on the right.
- [ ] Module + opens matching module choices.
- [ ] Module choices close when clicking outside without selecting a module.
- [ ] Module + uses the shared black tooltip style without an arrowhead.
- [ ] Adding a module creates a module accordion inside the Screen/Metric setting.
- [ ] Module accordion starts open when newly added.
- [ ] Only one module accordion is open at a time.
- [ ] Module config dropdowns autofill when matching ROI names exist.
- [ ] Already selected ROI values disappear from sibling ROI dropdowns.
- [ ] Complete module config clears the incomplete red border.
- [ ] Detaching a module asks for confirmation.
- [ ] The same module can be added independently to multiple Screen/Metric settings.
- [ ] Tetris A-Type leaderboard-name module reads the name from the matching scoreboard row.
- [ ] Tetris A-Type leaderboard-name module forces Fast OCR only for its configured scoreboard ROIs without changing normal score/metric OCR.
- [ ] Module configuration fields persist after reload and score-settings export/import.
- [ ] If the scoreboard/rocket/offline sequence interrupts module name listening, the same score is not added again with the assigned fallback name.

## Name entry

- [ ] Player can use static accordion names or the random name list.
- [ ] Random name list avoids repeats where possible.
- [ ] Assigned fallback name is used when no module scoreboard name is read.
- [ ] Tetris A-Type module overwrites the fallback name in real time when the matching scoreboard name appears.
- [ ] Scoreboard-name listening survives Rocket screen before the scoreboard.
- [ ] Turning the Game Boy off while module name listening is pending must not add the same score again with the assigned fallback name.
- [ ] Name is limited to 12 characters.
- [ ] Custom player names appear in new ranked score entries when static names are used.
- [ ] Two simultaneous module name entries can be queued/handled without blocking gameplay.

## Daily/all-time storage

- [ ] Current day leaderboard persists in local storage.
- [ ] Reloading the browser restores today's entries for the selected game.
- [ ] All-time top 20 persists in local storage.
- [ ] Daily data is game-specific; scores from other games do not mix in.
- [ ] All-time data is game-specific; scores from other games do not mix in.
- [ ] Local storage score data for unknown/deleted games is cleaned up.
- [ ] High Score Data button opens the high-score data modal.
- [ ] High-score data modal has its own Game dropdown.
- [ ] High-score data Game dropdown can inspect a game other than the currently loaded game.
- [ ] High-score data modal has a stable tall height and does not jump while accordions open.
- [ ] High-score data modal has an internal vertical scrollbar when content is long.
- [ ] Each day accordion lists rank numbers.
- [ ] Day accordion headers show arrows.
- [ ] Day entries do not repeat the game name in the middle.
- [ ] Names can be edited inside day entries without closing the accordion.
- [ ] Individual day entries can be deleted.
- [ ] Day/all-time rows support click, Ctrl/Shift, and held-pointer range selection without checkboxes.
- [ ] Clicking outside selectable score rows clears their selection.
- [ ] Clicking a selected row can deselect it according to the Windows-style selection behavior.
- [ ] Dragging selected scores shows a useful drag ghost.
- [ ] Dropping selected scores back over score panels does not insert browser drag text into editable name inputs.
- [ ] Delete Selected asks for confirmation and removes all selected entries.
- [ ] Delete Selected remains in a fixed position: inactive/dimmed with no selection and active with a selection.
- [ ] While dragging selected scores, Delete Selected becomes the drop target without changing row/action-bar height.
- [ ] Whole day/game data can be deleted after confirmation.
- [ ] All Time Top 20 appears as an accordion in a distinct style.
- [ ] All-time entries can be edited and deleted.
- [ ] Export Days Data downloads only the selected game's day/all-time data.
- [ ] Import Days Data accepts an exported day-data JSON.
- [ ] Import Days Data accepts multiple files.
- [ ] Import Days Data rejects data for unknown games.
- [ ] Imported day entries merge with existing days instead of clearing unrelated games.
- [ ] Imported duplicate score keys overwrite the matching score.
- [ ] Importing today's data refreshes the leaderboard without interrupting an active run.
- [ ] All-time list is rebuilt after day data import.
- [ ] Invalid day-data JSON shows an import error and leaves storage unchanged.

## Manual regression sweep

- [ ] Run a Player 1 game from score 0 to game end; verify tracking, rank, name entry, and persistence.
- [ ] Run a Player 2 game from score 0 to game end; verify tracking, rank, name entry, and persistence.
- [ ] Run both players at once; verify independent OCR, rankings, achievements, and name entry.
- [ ] Reload after several scores; verify cameras/LUT/calibration/game and today's leaderboard restore.
- [ ] Switch to another saved game; verify old game's daily/all-time scores do not appear.
- [ ] Resize browser narrow and wide; verify no page scrolling and no overlap.
