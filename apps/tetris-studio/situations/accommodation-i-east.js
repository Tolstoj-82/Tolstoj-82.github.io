// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "I: East",
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
    ".SS......S",
    ".SSS.SSSSS",
    ".SSS.SSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 1,
    "target": {
      "type": "I",
      "rotation": 1,
      "x": 3,
      "y": 11
    },
    "surface": [
      [
        4,
        15
      ]
    ],
    "heights": [
      0
    ]
  },
  "frames": [
    {
      "step": "1",
      "ticks": 168,
      "rows": {
        "11": "....I.....",
        "12": ".LL.I....L",
        "13": ".LLLILLLLL",
        "14": ".LLLILLLLL"
      },
      "placementHighlights": [
        {
          "type": "I",
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
        "11": "..........",
        "12": ".LL......L",
        "13": ".LLL.LLLLL",
        "14": ".LLL.LLLLL"
      },
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
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
        "type": "I",
        "x": 3,
        "y": -1,
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
        "type": "I",
        "rotation": 1,
        "x": 3,
        "y": 11
      },
      "animate": true,
      "animationFrom": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 1
      },
      "fallFirst": 12,
      "buttons": [],
      "highlight": false,
      "showNext": false,
      "caption": ""
    }
  ],
  "qualityWell": 0
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-i-east"]=situation;})(globalThis);
