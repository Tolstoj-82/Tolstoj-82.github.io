// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "J: South",
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
    ".SS....SSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 2,
    "target": {
      "type": "J",
      "rotation": 2,
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
        15
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
        "13": "...J......",
        "14": ".LLJJJ.LLL"
      },
      "placementHighlights": [
        {
          "type": "J",
          "rotation": 2,
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
        "13": "..........",
        "14": ".LL....LLL"
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
      "step": "2a",
      "ticks": 24,
      "active": {
        "type": "J",
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
        "type": "J",
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
        "type": "J",
        "rotation": 2,
        "x": 3,
        "y": 13
      },
      "animate": true,
      "animationFrom": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 2
      },
      "fallFirst": 13,
      "buttons": [],
      "highlight": false,
      "showNext": false,
      "caption": ""
    }
  ],
  "qualityWell": 0
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-j-south"]=situation;})(globalThis);
