// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "L: East",
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
    "......S.SS",
    "..S...SSSS",
    ".SSS.SSSSS",
    ".SSS.SSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 1,
    "target": {
      "type": "L",
      "rotation": 1,
      "x": 3,
      "y": 13
    },
    "surface": [
      [
        3,
        14
      ],
      [
        4,
        16
      ]
    ],
    "heights": [
      2,
      0
    ]
  },
  "frames": [
    {
      "step": "1",
      "ticks": 168,
      "rows": {
        "13": "..LLL.LLLL",
        "14": ".LLLLLLLLL",
        "15": ".LLLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "L",
          "rotation": 1,
          "x": 3,
          "y": 13
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
            4,
            16
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
        "13": "..L...LLLL",
        "14": ".LLL.LLLLL",
        "15": ".LLL.LLLLL"
      },
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "highlight": false,
      "showNext": false,
      "caption": ""
    },
    {
      "step": "2a",
      "ticks": 24,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 1
      },
      "buttons": [
        "A"
      ],
      "highlight": false,
      "showNext": false,
      "caption": ""
    },
    {
      "step": "3",
      "ticks": 112,
      "active": {
        "type": "L",
        "rotation": 1,
        "x": 3,
        "y": 13
      },
      "animate": true,
      "animationFrom": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 1
      },
      "fallFirst": 13,
      "buttons": [],
      "highlight": false,
      "showNext": false,
      "caption": ""
    }
  ],
  "qualityWell": 0
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-l-east"]=situation;})(globalThis);
