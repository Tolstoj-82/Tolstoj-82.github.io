# GB Interceptor in Free play

Choose Free play, Source: GB Interceptor, then Connect. Browser camera permission is requested only by this action. Choose the Interceptor device in the capture panel if automatic selection chooses another camera. Reconnect, Recalibrate and Disconnect are available there. Use the physical Game Boy controls. On-screen game inputs and rewind are inactive in capture mode. Heart mode must match the cartridge; video does not identify it reliably.

No WebSockets, server, uploads, remote OCR or new dependencies. Capture uses getUserMedia and original-ROM tile templates. A complete original-aspect Game Boy feed is scaled with nearest-neighbour sampling to 160 × 144. Frame blending, custom tiles and cropped/letterboxed feeds are not supported; invalid frames hold the last verified state instead of erasing tiles.

The reader uses the playfield at tile columns 2–11, right wall at 12, next box interior at 15–18 / rows 13–16, and the original A-Type score/level/lines coordinates, as in apps/live/refactored/JS/OCR.js. Full tile templates replace the eight-pixel lookup. Four capture shades are calibrated locally. Currently single-player A-Type only.

The tracker separates the moving piece by unchanged residual stack across frames, requires a stable next box, verifies actual locks against the previous stack and native line collapse, and supports repeated piece types. Ambiguous or missed boundaries reacquire without recording mistakes. Connect mid-game requires an identifiable moving piece; start a fresh game for complete piece counts. Capture latency can reduce the time available for live hints.

Existing placement advice and mistake collections are reused. Only uniquely verified locks are queued for comparison. The hardware cannot be rewound or restarted by this page. The Reconnect button reconnects video. Reading pauses on unfamiliar screens; the real Game Boy continues while browsing settings or mistakes.

Automated tests use original ROM pixel frames and verified game transitions. Real-device capture needs validation with the user’s Interceptor feed and firmware. Browser camera APIs require a supported secure context; file URLs work in compatible desktop browsers. See https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia.

The reconstructed playfield mirrors complete recognized ROM tile frames during line flashes, the blank hold and row-by-row redraw. Those animation frames are presentation only; the logical stack and mistake tracker still wait for a verified post-clear lock. A recognized line-clear flash is not treated as an OCR failure. Unrecognized capture lasting one second adds a subtle red playfield outline, cleared on recognition recovery. Frozen video counts from the last fresh frame.
