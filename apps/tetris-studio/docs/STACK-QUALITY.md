# Stack quality for generated lessons

This is a configurable teaching policy, not a universal measure of optimal Tetris play. A surface should give the student options after the prescribed placement. Being hole-free is necessary for these beginner drills, but not sufficient.

## Measures

| Measure | Definition and use |
| --- | --- |
| Jaggedness | Sum of absolute adjacent column-height differences, plus the largest step. A moderate mixed surface can be better than a flat surface. |
| Accommodation | Enumerate clean, supported straight drops for every original Game Boy orientation. Record counts per piece and orientation, the number of piece types accommodated, and missing types. No SRS kicks, hold, or bag assumptions. |
| Parity | Record occupied checkerboard imbalance and alternating-column imbalance. Checkerboard imbalance is a small score penalty. Neither parity value is a standalone rejection rule. Recompute after native line clears. |
| Slope | Least-squares height change per column; record its sign, magnitude and residual roughness. Steep global slope and uneven residuals reduce the score. No fixed left/right preference is imposed. |
| Separation | Surface regions separated by height jumps of three or more. This is a surface-connectivity proxy, not a count of disconnected solid minos. |
| Holes | Empty cells below an occupied cell in the same column. Also count burial depth as the number of occupied cells above each hole. |
| Overhangs | Occupied cells directly above an empty cell, excluding the floor. This roof count is a local proxy for overhangs; it overlaps with the hole measure. |
| Dependencies | Find one- to three-column depressions at least two cells deep. Enumerate which pieces can cleanly reach their bottom. Flag pockets with at most two resolver types, and separately identify single-piece pockets. This does not prove that a particular piece is globally forced. |

Only an explicitly declared, completely empty edge well (column 1 or 10) is exempt from surface roughness and pocket penalties. Holes are never exempt. Covering that well is rejected. We do not silently forgive arbitrary internal wells or infer exemptions from an awkward board.

## Current notation policy

- Analyze the initial stack, after the current placement, and after the next placement if present. Apply actual Game Boy line clears before judging the next stack.
- Every target must be a grounded, supported straight drop. Native movement-path tests independently verify reachability.
- No holes or roofs at any stage; maximum height 9, jaggedness 14, and adjacent step 2. At least five piece types must fit initially and between the two placements.
- The final stack must accommodate all seven pieces, contain no constrained depression, and score at least 80/100.
- Bounded continuation check: for each possible incoming piece, examine the three clean placements with lowest resulting roughness. At least one examined continuation must retain clean drops for six of the seven possible subsequent pieces. This is a two-piece robustness heuristic, not an exhaustive search or guarantee for all future sequences.
- Keep individual metrics and stage-by-stage reports even when a candidate is rejected. A good weighted score cannot cancel a hard rejection.

Weights and limits are explicit in stack-quality.js (WEIGHTS and PROFILES). They are course-specific starting values and have not been statistically calibrated against player outcomes. Changing them requires regenerating and retesting the practice bank. A good surface should retain S/Z steps and not merely minimize height variation.

## Generation and tracking

stack-generator.js varies the surrounding skyline while preserving the requested piece columns and orientations. It checks candidates before saving them, ranks survivors, runs the continuation check, and refuses to return an unchecked fallback. Random play selects from the approved bank, avoiding runtime search delays. There are three approved contexts for each of the 23 practice templates, plus approved lesson illustrations.

Run node ../tools/generate-notation-bank.cjs to rebuild notation-bank.js and notation-quality-audit.json from the recorded seed. The bank holds the starting metrics and metrics after each piece. The audit records rejected reasons and search counts. Run node tests/stack-quality.test.cjs and node tests/notation.test.cjs afterward.

Settings → Stack quality tracks the locked stack, excluding the falling piece, during playback and play. It updates when the board changes. Selected authored tactical lessons are measured but are not silently rewritten or filtered: a spin/tuck exercise can intentionally contain an overhang. Random notation drills and their illustrations use the strict policy above.

## Basis and limits

[Thiery and Scherrer, Building Controllers for Tetris (2009)](https://journals.sagepub.com/doi/10.3233/ICG-2009-32102) reviews feature-based evaluation and warns that implementation details affect comparisons. It supports using a combination of features rather than treating a single number as universally correct.

[Tetris Concept, Upstacking](https://www.tetrisconcept.com/2015/02/upstacking.html) discusses maintaining landing choices, S/Z opportunities, connected surfaces, and piece dependencies. These teaching ideas motivate the accommodation and dependency checks. Our exact formulas, weights, thresholds and search bounds are implementation choices.

This evaluator models clean geometric drops. It does not certify a route at every gravity level, DAS timing, drought survival, all tuck/spin continuations, or long-term optimality. The original ROM geometry, line-clear routine and gameplay controls remain authoritative for play.

## Normalized visual bars

The bars are reference-based 0–100 indicators, not probabilities or a statistical guarantee of good play. Higher values point toward the favourable reference. Accommodation is the exact percentage of seven piece types with at least one clean landing. The remaining bars use clamp(100 × (1 − burden/reference), 0, 100). References are jaggedness 14 height steps, absolute checkerboard imbalance 8 minos, absolute slope 1 mino per column, three separating surface cuts, four holes, four roof cells, and three constrained pockets. Raw values remain in Settings and in each bar’s tooltip/accessibility description. Parity and slope remain contextual diagnostics. A 75% hole bar still means one hole, which fails the beginner generator’s zero-hole rule. These display scales do not modify generation scores or thresholds.

## Right-edge rule for healthy teaching stacks

Healthy-stack acceptance requires column 10 to be at least as high as column 9, on the starting board and after every placement. This is a course authoring rule checked alongside holes, support, accommodation and continuation; a high numeric score cannot override it. Accommodation examples and generated notation surfaces use this gate. Tactical setups in other chapters still illustrate their authored problems and moves.

Generated teaching stacks must contain an even number of occupied minos, before and after every placement. This is a separate invariant from checkerboard or column-balance parity: adding four minos and clearing ten per row preserve an even total. Odd candidates are rejected, rather than patched after validation.
