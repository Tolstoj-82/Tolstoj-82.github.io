// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "J: North",
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
    "..........",
    "..........",
    "..........",
    ".SSSS.SSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 0,
    "target": {
      "type": "J",
      "rotation": 0,
      "x": 3,
      "y": 13
    },
    "surface": [
      [
        3,
        15
      ],
      [
        4,
        15
      ],
      [
        5,
        16
      ]
    ],
    "heights": [
      1,
      1,
      0
    ]
  },
  "frames": [
    {
      "step": "1",
      "ticks": 168,
      "rows": {
        "14": "...JJJ....",
        "15": ".LLLLJLLLL"
      },
      "placementHighlights": [
        {
          "type": "J",
          "rotation": 0,
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
            15
          ],
          [
            4,
            15
          ],
          [
            5,
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
        "14": "..........",
        "15": ".LLLL.LLLL"
      },
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "highlight": false,
      "showNext": false,
      "caption": ""
    },
    {
      "step": "3",
      "ticks": 112,
      "active": {
        "type": "J",
        "rotation": 0,
        "x": 3,
        "y": 13
      },
      "animate": true,
      "animationFrom": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "fallFirst": 13,
      "buttons": [],
      "highlight": false,
      "showNext": false,
      "caption": ""
    }
  ],
  "qualityWell": 0
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-j-north"]=situation;})(globalThis);
