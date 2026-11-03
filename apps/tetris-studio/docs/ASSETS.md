# Original Tetris v1.1 assets

Source: user-supplied `Tetris (JUE) (V1.1) [!].gb`, 32768 bytes. Header title `TETRIS`, revision byte 1.

SHA-256: `0d6535aef23969c7e5af2b077acaddb4a445b3d0df7bf34c8acef07b51b015c3`.

Graphics are decoded from the source ROM, not redrawn or traced. The existing TREP lookup tables identify the source tile blocks and A-type map; extraction verifies their bytes against this ROM.

| ROM offset | Data | VRAM tile IDs |
| --- | --- | --- |
| `$415F` | 39 monochrome font tiles, 8 bytes each | `$00–$26` |
| `$4297` | 9 two-bit tiles, 16 bytes each | `$27–$2F` |
| `$323F` | 197 two-bit gameplay tiles, 16 bytes each | `$30–$F4` |
| `$3E8F` | 360 bytes, 20x18 A-type map | Original 160x144 screen |
| `$2D5A–$2F2B` | 28 terminated 4x4 piece layout records | L, J, I, O, Z, S, T; four orientations each |

For each 2bpp row, the first byte supplies bit 0 and the second supplies bit 1. Bits are read left to right, most significant first. Monochrome font bits expand to shade 0 or 3. The ROM sets BGP to `$E4` at `$023D`, an identity shade mapping. A physical LCD's colors depend on its panel and lighting; the app retains its green tint while using the original pixel values.

The well occupies columns 2–11 of the original map. The walls use the original `$7B/$7C/$7D` brick sequence in columns 1 and 12. Nothing substitutes CSS for those pixels.

| Piece | Original tile ID(s) |
| --- | --- |
| I, horizontal | `$8A $8B $8B $8F` |
| I, vertical | `$80 $88 $88 $89` |
| J | `$81` |
| Z | `$82` |
| O | `$83` |
| L | `$84` |
| T | `$85` |
| S | `$86` |
| Curtain/background | `$87` |

The game-over routine loads `$87` at ROM `$1CF8` and calls its fill routine. Piece layout records supply per-mino tile identities and positions. The app shifts one shared upper row out of non-I piece coordinates to retain useful editor anchors; it keeps the original relative mino positions and graphics.

To regenerate the asset script, run `python ../tools/extract_rom_assets.py "path/to/Tetris.gb"`. The extractor requires the exact checksum above and changes only `rom-assets.js`. Python is a development tool only and is not needed to run the app.

To verify every extracted pixel, map entry and piece record against the source, run `node tests/rom-assets.test.cjs "path/to/Tetris.gb"`. No emulator, server, runtime fetch, or external asset request is used.

## Line-clear animation

The implementation follows the supplied ROM's code at `$213E` (scan 16 rows), `$2174` (initial two-tick delay), `$21E0–$224C` (flash sequence), `$224D` (collapse), and `$229E–$24B9` (VRAM row redraw). After the initial delay, three solid/original alternations last ten ticks each per phase. Solid uses original tile `$8C`. Cleared rows then use empty tile `$2F` for thirteen ticks. The well redraws bottom to top, one row per VBlank: eighteen ticks. Total: 93 ticks at the game's native frame rate.

Sequential collapse copies and the cartridge's single top-row erase are preserved, including the duplicate-top-row behavior on multiple clears. The animation stays inside one authored timeline frame. Routine addresses and timing were inspected directly in the supplied v1.1 ROM; the [matching disassembly](https://github.com/kaspermeerts/tetris) also provides readable labels.
