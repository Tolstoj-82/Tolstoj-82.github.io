// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "S: East",
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
    "..S.......",
    "..S....SSS",
    ".SSS.SSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 1,
    "target": {
      "type": "S",
      "rotation": 1,
      "x": 3,
      "y": 12
    },
    "surface": [
      [
        3,
        14
      ],
      [
        4,
        15
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
        "12": "..LS......",
        "13": "..LSS..LLL",
        "14": ".LLLSLLLLL"
      },
      "placementHighlights": [
        {
          "type": "S",
          "rotation": 1,
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
        "12": "..L.......",
        "13": "..L....LLL",
        "14": ".LLL.LLLLL"
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
      "step": "2a",
      "ticks": 24,
      "active": {
        "type": "S",
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
        "type": "S",
        "rotation": 1,
        "x": 3,
        "y": 12
      },
      "animate": true,
      "animationFrom": {
        "type": "S",
        "x": 3,
        "y": 0,
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-s-east"]=situation;})(globalThis);
