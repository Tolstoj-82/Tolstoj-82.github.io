// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "Z: East",
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
    ".......S..",
    ".SS..SSS..",
    ".SS.SSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 1,
    "target": {
      "type": "Z",
      "rotation": 1,
      "x": 3,
      "y": 11
    },
    "surface": [
      [
        4,
        13
      ],
      [
        3,
        14
      ]
    ],
    "heights": [
      1,
      0
    ]
  },
  "frames": [
    {
      "step": "1",
      "ticks": 168,
      "rows": {
        "11": "....Z..L..",
        "12": ".LLZZLLL..",
        "13": ".LLZLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "Z",
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
            4,
            13
          ],
          [
            3,
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
        "11": ".......L..",
        "12": ".LL..LLL..",
        "13": ".LL.LLLLLL"
      },
      "active": {
        "type": "Z",
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
        "type": "Z",
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
        "type": "Z",
        "rotation": 1,
        "x": 3,
        "y": 11
      },
      "animate": true,
      "fallFirst": 11,
      "animationFrom": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 1
      },
      "buttons": [],
      "highlight": false,
      "showNext": false,
      "caption": ""
    }
  ],
  "qualityWell": 0
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-z-east"]=situation;})(globalThis);
