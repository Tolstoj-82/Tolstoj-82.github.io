// Metric-checked accommodation: fully supported drop, open left well, healthy continuation.
(function(root){const situation={
  "title": "L: West",
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
    ".SSS......",
    ".SSS..SSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "accommodation": {
    "orientation": 3,
    "target": {
      "type": "L",
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
        14
      ]
    ],
    "heights": [
      0,
      0
    ]
  },
  "frames": [
    {
      "step": "1",
      "ticks": 168,
      "rows": {
        "11": "....L.....",
        "12": ".LLLL.....",
        "13": ".LLLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "L",
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
        "11": "..........",
        "12": ".LLL......",
        "13": ".LLL..LLLL"
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
        "type": "L",
        "rotation": 3,
        "x": 3,
        "y": 11
      },
      "animate": true,
      "animationFrom": {
        "type": "L",
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["accommodation-l-west"]=situation;})(globalThis);
