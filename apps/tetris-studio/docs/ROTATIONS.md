# ROM spawning and rotation verification

Source: the user-supplied Tetris JUE v1.1 cartridge, SHA1 74591cc9501af93873f9a5d3eb12da12c0723bbc.

Native sprite IDs select descriptors through $2C20. Each descriptor contains a pattern pointer and Y/X offsets. Pattern address order is not orientation order: T0/T1/T2/T3 point to $2F0B/$2F1C/$2EEC/$2EFA. Reading patterns sequentially was the source of the incorrect T spawn. The extractor now follows the actual pointers.

NextPiece at $2007 sets logical Y=$18 and X=$3F. The renderer adds descriptor offsets $EF/$F0 and propagates carry with ADC before applying each mino offset. After OAM and playfield offsets, the raw matrix origin is column 4, row 0 (one row above visible row 1). The editor removes one upper matrix row for non-I pieces. Shared spawn anchors are consequently x=3,y=0 for L/J/O/Z/S/T and x=3,y=-1 for I. All spawn in native orientation zero. T points down. Its next preview uses the same orientation.

At $24BB, A decrements the native orientation bits and B increments them. A is clockwise; B counterclockwise. L/J/T retain four physical states, I/S/Z repeat two and O repeats one. The course's public physical orientation numbers remain unchanged; core.nativeTurn converts them to native sprite IDs. Blocked turns are cancelled without shifting or kicking. Two hidden empty rows are initialized by $1FF2; these are represented in the collision model so an I can turn at spawn.

All practice and Free play use the same Attempt input implementation. Clean playback routes inputs through that implementation with uninterrupted gravity. File-authored lesson inputs were migrated to the native button directions, preserving all 257 destination records and course physical shapes. Accommodation examples enter at spawn before showing their taught orientation.

Verification: ../tools/verify-native-turns.py executes the original rotation instruction branch for all 28 native sprite IDs with A, B and both pressed. It also derives mino spawn cells through the ROM descriptor offsets and renderer coordinate table. The fixture stores extracted data, not the cartridge. Run node tests/native-model.test.cjs and node tests/rom-assets.test.cjs "path/to/Tetris.gb". These independently check spawn cells, per-mino tiles, every turn in practice and Free play, blocked turns without kicks, hidden-row I rotation, next-piece entry, and course entry poses. No browser visual QA is claimed.
