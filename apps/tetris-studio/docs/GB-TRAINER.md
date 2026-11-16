# Game Boy free-play trainer

The free-play workspace adapts the board-centered analysis flow from https://gregorycannon.github.io/TetrisTrainer/ using the existing original-ROM GB board, pieces, controller, colours and bundled font. It does not call the reference site's backend or import its NES engine. Everything still runs from index.html without a server.

## During play

Free play opens the Analysis tab beside Course and Settings. The starting-level/source chooser stays on the board. Score, lines and level stay below the next box on the right. Analyze position pauses the simulated game and asks for the existing learning-only hint acknowledgement when needed. In-game analysis marks the score as assisted, even if the continuous hint toggle is off. It does not silently enable that toggle. Continue game resumes from the original live position. Hardware capture uses Return to live board, since analysis cannot pause a physical Game Boy.

The advisor lists distinct current placements with their best retained next placement. Selecting one previews it in blue. This + next shows the next placement in green, applying real clears between pieces. Rankings use the existing local GB advisor, with native timing verification. No new normalized quality score or purported optimality guarantee is introduced.

## After the game

Review game opens a timeline of recorded placements and analyzes the game asynchronously with a progress bar. The final two placements remain visible but are excluded from analysis. Left/right arrows, previous/next buttons and the slider inspect the selected recorded board without navigating hidden course situations. Replay placement follows a verified native route and the original clear timing. Historical score, lines and level are displayed while inspecting a recorded position.

Your move, Recommended and This + next compare the committed placement with alternatives. Accepted includes matching advice and known course opener placements. Alternative is descriptive, not a calibrated error threshold. Missed Tetris identifies a verified four-line clear the player did not take. The existing mistake gallery and puzzle collection remain available. Collection retains the eight-row cap; full game review does not have that cap. A new game or leaving free play clears the trainer's in-memory history, results, queued work and replay state. Nothing is persisted or uploaded.

## GB geometry and input limits

The matrix is exactly 10 by 18; the advisor rejects 20-row input rather than cropping or padding it. Spawn poses and all physical orientations come from core.js and the extracted ROM tables. The T at its original GB spawn occupies rows 1 and 2 with zero-based indexing, and the all-piece spawn band is three rows deep. The empty-board conservative downward clearance is therefore 15 rows, not an NES 20-row fall budget. These offsets are already in the model and must not be subtracted a second time.

The evaluator measures occupied cells under the real spawn footprints, blocked spawns and speed-dependent headroom. Both current and next candidates must have a timing-valid path. Future branches apply the GB gravity table, line-clear transitions and native spawn again. Advisor tapping speed is selectable at 10, 12, 15 or 20 Hz; the conservative frame cadence is rounded from the native frame rate and propagated through current, next and future planning. The actual keyboard controller retains original GB DAS and soft-drop timing.

## Validation

- tests/trainer.test.cjs verifies immutable snapshots, review progress, cancellation, actual-move comparison, ranked alternatives, native replay, Tetris priority, lower-spawn collision, 18-row validation and tap cadence.
- tests/app.test.cjs covers live inspection/consent, paused controls, current/next previews, post-game timeline, review arrows and restart cleanup alongside the existing course.
- Existing advisor, game-review, playable, free-play and autoplay suites retain their native gravity, entry-delay, rotation and collection checks.

## Hover previews beside the situation

Once analysis is available, the ranked placement buttons appear beside the main board and current/next display. Mouse hover and keyboard focus temporarily preview the selected current/next pair without changing the pinned choice. Leaving the button or moving keyboard focus away restores that choice; clicking pins the pair. Button nodes remain stable while hovering, so previews do not interrupt pointer/focus events or trigger another search. Timeline changes, resuming play and a new game clear temporary previews. The normal sidebar list is hidden while the adjacent list is shown.
