// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "J: West",
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
    "......SS.S",
    ".....SSSSS",
    ".SSS.SSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 3,
    "target": {
      "type": "J",
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
        12
      ]
    ],
    "heights": [
      0,
      2
    ]
  },
  "frames": [
    {
      "step": "1",
      "ticks": 168,
      "rows": {
        "11": "....JJLL.L",
        "12": "....JLLLLL",
        "13": ".LLLJLLLLL"
      },
      "placementHighlights": [
        {
          "type": "J",
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
            12
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
        "11": "......LL.L",
        "12": ".....LLLLL",
        "13": ".LLL.LLLLL"
      },
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "showNext": false,
      "highlight": false,
      "caption": ""
    },
    {
      "step": "2a",
      "ticks": 24,
      "active": {
        "type": "J",
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
        "type": "J",
        "rotation": 3,
        "x": 3,
        "y": 11
      },
      "animate": true,
      "fallFirst": 11,
      "animationFrom": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 3
      },
      "buttons": [],
      "highlight": false,
      "showNext": false,
      "caption": ""
    }
  ],
  "qualityWell": 0
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-j-west"]=situation;})(globalThis);
