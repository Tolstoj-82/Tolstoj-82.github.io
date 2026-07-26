# Tolstoj's Workbench

This repository is a static website containing several independent applications,
games, and articles.

## Repository layout

```text
/
├── index.html              Main Workbench homepage
├── script.js               Homepage behavior
├── assets/
│   ├── images/             Images shared by the homepage
│   └── styles/             Styles shared across site sections
├── apps/                   Interactive utilities and editors
├── articles/               Articles and technical write-ups
├── games/                  Browser games and game-oriented experiences
└── content/                Collections and profile pages
```

### Applications

- `apps/trep/` — Tolstoj's ROM Editor Plus
- `apps/gb-ocr/` — Game Boy OCR
- `apps/live/` — live OCR and display experiments
- `apps/luter/` — LUT editor
- `apps/music-editor/` — assembly music editor
- `apps/firmware-labeller/` — firmware relabelling utility
- `apps/post-max-counter/` — post-max counter
- `apps/genetic-engineering/` — genetic engineering utility

### Games

- `games/chris-and-triss/`
- `articles/new-to-tetris/`

### Blog

- `articles/two-player-reverse-engineering/` — link-cable protocol article
- `articles/tetris-collection/` — Tetris collection and collector's guide
- `articles/rng/` — Game Boy Tetris RNG article
- `articles/about-me/` — personal Tetris journey

### Content

- `games/rom-hacks/` — ROM patch information
- `content/martin-jakob/` — Martin Jakob pages and QR-code generator

Project-specific scripts, styles, images, and data remain inside their respective
project directories. Only assets shared by the root site belong in `assets/`.

The site is designed to be served from the repository root by any static web
server.
