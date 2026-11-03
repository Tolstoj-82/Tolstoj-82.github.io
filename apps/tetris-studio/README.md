# Game Boy Tetris course

Open **index.html** directly in a browser. No server, build step or package installation is required.

## Project layout

- **js/**, game rules, ROM graphics data, lessons, playback and UI.
- **situations/**, one authored situation per file; js/situations.js lists the library order.
- **assets/css/**, page styles.
- **assets/fonts/**, locally bundled Outfit variable font and its SIL Open Font License. No remote fonts or proprietary font names are used by the UI.
- **downloads/**, printable overviews, ZIP bundles and card images. See downloads/README.md.
- **tests/**, rule, lesson, playback and simulated DOM checks.
- **fixtures/**, independent ROM vectors, source-chart references and generation audits.
- **tools/**, extraction, audit, export generation and test commands. See tools/README.md.
- **.work/**, reproducible export manifests and temporary data; never loaded by the app.
- **.restore-points/**, historical backups and preserved files from cleanups.
- **docs/**, ROM asset provenance, native rotations, free play/RNG and stack-quality notes.

## Free-play placement hints

Enable Placement hint before starting, or toggle Hint beside Restart. The local advisor uses GB-native route checks, current/next search and weighted future-piece scenarios; it recommends moves rather than guaranteeing optimal play. See docs/FREE-PLAY.md and docs/STACKRABBIT-COMPARISON.md for its model and limits.

Rewind practice retries the same piece with a VHS-style rewind when its landing differs from the advisor recommendation. Enable it in the Free play setup section and choose 1–10 correct repeats after a mistake; Hint remains independently optional.

Placements are recorded quietly during each game. After Game over, choose Analyze mistakes to review recommendations and create puzzle collections. Analysis is not run during ordinary gameplay.

## Checks

With Node.js installed, run from this folder:

    node tools/test.cjs

Run one suite with, for example, node tests/openers.test.cjs. No dependencies need installing. The UI checks use a simulated DOM; they do not replace visual checks in a browser.

## Authoring situations

Edit the situation object in its file in situations/. Keep its unique registration key and wrapper. Rows contain ten cells; shorter stacks align to the bottom of the 18-row playfield. A dot is empty, S is a stack mino, s marks a motif mino, $ marks a mandatory motif mino, and a comma marks counter-motif space. Each frame can define an active piece, inputs, caption and timing.

For a new file, add its key to js/situations.js and its classic script tag to index.html before js/situations.js. Classic scripts are intentional: the course works from file URLs without fetch or a server. The stack editor downloads changes rather than writing to the source files. Situation data is never saved to browser storage; the selected speed preference is.

## Fonts and assets

Outfit is bundled under the SIL Open Font License 1.1; see assets/fonts/OFL.txt. The Game Boy graphics and pixel lettering are decoded ROM assets; their provenance is documented in docs/ASSETS.md. Font licensing does not change the provenance of those game graphics.

## ROM tools

Verification tools accept your ROM path explicitly rather than assuming a particular Desktop folder:

    python tools/verify-native-turns.py "path/to/Tetris.gb"
    python tools/verify-rom-rng.py "path/to/Tetris.gb"

They write vectors to fixtures/ by default; --output selects another file. Graphics extraction uses python tools/extract_rom_assets.py "path/to/Tetris.gb" and updates js/rom-assets.js. The ROM itself is not included.

Timed puzzle collections can be created from kept mistakes after free play and opened through Concepts > Puzzles. Individual progress retires a puzzle at 5. Collection JSON downloads preserve both the puzzles and their progress without a server or local-storage boards.

Basics > Limits (index.html?lesson=limits) demonstrates fixed-orientation lateral reach, tapping/DAS timing and a traversable stack profile. Its default is level 9 at 10 Hz, with K/L/M presets at 12 and 15 Hz. See docs/LIMITS.md for the model assumptions and native replay checks.

Limits now has an introduction and a pole-vault/somersault atlas with native input steps, 4x4 matrices and pivots. See docs/MANOEUVRES.md for scope, verified counts and reproducible search instructions.

## GB Interceptor capture

Free play now has a Source selector. Choose GB Interceptor and Connect to read a local single-player A-Type video feed. Play on the Game Boy; optional placement hints and mistake collection use the verified captured board, current piece and next piece. No WebSocket or server is involved. See [capture setup and limits](docs/INTERCEPTOR.md).

## Autoplay

In Free play with Source: Play here, enable Autoplay before Start or use the in-game Autoplay switch. It follows verified advisor routes with native gravity and line-clear animation. Switch it off to take over immediately. See [autoplay behavior](docs/AUTOPLAY.md).
