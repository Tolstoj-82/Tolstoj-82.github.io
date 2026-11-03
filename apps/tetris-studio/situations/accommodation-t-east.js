// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "T: East",
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
    ".SS....SSS",
    ".SS..SSSSS",
    ".SSS.SSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 1,
    "target": {
      "type": "T",
      "rotation": 1,
      "x": 3,
      "y": 11
    },
    "surface": [
      [
        4,
        14
      ],
      [
        3,
        13
      ]
    ],
    "heights": [
      0,
      1
    ]
  },
  "frames": [
    {
      "step": "1",
      "ticks": 168,
      "rows": {
        "11": ".LL.T..LLL",
        "12": ".LLTTLLLLL",
        "13": ".LLLTLLLLL"
      },
      "placementHighlights": [
        {
          "type": "T",
          "rotation": 1,
          "x": 3,
          "y": 11
        }
      ],
      "placementColors": [
        "#e04444"
      ],
      "motif": {
        "cells": [
          [
            3,
            13
          ],
          [
            4,
            14
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
        "11": ".LL....LLL",
        "12": ".LL..LLLLL",
        "13": ".LLL.LLLLL"
      },
      "active": {
        "type": "T",
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
        "type": "T",
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
        "type": "T",
        "rotation": 1,
        "x": 3,
        "y": 11
      },
      "animate": true,
      "animationFrom": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 1
      },
      "fallFirst": 11,
      "buttons": [],
      "highlight": false,
      "showNext": false,
      "caption": ""
    }
  ],
  "qualityWell": 0
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-t-east"]=situation;})(globalThis);
