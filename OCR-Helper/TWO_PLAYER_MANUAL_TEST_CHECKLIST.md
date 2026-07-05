# two-player.html Manual Test Checklist

## Project/game setup

- [ ] Header hides into the top edge and opens on hover.
- [ ] Header stays open while interacting with controls and closes after clicking outside.
- [ ] Saved games from the same local storage as index.html appear in the game dropdown.
- [ ] Game dropdown visually matches the custom dropdown style and closes when the header closes.
- [ ] Delete game x is only visible in the open game dropdown list.
- [ ] Deleting the selected game clears the loaded game state cleanly.
- [ ] Import JSON adds valid game settings to local storage.
- [ ] Imported games appear immediately in the game dropdown.
- [ ] Selecting a game loads it for both players.
- [ ] High score panel title shows only the loaded game name in uppercase.
- [ ] Missing setup text appears only while game/cameras/calibration are missing.
- [ ] Fast OCR toggle uses the same visual toggle style as index.html.
- [ ] Fast OCR on/off changes OCR behavior without breaking screen detection.

## Cameras/calibration/LUT

- [ ] Both camera selectors populate.
- [ ] Selecting a camera auto-starts that player feed.
- [ ] The same camera cannot be selected for both players.
- [ ] Camera choice persists after reload.
- [ ] LUT choice persists per player after reload.
- [ ] Calibration persists per player after reload.
- [ ] Calibration works independently for both players.
- [ ] A lost camera/video signal attempts to recover automatically.
- [ ] Replugging a cable resumes the video feed without manual reload.
- [ ] Cable-loss overlay appears on top of the canvas with the red message.
- [ ] Startup/offline interceptor screens show the correct overlay and clear when normal gameplay returns.

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
- [ ] Achievement toast area above each canvas has enough headroom.

## Screen/OCR behavior

- [ ] Active screen name appears on the white player panel, not on the canvas.
- [ ] OCR reads all regions needed for the selected game.
- [ ] Scores are only tracked while the recognized screen is A-Type.
- [ ] Leaving A-Type ends the current run.
- [ ] Numbers are formatted with commas, e.g. 12,345 and 1,234,567.
- [ ] Current Rank panel appears only when there is rank content.
- [ ] Current Rank panel says "Current Rank: #n".
- [ ] Current Rank panel does not move or resize the canvas when appearing.
- [ ] Current Rank panel updates when the player rank changes.
- [ ] Rank-change animation is obvious but does not change panel height or position.
- [ ] Top 3 current rank styling uses the podium appearance only when appropriate.

## Achievements

- [ ] Achievements button opens a modal listing achievements from the loaded game JSON.
- [ ] Modal clearly shows achievement conditions, tiers, and messages.
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

## Demo handling

- [ ] Demo detection follows the sequence 0, 1, 6, 14, 17, 21, 28, 33, 34, 38, 42, 48, 12048.
- [ ] Demo label appears after 28 is reached.
- [ ] Demo box is visually fainter than real score boxes.
- [ ] Demo disappears when it reaches 12048.
- [ ] A real score of 12048 can still be tracked once if it did not follow the demo sequence.
- [ ] Scores above 12048 are kept if they are not a completed demo.

## Name entry

- [ ] Every finalized score of 10 or more offers name entry, not only top 20.
- [ ] Name entry panel is below the correct player's canvas and inside the visible viewport.
- [ ] Name entry panel is prominent and green-toned.
- [ ] Panel says "Schreib deinen Namen".
- [ ] Input is fully inside the panel and does not overlap.
- [ ] Placeholder says "Benutze das Keyboard...".
- [ ] Initial timer is 30 seconds before user action.
- [ ] Timer is prominent and animates once per second.
- [ ] Timer hides after the player starts typing.
- [ ] After the last typed character, idle timeout is 10 seconds.
- [ ] Pressing Enter saves the name immediately.
- [ ] Name entry accepts letters, numbers, spaces, and special characters.
- [ ] Name is limited to 12 characters.
- [ ] Player 1 and Player 2 names are uppercase in the ranked list if unchanged.
- [ ] Two simultaneous name entries can be queued/handled without blocking gameplay.
- [ ] A player can start a new run while their previous name entry is still open.

## Daily/all-time storage

- [ ] Current day leaderboard persists in local storage.
- [ ] Reloading the browser restores today's entries for the selected game.
- [ ] All-time top 20 persists in local storage.
- [ ] Daily data is game-specific; scores from other games do not mix in.
- [ ] All-time data is game-specific; scores from other games do not mix in.
- [ ] Days button opens the days modal.
- [ ] Days modal has a stable tall height and does not jump while accordions open.
- [ ] Days modal has an internal vertical scrollbar when content is long.
- [ ] Each day accordion lists rank numbers.
- [ ] Day accordion headers show arrows.
- [ ] Day entries do not repeat the game name in the middle.
- [ ] Names can be edited inside day entries without closing the accordion.
- [ ] Individual day entries can be deleted.
- [ ] Whole day/game data can be deleted after confirmation.
- [ ] All Time Top 20 appears as an accordion in a distinct style.
- [ ] All-time entries can be edited and deleted.
- [ ] Export Days Data downloads only the selected game's day/all-time data.
- [ ] Import Days Data accepts an exported day-data JSON.
- [ ] Import Days Data accepts multiple files.
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
