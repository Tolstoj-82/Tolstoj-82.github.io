# Placement advisor compared with StackRabbit

Reviewed 30 October 2026. This is a source-level comparison against the public master branch, not a benchmark running StackRabbit and our engine on the same boards. No StackRabbit code, trained tables, weights or NES moves have been imported into the app. Sources below are moving branch links, not a pinned upstream revision.

## Implementation following this review

The rollout-based revision replaces the rigid priority below with balanced, context-sensitive evaluation while retaining the column-1 Tetris goal and immediate Tetris preference. It adds distinct-current-move pruning, verified preview alternatives, deterministic GB future-piece scenarios, greedy multi-step rollouts and cached future states. At ordinary speeds, refinement sees two unknown future pieces; faster gravity uses one. See [the current implementation notes](FREE-PLAY.md#optional-live-placement-hint).

This applies the reviewed design ideas using independent GB-specific code. The learned surface values, exhaustive movement search and playing strength of StackRabbit have not been reproduced. The comparison table below describes the original advisor at review time and motivates the changes; it is not a description of the revised implementation.

## Before-change findings

The local advisor is a bounded two-piece heuristic with verified Game Boy routes. StackRabbit has a substantially richer evaluation and can refine candidates with future-piece playouts. Legal ghosts and passing tactical examples do not demonstrate equivalent playing strength.

Tetris readiness should remain the goal. Our current lexicographic priority is too rigid to serve as a complete strategy: after holes and well protection, readiness and missing cells in the bottom four rows outrank all height, surface and accommodation terms. A tall or dependent stack can therefore win over a healthier continuation merely because it is closer to that four-row target. This is an inference from our comparison function, supported by the local simulations below; it is not an observed StackRabbit move comparison.

## Comparison

| Area | StackRabbit source | Local Game Boy advisor | Consequence |
| --- | --- | --- | --- |
| Known pieces | Searches current and next, with native move search for each. | Searches current and next; verifies the current route before shortlisting and the selected next route afterward. | Similar two-piece starting point, different search completeness. |
| Longer horizon | Leading candidates can be ranked using accumulated rewards and future-piece playouts. | Stops after the visible next piece. | No evaluation of how a promising setup survives an I drought. |
| Surface | Uses precomputed surface ranks when enabled; fallback penalizes large height differences and dependencies, and checks for a flat spot. | Uses hand-set roughness, dependencies and seven-piece accommodation coverage. | Our accommodation count is not a learned surface value. |
| Readiness | Detects four suitable rows at the landing height of the designated well. Readiness is one factor in the normal evaluation. | Requires the whole column-1 well to be empty and checks contiguous rows from the floor. Readiness is a hard ranking tier. | The local rule is stricter and less context-sensitive, especially on dirty stacks. |
| Scoring and burns | Normal evaluation combines a Tetris reward, readiness, burn costs, holes, height and access. | Has line rewards, but the hard strategy tiers precede the weighted value. | Increasing a safety weight cannot correct an earlier ranking tier. |
| Recovery | Evaluation context selects different modes for dirty boards and limited movement access. | One fixed strategy, including on dirty or very high boards. | A purposeful recovery burn may be rejected for preserving the well. |
| Movement | Uses input timelines and gravity while exploring moves, including tuck support. | Generates geometric candidates, then checks one conservative tapping route with gravity. | Verified suggestions are legal in our engine, but some valid alternatives can be missed. |
| Shortlist diversity | Configuration explicitly limits repeated first placements in a two-piece shortlist. | Top 64 pairs can contain many different next placements for the same current placement. | Several next-piece variants can crowd out other current moves. |
| Platform | Source configuration targets a right well and NES rules. | Targets column 1 and the app's ROM-derived GB rules. | NES coefficients, surface tables, input ranges and future-piece assumptions cannot be copied unchanged. |

## Specific upstream checks

- In the checked configuration, the right well and learned surface ranks are enabled; perfect-play mode is disabled. It specifies playout defaults of 49 sequences of length two and pruning breadth 20. These are configuration defaults, not proof every API call runs those settings.
- Normal weights reward a Tetris and readiness while penalizing burns, holes, covered wells and excessive height. Some modes change these weights. Perfect-play evaluation is separate and rejects non-Tetris clears; it is not the normal configuration.
- The source's height and access terms depend on the movement context. NES level-29 and right-edge assumptions require redesign for an 18-row GB board, its gravity table and left well.

## Reproducible local evidence

Run `node tools/audit-placement-hint.cjs`. Results are stored in `fixtures/placement-hint-strategy-audit.json`.

The audit follows our chosen move for up to 60 pieces for each of three seeded sequences. Each request sees only the current and visible next piece. It uses fixed level-0 gravity and instantaneous application of the verified placement and line clears; this isolates strategy, not real-time UI latency or full-game transitions. These selected samples are regression diagnostics, not a statistical estimate of strength. The small seed 000001 produces an unusually O-heavy opening and is useful as a stress case.

The existing native replay suite remains the legality check. The audit separately records remaining holes, maximum height, line-clear sizes and whether the search stops without a verified hint. In particular, no hint is not itself proof of game over: the bounded shortlist or conservative route constructor may have missed a playable move.

## Improvements indicated by this review

1. Preserve the Tetris goal but jointly assess safe height, accommodation, access and dependency cost before preferring marginal readiness progress.
2. Group pairs by their first placement so the shortlist retains distinct current moves.
3. Add a GB-specific recovery policy for holes and high stacks, allowing necessary tactical burns.
4. Test leading current moves against possible future pieces, without inspecting the live RNG's hidden state. Sampling must use a documented GB model, not an assumed NES randomizer or falsely independent GB piece percentages.
5. Calibrate against authored positions and longer, varied deterministic simulations. Do not claim StackRabbit-level strength from the existing tactical and legality tests.

These were the findings before the requested implementation. Items 1–4 now have bounded GB-specific implementations as described above; longer calibration and the playing-strength gap remain.

## Primary sources

- [Evaluation, surface ranks, readiness and perfect-play distinction](https://github.com/GregoryCannon/StackRabbit/blob/master/src/cpp_modules/src/eval.cpp), especially rateSurface, isTetrisReady, evalForPerfectPlay and fastEval.
- [Normal and mode-specific weights](https://github.com/GregoryCannon/StackRabbit/blob/master/src/cpp_modules/src/params.hpp).
- [Evaluation context and mode selection](https://github.com/GregoryCannon/StackRabbit/blob/master/src/cpp_modules/src/eval_context.cpp).
- [Current/next search and optional playout refinement](https://github.com/GregoryCannon/StackRabbit/blob/master/src/cpp_modules/src/high_level_search.cpp).
- [Future-sequence evaluation](https://github.com/GregoryCannon/StackRabbit/blob/master/src/cpp_modules/src/playout.cpp).
- [Input and gravity move search](https://github.com/GregoryCannon/StackRabbit/blob/master/src/cpp_modules/src/move_search.cpp).
- [Checked configuration and shortlist diversity](https://github.com/GregoryCannon/StackRabbit/blob/master/src/cpp_modules/src/config.hpp).
