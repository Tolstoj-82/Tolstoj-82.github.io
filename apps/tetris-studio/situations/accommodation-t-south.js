// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "T: South",
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
    ".......S.S",
    ".SS...SSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 2,
    "target": {
      "type": "T",
      "rotation": 2,
      "x": 3,
      "y": 12
    },
    "surface": [
      [
        4,
        14
      ],
      [
        3,
        14
      ],
      [
        5,
        14
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
        "12": "....T..L.L",
        "13": ".LLTTTLLLL"
      },
      "placementHighlights": [
        {
          "type": "T",
          "rotation": 2,
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
            4,
            14
          ],
          [
            5,
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
        "12": ".......L.L",
        "13": ".LL...LLLL"
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
      "step": "2b",
      "ticks": 24,
      "active": {
        "type": "T",
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
        "type": "T",
        "rotation": 2,
        "x": 3,
        "y": 12
      },
      "animate": true,
      "animationFrom": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 2
      },
      "fallFirst": 12,
      "buttons": [],
      "highlight": false,
      "showNext": false,
      "caption": ""
    }
  ],
  "qualityWell": 0
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-t-south"]=situation;})(globalThis);
