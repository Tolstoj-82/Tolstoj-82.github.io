# Best accommodation surfaces

Ten columns, maximum height 0 through 4. Every height from zero through the maximum must appear. Columns are solid, so there are no holes; a zero column prevents a completed starting row. All profiles are counted, but only even-mino surfaces are eligible for display, following the existing course rule. Mirrors are enumerated separately and represented once in the displayed shortlist.

| Maximum height | Qualifying profiles | Even-mino profiles | Best pieces | Best orientations | Immediate ties | Final winners |
|---|---:|---:|---:|---:|---:|---:|
| 0 | 1 | 1 | 5/7 | 8/19 | 1 | 1 |
| 1 | 1022 | 510 | 7/7 | 17/19 | 20 | 2 |
| 2 | 55980 | 27480 | 7/7 | 18/19 | 32 | 2 |
| 3 | 818520 | 410280 | 7/7 | 18/19 | 24 | 2 |
| 4 | 5103000 | 2577960 | 7/7 | 17/19 | 388 | 2 |

## Ranking

1. Number of distinct piece types accommodated.
2. Number of distinct native orientations accommodated (19 in total). Repeated positions of one orientation do not count again.
3. For every tied profile, evaluate every clean first placement and apply its line clears. For each first-piece type retain the option with maximum next-piece coverage, then orientation coverage.
4. Compare worst next-piece coverage, total next-piece coverage, worst next-orientation coverage, then total next-orientation coverage. Equal vectors remain tied. Missing first-piece types receive zero follow-up coverage.

No arbitrary combined score is used. Starting height constraints do not apply to the follow-up board. Line clears after a legal first placement are allowed and applied. No designated well, parity score, slope score, hole-repair moves or future-piece probabilities are included. These are geometric accommodation winners, rather than universal best-play recommendations.

## First-ranked representatives

Height 0: `0 0 0 0 0 0 0 0 0 0`. At least 0/7 next-piece types and 0/19 next orientations after choosing the best first placement for each piece type.

Height 1: `1 0 1 1 0 0 0 0 0 1`. At least 7/7 next-piece types and 16/19 next orientations after choosing the best first placement for each piece type.

Height 2: `2 0 0 1 1 0 0 0 0 2`. At least 7/7 next-piece types and 15/19 next orientations after choosing the best first placement for each piece type.

Height 3: `2 1 1 0 1 1 1 1 3 1`. At least 7/7 next-piece types and 15/19 next orientations after choosing the best first placement for each piece type.

Height 4: `4 3 1 1 1 0 1 1 2 4`. At least 7/7 next-piece types and 16/19 next orientations after choosing the best first placement for each piece type.

## Reproduce and inspect

Run `node tools/rank-surfaces.cjs` from tetris-studio. The tool enumerates 10,874,275 raw profiles, filters all required height values, then ranks every profile in the best immediate tier. It writes `js/surface-ranking-data.js` and `downloads/best-accommodation-surfaces.json`. The download contains all first-place winners and up to twelve mirror-distinct profiles per height from that tier.

Open `index.html?lesson=best-accommodation-surfaces` for the course view. No server is needed. Tests compare the height-profile scorer against the independent board-based analyzer, verify enumeration counts by inclusion-exclusion, replay placements through native planning, and exercise the course page.

## Intermediate heights optional

The course page now has a second mode. Only height 0 and the selected maximum are mandatory; intermediate values may be absent. Solid columns, no completed starting row, even-mino eligibility and the ranking method remain unchanged. The original mode and results are retained. The generator runs both searches and the JSON download contains both datasets.

| Maximum height | Qualifying profiles | Even-mino profiles | Best orientations | First-ranked representative |
|---|---:|---:|---:|---|
| 0 | 1 | 1 | 8/19 | 0 0 0 0 0 0 0 0 0 0 |
| 1 | 1022 | 510 | 17/19 | 1 0 1 1 0 0 0 0 0 1 |
| 2 | 57002 | 28502 | 18/19 | 2 0 0 1 1 0 0 0 0 2 |
| 3 | 931502 | 465750 | 18/19 | 2 1 1 0 1 1 1 1 3 1 |
| 4 | 7727522 | 3863762 | 18/19 | 2 4 2 1 1 0 1 1 1 1 |

Allowing missing intermediate heights raises the height-4 maximum from 17 to 18 orientations. Every nonempty height group still accommodates all seven piece types. The two mode totals overlap and must not be added as distinct profiles.
