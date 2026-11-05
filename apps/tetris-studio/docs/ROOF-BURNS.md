# Roof burns

Open index.html?lesson=roof-burns. The chapter is in Save Stacking > Roof burns. Individual examples use situation=roof-burn-... URLs and reopen their menu ancestors.

## Definition

A roof burn removes covering rows and makes a previously buried empty cell open from above. This follows the course definition supplied by the author. The empty cell must already exist, survive the clear, and have no occupied cell above it afterward. Merely clearing rows or deleting the empty cell itself does not qualify.

Orange shows original covered empty cells, purple the completed rows, red the placed piece and green the tracked cells after their roof is removed. The stack uses the existing ROM minos.

## Lesson order

The first 11 examples use a spike of L/J/T or the lower two cells of a vertical S/Z. The spike is derived from the ROM footprint as the cell whose removal leaves a straight three-mino backbone. The clear must include that cell's row. Vertical S/Z examples complete two covering rows in a matching stepped slot.

The next 12 examples cover flat backbones, horizontal S/Z, O singles/doubles, horizontal I and vertical I clears from one through four rows. All seven pieces are represented.

## Search and verification

The deterministic search examines 104,895 layouts over all 19 unique orientations. It varies contiguous bands of completed piece rows, roofs at heights five to seven, interior target columns, and cavity widths/depths from one to three. Starting stacks have an even number of minos and no completed rows. A separate existing left well stays buried under the covering band.

Candidates must genuinely uncover tracked cells, leave no covered holes, and avoid column 10 being lower than column 9. The best five candidates per family are considered for timed native route checks at level 9. There are 23 selected native-verified cases. Counts and search scope are in fixtures/roof-burn-search.json. This is not an exhaustive search of arbitrary roofs, timings or spins; in particular, the introductory spike catalogue does not assert that every orientation can use its spike in every roof.

Each case is replayed with native gravity and rotations. Teaching motion follows the verified frame sequence; clean playback is independently routed by the course player. Native clear timing and collapsed boards are checked, along with tracked original-hole coordinates, JSON round trips and interactive practice.

## Reproduce

    node tools/generate-roof-burns.cjs
    node tools/build-roof-burn-lessons.cjs
    node tests/roof-burns.test.cjs

Each situation lives in its own situations/roof-burn-*.js file. Generator audit data is in fixtures/, temporary search plans in .work/. No server, dependency installation or remote font is needed.


## X-y scan revision, 2026-11-04

The introduction starts with a complete row-slice atlas, then the vertical eye, horizontal eye, a better/worse L comparison, and the upper-row Z-flat spin. The original 23 cases remain in a closed More examples section. Five new individual situation files use the roof-burn-scan- prefix, bringing the total to 28.

The atlas counts rows upward from the piece's lowest mino: gray 1, orange 2, green 3, red 4. These are relative row indices, not clear counts. There are 47 occupied-row slices over 19 unique orientations: 34 straight-drop geometries, one rotation-only geometry (horizontal Z, row 2), and 12 blocked geometries. Horizontal S cannot perform that mirrored upper-row spin in the native GB rotation matrix. Lu/Ju/Tu cannot complete their top spike row; their lower backbone row can be used.

For each slice, the audit fills the roof row everywhere except the intended piece's cells. It searches all legal horizontal alignments using left, right, down and both native rotations. There are no other stack obstacles. The search allows arbitrary input time and does not lock at a floor, so it is more permissive than timed play. Failure here rules out a one-piece placement into that completed roof without wall kicks. Adding stack cannot provide a missing geometric path. Positive atlas entries only establish geometry, not level-specific timing or support. Witness input paths are retained in js/roof-scan-data.js.

The five new actual stacks separately pass timed level-9 replay with support, grounded final positions, no pre-completed rows, even mino counts, native line clears, clean playback and hole-opening checks. They are a J skim from columns 1/2 that opens column 4, downward L and J alternatives on one three-wide trough, a downward T on a different fitting trough, and the Z-flat spin. They all finish without covered holes and preserve the right corner height rule.

The L comparison uses the exact same starting stack and same orientation. The good placement clears one roof row and opens the pocket; the worse placement one column farther right lands higher, clears zero rows and creates additional covered empty cells. Both routes are native-reachable. A proposed opposite-T comparison was rejected because it was not grounded at the intended roof height.

Rebuild the supplement with node tools/build-roof-scan.cjs. This writes only its five situations, its generated audit module, and idempotent script/library registrations. Run node tests/roof-burns.test.cjs afterward. It does not regenerate or replace the original 23 examples.

General reading informed the scan explanation: https://www.tetrisconcept.com/2015/02/downstacking.html and https://www.tetrisconcept.com/2015/02/skimming.html. The x-y scan / vertical eye / horizontal eye terminology and GB-specific tactical interpretation are the course author's. None of the web diagrams are imported as GB solutions; all illustrated routes are checked locally against this project's ROM-derived rules.


## Additional row-pattern examples

Six examples immediately below the row atlas follow the author's Excel sketches: a vertical L clearing separated roof rows, an upward T using its backbone, a downward T opening side pockets, a vertical I clearing separated roof rows, Lu123 and Tu123. The last two share the same three-wide opening over a four-deep column-1 Tetris well, which survives their clear. There are now 34 verified roof-burn situations in total. The extra six keys are retained as surfaceCases in the generated scan data.

The atlas has no extra supporting row below row 1. Cards keep their content widths and stretch to equal heights within each flex row. Blocked labels retain their row colors and use a strike-through.


## Practice and play-only examples

The row legend is removed. The atlas now uses blue, amber, teal and magenta overlays and matching text. The six From row patterns cards are titled Example 1 through Example 6. Every Try it yourself action opens a play-only modal at native level 6, with the existing controller geometry and current customized keyboard mappings.

The comparison now uses Ld456 and Lu456 on the identical stack. Both clear one roof row; Lu456 leaves a covered cell in column 6 under its surviving spike. The timed native route is verified.

The separate practice page is index.html?lesson=roof-burn-practice. The Roof burns menu has the introduction and practice page; the original individual situation URLs stay compatible. Practice draws from all 34 native-verified boards in shuffled bags, with no consecutive repeats across bag boundaries. Each round shows the starting board during a full 3, 2, 1 countdown, runs at level 6, completes any line-clear animation, then shows Correct or Fail for 700 ms before the next round.

Grading accepts a placement that opens at least one surviving original buried cell and creates no new covered cells. It does not require matching the exact example footprint. Overhang-producing clears such as the Lu456 comparison fail this rule. Original holes may remain if they are not newly covered. The player may stop by navigating away or using Back to roof burns. Single-example modals wait for Try again or the close button after feedback.

js/roof-practice.js owns this session and its UI, reusing TetrisPlayable.Attempt and InputClock, native gravity, line-clear rendering, and live button mappings. Timers stop and held inputs clear when closing or leaving the page. Tests are in tests/roof-practice.test.cjs and tests/app.test.cjs.


## Dedicated x-y scan lesson and keyboard scope

The x-y scan now has its own page: index.html?lesson=xy-scan. The Roof burns menu lists Roof-burn examples, The x-y scan, and Practice roof burns. The introduction shows a side-view eye facing down and another facing right from the left. The animated examples reuse three native-verified boards: the J well skim, the Lu123/Tu123 three-wide opening, and the I clear through separated roof rows.

The vertical ray traverses columns 1 to 10 and covers the full matrix height. The horizontal ray starts above the stack and traverses its rows downward from the left. Previously found buried cells stay pink. Horizontal candidates remain yellow and show the actual fitting piece in red. Each pass runs once; each direction can be replayed separately. Reduced-motion users see the completed scan. Leaving the page stops animation. The scan pauses behind an open play modal.

Page-wide playback shortcuts now check both roof-practice ownership and whether a lesson page is visible before processing arrows or Space. The previous tests accidentally left unrelated fake dialogs visible, hiding this conflict; the new regression explicitly sets actual dialog visibility and verifies both consecutive Right inputs in the practice page and modal, while retaining normal shortcuts on the visible player.

The row atlas uses bright blue, yellow, green and red overlays with darker matching text for readability. The overlays are limited to stack minos and never cover piece minos.


## Movement-focused practice and the profile comparison

Random practice now chooses among 88 verified layouts from 35 source examples. Only three source boards retain an automatic spawn drop. The other 32 require horizontal movement; the audit checks every grounded orientation under spawn, not just the intended target, so rotating in place cannot bypass that requirement. Rotation is still needed for many intended solutions. There are 81 translated layouts for 28 sources, plus four already off-center source boards and three simple drops. Each variant retains even stack counts, actual holes opened, correct clear counts, a supported final placement, no covered holes afterward, and a timed native level-6 route.

Variant selection happens in continuous practice only. Single-example modals retain the exact stack shown on their lesson card. The ordinary GB spawn position is unchanged. Rebuild with node tools/build-roof-practice.cjs; the generated data is js/roof-practice-data.js. Both horizontal directions and different travel distances are retained where verified. Shuffled source bags prevent immediate source repeats even when the chosen offset changes.

The additional comparison reproduces the author's Jd234/Ld456 sketch: Jd234 opens all nine cells of a cavity in columns 5 through 7; Ld456 clears the same roof but opens only column 7, leaving six cells under an overhang in columns 5 and 6. Both placements have native level-6 routes. The J version is a separate situation and joins the practice pool.

Eye scans wait for their canvases to enter the viewport and pause while out of view, rather than finishing while the introduction is being read. Observer callbacks are disconnected on navigation. A manual replay can animate even when the OS requests reduced motion; the initial automatic view still respects that preference. The eye asset now has thick uniform lids and a bold front-facing iris, matching the side-view reference at small sizes. Asset versions are refreshed to avoid cached lesson data or animation code masking the changes.


## Horizontal opportunities and all matching pieces

The horizontal eye now searches every grounded placement of all seven pieces using the GB rotation matrix. A candidate must complete a native clear, open a surviving buried cell without introducing another covered cell, and have a timed level-6 route from the actual spawn. All shown piece/orientation alternatives are retained, not just the authored solution. Results are cached per example board.

A detected row is labeled by its contiguous missing span, from 1-wide through 4-wide. This is the opening's width, not the piece's overall width. The option list appears as the ray reaches that row, uses ROM-mino thumbnails and orientation notation, and lets the learner select a piece to preview. Try this piece launches the selected type and placement in the level-6 play-only modal. The initial gap remains empty and highlighted until an option is selected. The list's space is reserved while scanning so the boards stay still as results appear.

Five selectable stacks demonstrate all four widths and a pair of separated roof rows. Their verified options are: 1-wide, Ld/Jd/vertical I/vertical Z/vertical S/Td/Tl/Tr; 2-wide, Jl and horizontal S; 3-wide, Lu and Tu; 4-wide, horizontal I; separated 1-wide roof rows, vertical I completing both. These lists apply to those exact surfaces and survivors. They are not universal width-to-piece rules.

Tests enumerate the complete geometric candidate set and independently replay every displayed solution, check no verified alternatives are omitted, and verify that selecting J actually starts J rather than the original example's L.


Only cleared rows that actually covered an opened original hole are labeled roof opportunities. A lower floor row may clear in the same placement, but is not labeled as another roof. The two-row I example therefore shows one 1-wide roof opportunity and notes that the I clears two rows.


## Animated placement comparison and roof-access ratings

After the horizontal ray finishes, the animation cycles through every reachable piece/orientation that completes the covering row. It now includes poor fits that create a new overhang, rather than filtering them out of the lesson. Each example shows the placement for 700 ms, the complete native line-clear animation, then the resulting board and rating for 1100 ms. After all placements have been shown, the last result remains visible and all rated options stay available.

Good means the placement opens covered space and leaves no buried cells. Meh means it opens some space without creating a new covered cell, but some of the original cavity remains covered. Bad means a new covered cell is introduced or the clear does not open the covered space. These are explicit roof-access ratings, not a universal AI ranking. Green marks reopened cells, amber remaining old covered cells, and red new covered cells.

The additional Compare the survivors board contains Good, Meh and Bad outcomes. Selecting an option replays that placement, clear and verdict once and holds its result for inspection. Replay horizontal scan restarts the ray and the entire tour. Both automatic and selected sequences pause when offscreen or behind a play modal, and the initial reduced-motion view shows the final result while explicit replay remains animated. Status space and the rating badge are reserved so the playfield does not jump between phases.

Every displayed placement has a native level-6 route, including those rated Bad. Tests verify the complete tour visits each placement exactly once, never truncates a line clear, and assigns ratings from actual surviving covered-cell coordinates.


## Clean starts, delayed burns, reachable overhangs and Good ranks

An unplayed scan now renders only the ROM board and walls: no ray, hole tint, piece, verdict or stage eye. Highlights begin on the first advancing animation frame. With reduced motion, the initial board remains clean until Replay is requested.

The candidate search includes native-reachable partial fills of each roof opening. A placement that needs another piece before the roof clears is a delayed burn and is always Bad in this comparison. It has a no-clear hold phase rather than a fabricated line-clear animation. Repeated delayed alignments of the same piece/orientation use one representative per opening, favoring a fuller partial fit and fewer newly covered cells. Every fitting piece orientation is retained.

A new covered cell is not automatically Bad. Empty-space flood connectivity first rules out sealed cells. For the others, the audit searches real GB placements of all seven pieces from spawn and verifies a level-6 route that enters each cell. If the new overhang remains reachable, the result is Meh. A new cell without a verified entry is Bad. Partial openings of the old cavity remain Meh. This is a direct-fill accessibility check; it does not promise a complete multistep recovery sequence.

Good placements have no buried cells left and are ranked densely as Good #1, Good #2, and so on. The ordering is lexicographic: accommodation coverage, total clean placements, fewer dependencies, lower jaggedness, then lower maximum height. Equal results share a rank. This makes accommodation dominant without adding an arbitrary weighted score. The ranks and raw accommodation counts appear in the animated explanation and option labels.

The Try this piece modal uses the same accessible-overhang criterion for these lesson-generated examples, so a Meh recovery is not incorrectly rejected as a sealed hole. The random roof-practice mode retains its existing stricter default grading. Delayed attempts with no roof clear still fail.

Only placements whose occupied columns span the complete roof-opening width are included. Touching part of a wider gap no longer qualifies. Delayed burns remain when their footprint spans that width. Both the animation and each option list run from Good to Meh to Bad, ordered within each rating by resulting-stack quality with accommodation first.

The x-y scan includes a replayable protection example. The board has a two-wide recess in columns 4 and 5. O45 is its natural surface fit, but is rejected because it adds weight above the column-4 hole, then a native level-6 route places O89 to the right. Columns 1 and 2 stay free for J12. Its native route and resulting roof clear are checked after the O placement. The animation shares visibility pausing, clean initial state and reduced-motion behavior with the scan boards.

The horizontal-eye lesson now replaces the roof-clear tour and separate protection card with a single placement scan on the same board as the vertical eye. Columns are red for holes within three rows of their local surface, orange for deeper holes, and green for none. The animation scans, rejects O45 above the shallow hole, and follows a native level-6 route to the best green O placement. Candidates must introduce no covered cells and preserve the J12 entry; resulting accommodation determines their rank. The demonstration includes a second, deeper hole in column 6.

Correction to the eye assignment: column-depth colors, rejecting O45 and moving to the best green alternative belong to the vertical eye. Its downward ray scans column by column. The horizontal eye again has the six roof-opening examples, full-width native placements, line clears, ranked Good/Meh/Bad list and Try this piece modal. There is no third protection card.

The protection stack shifts old columns 3–6 right and duplicates column 2 in column 3, giving a three-wide roof opening. O56 is the recess fit over the shallow column-5 hole; the safe O89 preserves a native T123 burn. Each hole first receives a strong outlined marker, then its column receives a light tint 300 ms later. Safe green column tints disappear when scanning ends. The rejected default blinks, then the selected alternative appears directly in place; there is no gravity segment.

Column 2 is now one mino higher than column 3 in the protection example, so O23 no longer accommodates. The extra support also makes the preserved three-wide T entry a delayed roof setup rather than an immediate clear; the animation states this explicitly.

The rejected O56 now has a Default label above it, struck through before the safe O appears. After the alternative, the native-verified recovery is I1 (single), J123 (single, opens the shallow hole), then Z67 (double, opens the deeper hole). Native clear timing is shown for each; I1 alone is not falsely described as opening both holes. The final board has no covered holes.

The vertical-eye example now ends after one I1 rooftop burn. J123 and Z67 follow-ups are removed. Its final caption describes the removed roof row above the deeper hole, without claiming both holes are fully opened.

Columns 2 and 3 are swapped in the current protection board. The sole recovery piece is now Jr12, natively reachable at level 6 after O89. It clears rows 14 and 16 and opens the shallow column-5 hole. The caption retains the remaining deeper-hole caveat. This replaces the prior I1 example.

The latest board applies the requested column-1-up shift followed by a one-row downward shift of the whole 18-row matrix. Column 1 was empty before placement, so its shift is visually neutral. The previous bottom row falls outside the matrix, removing that deeper hole. O56 and the selected O89 both move one row down; Jr12 now clears rows 15 and 17 and opens the remaining column-5 hole.

Correction: the requested first shift applies to the bottom row, not column 1. The bottom row is moved up into the row above, then the entire stack is lowered one row. Its column-7 hole therefore remains in the matrix. Jr12 clears row 15 and opens the shallow column-5 hole; the deeper column-7 hole remains. This supersedes the previous column-1 interpretation.

The lower column-7 hole is orange (the explicit red cutoff is now two rows below the local surface). After Jr12, the demonstration adds native-reachable Z56, which clears a single, then I7. On this exact board I7 lands above the remaining roof and clears no line; it is held without a fabricated clear. The final caption states that the lower hole remains covered.

Lu123 is inserted between Z56 and I7. Native level-6 verification finds Lu123 at y=15, clearing row 16 and opening the deeper hole. I7 can then descend to y=14 and clear row 17. The final sequence Jr12 → Z56 → Lu123 → I7 takes four singles and leaves no covered holes.

The last placement is now Ll67 instead of I7. Its native level-6 route reaches x=5, y=15, orientation 1, clears row 17 and leaves no covered holes.
