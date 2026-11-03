# Free play and ROM RNG

Free play is available above the numbered course chapters, or through ?play=free. It uses the saved starting level and keyboard mappings, supports the on-screen controller, shows the next piece, and continues after every placement. A-type lines advance the level (capped at 20). ROM line-clear animation and collapse behavior are shared with the lessons. Scoring uses 40/100/300/1200 × (level + 1), six decimal digits, and continuous soft-drop points.

## Piece selection

The supplied Tetris v1.1 ROM has SHA1 74591cc9501af93873f9a5d3eb12da12c0723bbc. NextPiece starts at $2007; its random-selection branch is $2041–$2068. The piece-ID order is L, J, I, O, Z, S, T, encoded as multiples of four.

The selector reads DIV ($FF04), performs the original decrement/wrapping loop, and can reject its candidate twice using the bitwise OR of the current ID, old hidden-preview ID, and candidate ID. The third candidate is accepted unconditionally. DIV=0 takes the original 8-bit underflow path; it is not treated like a zero-length loop. Repeats and droughts remain possible.

The queue has a visible preview and a hidden following piece. The original three initialization calls are reproduced. New-game restart resets the visible preview while retaining the running divider and hidden state. The hardware divider is modeled at 4,194,304 T-cycles/second, with 70,224 T-cycles per gameplay frame and instruction-cycle advancement during the selector. The ROM T spawn is the raw zero-orientation sprite (spike down), rotation 0 in the course convention.

The selector was compared against 4,096 independently executed original-ROM instruction traces, covering divider phases and current/hidden combinations. fixtures/rom-rng-vectors.json contains input/output traces, not the ROM. ../tools/verify-rom-rng.py regenerates those traces from the user-supplied ROM. Its paths can be adjusted for another checkout. node tests/free-play.test.cjs verifies them.

## Accuracy boundary

The RNG algorithm, hidden queue and selector instruction timing are reproduced. The app is not a full CPU/PPU emulator: it schedules generation on simulated gameplay frames instead of executing every rendering instruction and interrupt in the complete cartridge. Consequently, the same real-cartridge input movie and power-on state are not guaranteed to produce the identical piece sequence here. Initial divider phase is randomized for normal free play; tests use explicit phases. A bag randomizer, uniform independent piece sampling, and a simple repeat ban are not used.

Source reference: [matching annotated disassembly](https://github.com/kaspermeerts/tetris/blob/master/tetris.asm), checked against the supplied ROM bytes. Full emulator equivalence would require executing the entire cartridge's timing, beyond this game's current simulation.

## Native rotations and transitions

All practice, Free play and clean playback now convert between the course’s stored orientation numbers and native ROM sprite IDs for every rotation. ROM A decrements the native orientation (clockwise); B increments it (counterclockwise). T spawns and previews with spike down. Blocked rotations are cancelled without kicks. The authored course orientation numbering is retained for existing files.

The ROM’s level check is at $244B: it advances when completed line-count decades exceed the current level, and caps at 20. Starting on level 5 therefore first transitions at 60 total lines; level 9 transitions at 100; level 19 at 200. Levels with equal gravity still retain separate level numbers. The app applies a cleared-line transition at redraw counter 16, three redraw frames before the new piece starts falling. Scoring for that clear uses the pre-transition level, as the ROM awards it earlier in the animation.

## Expected frequencies and finite-sample comparison

The chart marks the Hard Drop reference (https://harddrop.com/wiki/Tetris_(Game_Boy)#Randomizer): L approximately 10.7%; J/I/Z 13.7%; O/S/T 16.1%. The displayed markers use the more precise stationary probabilities of the ideal uniform-candidate OR-rejection model, so they sum to one despite the wiki's rounded values summing to 100.1%. This reference assumes independent uniform candidates; the cartridge's DIV-byte mapping and timing do not exactly meet that assumption.

For native IDs a,b (current and hidden preview), reject candidate c when (a|b|c)==a. With independent candidate probabilities p(c), let q be the probability of rejection in that state. The final probability of c is p(c)q² for a rejected candidate, or p(c)(1+q+q²) for an accepted candidate. Updating state to (b,c) gives a 49-state Markov chain. Solving its stationary distribution for p(c)=1/7 gives L 0.10740213324398115; J/I/Z 0.1368443749495845; O/S/T 0.16068824730242076.

Distribution overlap means 1 minus total variation: 1 − ½Σ|observed proportion − reference probability|. 95% overlap is a chosen descriptive tolerance, not 95% confidence or proof that the RNG is correct. In 12,000 seeded ideal-model sequences with the original initial queue, average overlap crosses 95% around 320–330 deals; 800 deals gave 95.7% of sequences at least 95% overlap at that sample size. A sequence may subsequently move away again. These are model-specific simulation estimates, not promises for every timing-dependent cartridge or app run.

The chart uses a shared percentage axis, at least 0–25%, expanding in 5-point increments when necessary. Expected lines and actual bars use that same axis. Colour follows a fitted large-N expected-overlap curve max(0,1−0.896/√N), raised to the fourth power for a readable red-to-green progression. It approaches green asymptotically and is a sample-maturity visual, not a test of fit. The displayed overlap is computed separately from actual counts.

The unchanged ROM selector was sampled for 300,000 deals under each of five conditions (1.5 million total): independent uniform DIV reads, varied 40–239-frame timing, and fixed 60/120/300-frame timing. Under varied timing the observed percentages, in L/J/I/O/Z/S/T order, were 10.954 / 13.696 / 14.006 / 16.251 / 13.598 / 15.689 / 15.806. Fixed cadence produced much larger deviations. Hence the law of large numbers must not be used to promise convergence to the wiki reference: the real timing-dependent process may have a different limiting distribution or periodic behavior.

Regenerate reports with node ../tools/audit-rng-distribution.cjs and node ../tools/audit-rng-convergence.cjs. Seeds, sample sizes and results are saved under fixtures/rng-*-audit.json. The production selector and its original instruction-vector tests are unchanged.

## Free-play start selector

Opening Free play shows an on-board selector. Restart immediately starts over with the same level, heart mode and randomizer settings. 0–9 are ordinary starting levels; A–K select levels 10–20. The selected letter is displayed until the first level transition; A advances to the numeric display 11, B to 12, etc. Level 20/K is capped.

Heart mode uses gravity for min(level + 10, 20), with the ordinary scoring level. L and M are standalone training levels at two and one frames per row. They ignore heart mode, never transition and disable soft drop so holding Down cannot slow or replace the faster gravity. Training line-clear scoring uses the level-20 multiplier. These two speeds extend the original ROM table for training.

## ROM-style selector and optional seeded randomizer

The starting-level selector has the original two rows of five slots, 0–9. The final slot can be adjusted from 9 through A–M using its arrows. The previously documented letter transitions, heart mode and fixed L/M training speeds still apply.

LFSR seed is off by default. When enabled it takes a non-zero six-digit hexadecimal seed (000001–FFFFFF). Each new game restarts that seed, making its sequence repeatable regardless of input timing. With the toggle off, Free play uses the original DIV/timer randomizer.

The supplied Tetris_lfsr.gb has SHA-256 23ca94634acf0320b9a0621b2678cb04591667da437fdf22061246aedb9c764c. Its routine at 0x052D shifts a 24-bit state right, feeding the parity of low-byte mask 0x87 into bit 23, and returns the updated low byte. The candidate mapping, two retries and hidden preview queue remain those of the original selector. The seed is displayed high byte first. The all-zero state disables the LFSR in that ROM; this UI uses the explicit toggle for that choice and rejects zero while enabled.

Tests compare 1,024 steps against an independent interpreter executing the supplied ROM instructions, plus repeatability across different timer cadences. Regenerate the vectors with python tools/verify-lfsr.py "path/to/Tetris_lfsr.gb" --output fixtures/lfsr-rom-vectors.json. The ROM is not bundled.

## Optional live placement hint

Enable Placement hint in the Free play start selector, or toggle Hint beside Restart during a game. It is off initially and remains a session preference only. A blue translucent ghost shows a recommended current-piece landing, considering the visible next piece. It does not move the piece or change the RNG, scoring, gravity or input handling.

### Search and strategy

The advisor in js/placement-hint.js now uses an independent Game Boy adaptation of the search structure reviewed in docs/STACKRABBIT-COMPARISON.md. It is not a port of StackRabbit, does not include its NES weights or learned surface tables, and does not claim equivalent playing strength.

The initial search explores current and next placements, including overhang entries, collapses cleared rows, and verifies native tapping routes. It retains up to two verified preview placements for each current move, then refines a diverse shortlist of up to five current moves. This prevents many preview variants of one current move from crowding out alternatives. Immediate reachable Tetrises remain the preferred action.

Evaluation balances the left Tetris well, readiness, surface steps, flat accommodation, dependencies, holes and burial, right-corner shape, height and line-clear rewards. Readiness no longer lexicographically overrides all height and surface terms. Tetris-building, digging and high-stack survival contexts change the balance: an avoidable burn is discouraged on a healthy low stack, while a useful tactical burn can be preferred when recovery is needed. These are locally calibrated heuristics, not learned surface values.

### Future-piece refinement

At ordinary speeds each shortlisted pair is evaluated using 14 common weighted scenarios, covering every possible first unknown piece and two conditional quantiles of the following piece. This extends the horizon to four pieces in total. Each future piece is placed greedily with native route verification; simple landings are checked first, with a geometric overhang search if no simple route works. Repeated rollout states are cached. The score combines expected future value, the known-pair evaluation and a bounded downside term.

At gravity below four frames per row, refinement uses up to four current moves and seven weighted scenarios for one extra future piece. This reduces work at the fastest levels without removing the known-next search or route checks. The search is bounded and its route construction conservative; it does not enumerate every legal input sequence or prove optimality.

The forecast is an explicit approximation: independent uniform candidates passed through the Game Boy selector's two-retry OR-rejection rule. The first unknown piece has exact conditional probabilities under that model; the second is approximated by two quantiles per branch. It is neither a bag nor an NES randomizer, and it does not assume the wiki's long-run percentages are independent draws. Tests enumerate all 343 three-candidate combinations for each of 49 current/next states through RomRandom to check those model probabilities. The real timer-driven process need not follow the model exactly.

The advisor sees the stack, current piece, visible next piece, level and timing. It never reads the actual hidden queue, LFSR seed or future RNG state. Simulated scenarios are common to all compared candidates and deterministic, so lucky private draws do not decide which candidate wins.

### Reachability, runtime and validation

Every accepted current and next landing has a tapping route with at least five native frames between presses and uninterrupted gravity. Preview and rollout verification accounts for level transitions and heart/training speeds. The live ghost is checked again from the actual falling position and phase, so a stale or unreachable target is hidden. No hint is not proof of game over: the bounded search or conservative route builder may have missed an alternative.

The same engine runs in a Blob worker without a server or imported worker files. A cooperative fallback yields between candidates and scenario evaluations. Leaving, restarting or switching hints off cancels the search and rejects stale results. Search duration depends on the device and stack; development checks measured roughly 100–230 ms for selected empty-board searches, with a cold initial search sometimes slower. Gameplay is not paused to wait for a result.

Run node tests/placement-hint.test.cjs for native replay at five speeds, authored tucks and spins, Tetris setup, recovery burns, beam diversity and forecast-model checks. The simulated DOM suite covers the optional ghost, cancellation and server-free fallback. Run node tools/audit-placement-hint.cjs for the same three local 60-piece stress cases used before the changes. The original results are preserved in fixtures/placement-hint-strategy-baseline.json and new results in fixtures/placement-hint-strategy-audit.json. This is a local before/after diagnostic, not a head-to-head StackRabbit benchmark or a statistical strength estimate.

### Game Boy headroom and ghost rendering

Hint minos use the original ROM texture with all four shades remapped to blue, including their outlines. The I hint uses a single blue bounding rectangle instead of individual mino textures or internal dividers. Ghosts remain translucent and do not paint over the active piece. Active and locked minos keep their ordinary graphics.

The strategy now derives its spawn band from all seven actual GB spawn footprints. Most pieces occupy visible rows 1 and 2, leaving only 15 unobstructed downward moves on an empty board. Candidate evaluation measures remaining clearance under those footprints, penalizes blocked spawns and low manoeuvring room, and also penalizes tall side towers. It targets lower average height and enters recovery earlier. The normal soft safety height is 9; faster gravity reserves more movement room, lowering it to 8 or 7. These are advisory safety heuristics, not changes to ROM gravity, spawning or lock rules. Tetris-ready stacks still receive their bonus, balanced against remaining room.

## Optional rewind practice

Enable Rewind practice in its grouped section in the Free play start selector. It is off initially and stays a session-only preference. Turning it on during a piece brings that piece back to its spawn position. The Hint toggle independently controls whether the fixed target is shown as a ghost. Show target during rewind controls its visibility while rewinding.

For each piece, practice briefly waits at spawn while the advisor finds a recommendation for the unchanged stack and visible next piece. That target stays fixed until the piece is placed correctly. Moving to a weaker position cannot replace it with an easier recommendation. Matching uses the occupied cells, allowing equivalent piece representations rather than relying only on orientation numbers.

A rejected landing is intercepted before the stack, score, line count, level or piece counters change. A 950 ms VHS-style rewind then plays the piece's recorded movement and rotations backward, with tracking streaks and a rewind label. Inputs and gravity are blocked during analysis and rewind. On retry, the same piece, stack, next preview, level, score, counters, timing and RNG state are restored at spawn. Repeated mistakes repeat that same target; they do not deal another piece or consume the seed. Existing locked I textures are preserved as part of the checkpoint.

On a matching landing, ordinary scoring and line-clear animation proceed. A new target is requested only when the next piece spawns, after any line clear. The retry effect is a practice feature, not a change to Game Boy lock rules in normal free play. The advisor remains heuristic: correct here means matching its recommendation, not proof of a globally optimal move. If it cannot verify a target, practice clearly marks that piece as unchecked rather than inventing a goal or freezing indefinitely.

Disabling practice, restarting or leaving cancels pending analysis and the rewind. Disabling during the effect restores the spawn checkpoint before returning control. Settings and the existing pause behaviour pause the effect; resuming continues it. Reduced-motion settings disable the extra screen jitter while retaining backward piece movement.

Run node tests/placement-practice.test.cjs for checkpoint/RNG restoration, repeated attempts, accepted and rejected clears, stale results and cancellation. Simulated DOM checks exercise the opt-in controls, analysis wait and VHS feedback. These do not replace visual inspection in a browser.

### Rewind settings and repetition drills

The Rewind practice section groups its toggle, Correct repeats (every integer from 1 through 10), and Show target during rewind. Its fields are disabled while practice is off. The rewind-only target is on by default and independent of the normal Hint toggle. Only missed placements receive the successful-repeat quota; a correct first attempt advances normally. Reopening Free play allows the quota to be changed without discarding previously earned successes.

The repeat quota applies only after a mistake. With 3 selected, the player must then make three successful placements of that same piece before moving on; a clean first try still advances immediately. Wrong attempts do not count and do not erase already earned successes. Intermediate correct landings display Correct with progress and rewind for another repetition. They do not modify the stack, score, lines, level, dealt counts or RNG. Only the final success commits, with ordinary line-clear animation and scoring once. A live quota change is checked at the next correct landing and retains earned progress. The default is 3 correct repeats after a mistake. Incorrect attempts briefly tint the board red. Successful retries after a mistake briefly tint it green; correct first attempts do not flash green.

## Post-game mistake analysis

Placements are recorded quietly during each game. After Game over, choose Analyze mistakes (the dark navy magnifier button). Analysis starts only then; no collection toggle or live analysis is needed. This works for simulated play and verified Interceptor placements. Reopening a running analysis shows its existing progress instead of starting over.

Each image has two boards: the original stack with current and next pieces, and the recommended placements. Current is red and next is green. The solution board accounts for completed rows before placing the next piece. Both placements are labelled in stack notation, including column 10 as 0 and direction letters as subscripts. The diagrams retain original ROM mino and wall textures.

The post-game review uses the recorded stack, current and next pieces, level and actual landing. Rewind failures are retained as raw records for later review, without running mistake analysis during play. Repeated identical mistakes are grouped with an attempt count.

The gallery provides local PNG and SVG downloads for each case. Keep checkboxes select entries for puzzle collections. Images include the bundled Outfit font; the SVG is self-contained and embeds seamless ROM-textured PNG boards. The image-font.js asset is generated from assets/fonts/Outfit-Variable.ttf under the same SIL Open Font License. PNG export rasterizes that local SVG in the browser, without a network service. Images are generated on review/download, not on the gameplay frame.

The collection is held in memory for this page session, across game restarts and course navigation. It does not write situations or use browser storage. Download images before reloading if you want to keep them. Clear collection discards entries and queued analysis; it does not affect the active stack. Starting a new game releases the previous game history.

The placement-search overlay has been removed. Rewind practice still briefly waits at spawn for its fixed target when needed, with a quiet status outside the playfield; the VHS rewind and repeat overlays remain. Post-game review does not add a gameplay wait.

Run node tests/mistake-journal.test.cjs for exact snapshots, deduplication, current/next image structure, embedded asset references and post-clear next boards. The simulated DOM suite covers post-game-only analysis, the gallery, SVG downloads and puzzle creation. PNG export uses standard browser image/canvas APIs and is not visually verified by the simulated DOM.

Mistake cards contain two diagrams: the original stack with current and next pieces, and the recommended placements. Cards can be kept for puzzles or deleted individually after confirmation. Authored opener placements (including their second pieces) are accepted in collection and rewind practice. Image backgrounds are opaque and pixel edges use crisp rendering.

Mistake diagrams embed one opaque PNG per board to prevent seams between independently scaled SVG tiles. The current piece remains at spawn; the next piece uses the same miniature rounded Next box as adjustments.

## Timed puzzle collections

Review mistakes after a game with Analyze mistakes, or reopen saved session entries through Collected mistakes. Keep checkboxes select entries for a named collection; the circled close button deletes one mistake after confirmation. Create collection copies the selected two-piece situations, leaving the journal intact. Entries without a verified next placement cannot become puzzles.

Puzzle collections are available from the sidebar and Concepts > Puzzles. Select a time limit of 3 to 120 seconds (20 by default). Each random exercise requires both stored placements before time runs out, using the existing gravity, mappings and touch controller. The timer is independent of soft drop. Settings and collection dialogs pause it. Line clears and entry use native timing; final feedback waits for the clear animation.

Each puzzle starts at 0. Correct adds one, incorrect or timeout subtracts one. A score of 5 marks it successful and removes it from the active pool. Feedback in a reserved column to the right of the playfield animates the score change. Incorrect attempts then show the stored recommended placements after a short pause. Correct attempts retain the player's board and continue without showing the solution. Next puzzle selects another active entry; there is no immediate repeat when multiple entries remain.

Download collection saves its original stacks, recommended placements, time limit and individual scores in JSON. Open collection restores these. Collections remain in session memory and never overwrite source situations or use local storage. Download again to preserve new progress before reloading. The experimental stack score and up/down reorder buttons have been removed.

Free-play setup uses a compact viewport-centred dialog rather than fitting its options inside the playfield. Heart, LFSR, hint, rewind and collection settings are accessible switches in a single column, with larger handles and padded hover areas. Short desktop viewports place the level grid beside that column. The seed input keeps a stable slot and is disabled until LFSR is enabled. The original 0–9 level grid and adjustable final slot are retained. Start and Cancel have a dedicated bottom row, with compact sizing for short viewports.

The heart indicator follows the level label, for example 9 ♥ or A ♥, both before and during play.

The LFSR switch, seed input and seed validation message share one bordered section. The input stays disabled until its switch is enabled.
