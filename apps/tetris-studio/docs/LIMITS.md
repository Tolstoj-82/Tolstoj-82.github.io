# Fixed-orientation limits

One board compares both approach directions. The solid swept-path complement is lowered at both ends to match the piece bottom contour whenever it can fit before reaching the floor. Vertical I receives a four-deep well at each edge. Neither approach is obstructed: support heights never exceed the original envelope. Each supported landing is checked on the actual combined board. The two pockets are alternative destinations; this illustration does not guarantee a line clear.

Hover/focus shows red approach trails and yellow outermost arrival poses. The piece may still fall farther into its accommodation. Column 2 and 9 height labels are centered inside the top occupied mino and hidden for empty columns.

Native gravity, tapping cadence and fixed DAS ARR are unchanged. Rotation time and reaction delay are excluded.

The previous independent edge-pocket version is preserved in `.restore-points/limits-before-solid-2026-11-01`; see its README for restoration.

Hover/focus now animates both yellow endpoint pieces downward, one row at a time, to their verified landing poses. The animation runs once per hover and holds the landed pieces until leave/blur. Settings, replay and navigation cancel stale callbacks.

After both yellow pieces settle, the red approach trails fade out over 450 ms. Yellow landed pieces stay visible until hover/focus ends.
