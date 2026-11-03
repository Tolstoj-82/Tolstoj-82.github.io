// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "T: West",
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
    ".SSS..S.SS",
    ".SSS.SSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 3,
    "target": {
      "type": "T",
      "rotation": 3,
      "x": 3,
      "y": 11
    },
    "surface": [
      [
        4,
        14
      ],
      [
        5,
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
        "11": "....T.....",
        "12": ".LLLTTL.LL",
        "13": ".LLLTLLLLL"
      },
      "placementHighlights": [
        {
          "type": "T",
          "rotation": 3,
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
            5,
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
        "11": "..........",
        "12": ".LLL..L.LL",
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
        "rotation": 3
      },
      "buttons": [
        "B"
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
        "rotation": 3,
        "x": 3,
        "y": 11
      },
      "animate": true,
      "animationFrom": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 3
      },
      "fallFirst": 11,
      "buttons": [],
      "highlight": false,
      "showNext": false,
      "caption": ""
    }
  ],
  "qualityWell": 0
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-t-west"]=situation;})(globalThis);
