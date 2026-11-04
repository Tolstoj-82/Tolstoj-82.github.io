# Tools

No package installation required. From the project root:

    node tools/render-adjustment-cards.cjs
    node tools/render-spin-cards.cjs
    node tools/render-spuck-cards.cjs

Each generator writes SVGs to downloads/<family>-cards/svg/ and its manifest to .work/exports/<family>-cards/render-jobs.json. Render PNGs with the shared tool:

    powershell -ExecutionPolicy Bypass -File tools/render-card-png.ps1 -JobsPath .work/exports/spin-cards/render-jobs.json

Substitute adjustment-cards or spuck-cards as needed. PNGs go to downloads/<family>-cards/png/. Generators resolve the project relative to their own location and work from other directories. Fonts and mino assets are local.

Run tests:

    node tools/test.cjs

Other tools audit ROM rules, RNG, advisor behavior and generated lessons. Historical scripts and backups belong in .restore-points/.

Stable card filenames are recorded in fixtures/card-export-names.json, so a clean checkout does not renumber existing downloads. Generated .work/ data and .restore-points/ backups are excluded from Git.

## Roof-burn catalogue

    node tools/generate-roof-burns.cjs
    node tools/build-roof-burn-lessons.cjs
    node tests/roof-burns.test.cjs

Search scope, acceptance criteria and the 23 selected examples are documented in docs/ROOF-BURNS.md.
