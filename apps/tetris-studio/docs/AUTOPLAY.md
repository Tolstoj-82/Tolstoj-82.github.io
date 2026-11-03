# Autoplay

Choose Free play, Source: Play here, then enable Autoplay. The same switch is available during a game. Switch it off to take over at the current piece position. Manual movement is ignored while it is on. Autoplay and Rewind practice are mutually exclusive; hints and mistake collection remain independent. Interceptor capture is read-only and does not offer autoplay.

The existing current/next advisor chooses a destination, then its route is verified again against native Game Boy gravity and rotations. Execution sends actual rotation and directional inputs before gravity on each native frame. It never teleports, hard-drops, changes RNG selections or skips entry and line-clear animation. Gravity follows the chosen level and heart/training mode. Controller indicators show the automated presses.

Native frames, gravity and RNG time continue while the asynchronous advisor calculates. A verified next-piece route is reused when its predicted stack matches the actual stack; otherwise a fast, verified provisional route is used. Deeper advice is adopted only after checking its reachability from the actual falling pose and respecting the existing tap cadence. A speed change or unexpected route deviation requests a new route from the actual pose. If deeper advice is unavailable, an existing verified route continues. Advice is heuristic, not guaranteed optimal. No server or new dependencies.

Placement hints require a learning-only acknowledgement (optionally remembered in local storage). A game keeps its Hints used label even if hints are later turned off. Free play records committed placement snapshots in memory without starting analysis. At game over, Analyze mistakes runs a broader asynchronous review (up to eight current alternatives, three preview variations, and two future plies). The final two committed placements are excluded; no mistake classification runs during gameplay. Progress and failures are shown in the mistake gallery. Starting a new game cancels unfinished review. This remains heuristic advice, not a proof of a unique optimal move.

Mistakes are collected only when the pre-placement stack is at most 8 rows high and the hidden rows are empty. This applies to live collection, rewind mistakes, captured games and post-game review. Post-game review first excludes the actual last two placements, then skips high-stack snapshots before analysis.

Post-game review uses a determinate progress bar counting every analysed placement, including failed analyses and non-mistakes. Gallery cards and image URLs are reused, images reserve their dimensions before loading, columns depend on viewport width rather than result count, and incoming results preserve scroll position.

Raw game histories are released when review finishes, including when no placements qualify. Review workers are stopped at completion. Starting a new game disposes the previous raw history and cancels any pending live analysis. Only collected mistake records and user-created collections remain in the session.

Puzzle collections always play at level 6. Each round shows its stack, current piece and next piece during a three-second countdown of transparent, quickly zooming digits on the playfield. Gravity and movement input begin after the countdown; changing the course speed does not alter puzzle gravity.

Puzzle collections have no time limit. Legacy collection files with seconds fields still import, with that obsolete setting ignored. A puzzle is kept out of the next fifteen deals where possible; smaller active collections choose their least recently seen entry to maximize spacing. Settled I pieces retain their exact ROM tile segments when another bar touches them and after line clears.

Identical-piece puzzles are graded by their final stack and total cleared lines, so either legal placement order is accepted. Lesson-opener exemptions also recognize valid equivalent identical-piece openings. Countdown digits zoom quickly from a point and fade fully before the next digit.
