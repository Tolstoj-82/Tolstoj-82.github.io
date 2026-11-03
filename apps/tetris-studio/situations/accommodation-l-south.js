// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "L: South",
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
    ".SS...SSSS",
    ".SS...SSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 2,
    "target": {
      "type": "L",
      "rotation": 2,
      "x": 3,
      "y": 14
    },
    "surface": [
      [
        5,
        16
      ],
      [
        3,
        16
      ],
      [
        4,
        16
      ]
    ],
    "heights": [
      0,
      0,
      0
    ]
  },
  "frames": [
    {
      "step": "1",
      "ticks": 168,
      "rows": {
        "14": ".LL..LLLLL",
        "15": ".LLLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "L",
          "rotation": 2,
          "x": 3,
          "y": 14
        }
      ],
      "placementColors": [
        "#e04444"
      ],
      "motif": {
        "cells": [
          [
            3,
            16
          ],
          [
            4,
            16
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
        "14": ".LL...LLLL",
        "15": ".LL...LLLL"
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
      "step": "2b",
      "ticks": 24,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 2
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
        "rotation": 2,
        "x": 3,
        "y": 14
      },
      "animate": true,
      "animationFrom": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 2
      },
      "fallFirst": 14,
      "buttons": [],
      "highlight": false,
      "showNext": false,
      "caption": ""
    }
  ],
  "qualityWell": 0
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-l-south"]=situation;})(globalThis);
