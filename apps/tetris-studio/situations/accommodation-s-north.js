// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "S: North",
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
    "......SSSS",
    ".....SSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 0,
    "target": {
      "type": "S",
      "rotation": 0,
      "x": 3,
      "y": 12
    },
    "surface": [
      [
        4,
        15
      ],
      [
        5,
        14
      ],
      [
        3,
        15
      ]
    ],
    "heights": [
      0,
      1,
      0
    ]
  },
  "frames": [
    {
      "step": "1",
      "ticks": 168,
      "rows": {
        "13": "....SSLLLL",
        "14": "...SSLLLLL"
      },
      "placementHighlights": [
        {
          "type": "S",
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
            5,
            14
          ],
          [
            3,
            15
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
        "13": "......LLLL",
        "14": ".....LLLLL"
      },
      "active": {
        "type": "S",
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
        "type": "S",
        "rotation": 0,
        "x": 3,
        "y": 12
      },
      "animate": true,
      "animationFrom": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "fallFirst": 12,
      "buttons": [],
      "highlight": false,
      "showNext": false,
      "caption": ""
    }
  ],
  "qualityWell": 0
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-s-north"]=situation;})(globalThis);
