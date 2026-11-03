// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "T: North",
  "chapter": "Clean stacking",
  "section": "Accommodation stacking",
  "description": "A fully supported straight drop that leaves a healthy, connected surface and an open left Tetris well.",
  "stack": [
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    ".S.......S",
    ".SS...SS.S",
    ".SSS.SSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 0,
    "target": {
      "type": "T",
      "rotation": 0,
      "x": 3,
      "y": 12
    },
    "surface": [
      [
        3,
        14
      ],
      [
        4,
        15
      ],
      [
        5,
        14
      ]
    ],
    "heights": [
      1,
      0,
      1
    ]
  },
  "frames": [
    {
      "step": "1",
      "ticks": 168,
      "rows": {
        "13": ".LLTTTLL.L",
        "14": ".LLLTLLLLL"
      },
      "placementHighlights": [
        {
          "type": "T",
          "rotation": 0,
          "x": 3,
          "y": 12
        }
      ],
      "placementColors": [
        "#e04444"
      ],
      "motif": {
        "cells": [
          [
            3,
            14
          ],
          [
            5,
            14
          ],
          [
            4,
            15
          ]
        ],
        "color": "#e7a52b"
      },
      "highlight": false,
      "showNext": false,
      "caption": "Match the piece to the supporting minos below it. The resulting stack keeps clean placements available for all seven pieces."
    },
    {
      "step": "2",
      "ticks": 2,
      "rows": {
        "13": ".LL...LL.L",
        "14": ".LLL.LLLLL"
      },
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "showNext": false,
      "highlight": false,
      "caption": ""
    },
    {
      "step": "3",
      "ticks": 112,
      "active": {
        "type": "T",
        "rotation": 0,
        "x": 3,
        "y": 12
      },
      "animate": true,
      "fallFirst": 12,
      "animationFrom": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "buttons": [],
      "highlight": false,
      "showNext": false,
      "caption": ""
    }
  ],
  "qualityWell": 0
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-t-north"]=situation;})(globalThis);
