// Tactical burn above a Tetris-ready lower well; ROM-based inputs and clears.
(function(root){const situation={
  "title": "Jd123: Notch in column 3",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "The stack is Tetris-ready in column 1. Jd123 fits the one-cell-deep notch in column 3, beside the deeper Tetris well. It skims one row above the prepared four rows.",
  "stack": [
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    ".........S",
    ".........S",
    ".......SSS",
    ".....SSSSS",
    "...SSSSSSS",
    "...SSSSSSS",
    ".S.SSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "doubleWell": {
    "key": "tactical-burn-3-jd",
    "width": 3,
    "role": "skim",
    "target": {
      "type": "J",
      "x": 0,
      "y": 11,
      "rotation": 0
    },
    "clears": 1,
    "note": "The stack is Tetris-ready in column 1. Jd123 fits the one-cell-deep notch in column 3, beside the deeper Tetris well. It skims one row above the prepared four rows.",
    "tetrisColumn": 1
  },
  "frames": [
    {
      "step": "1",
      "ticks": 96,
      "motif": {
        "space": true,
        "cells": [
          [
            0,
            11
          ],
          [
            1,
            11
          ],
          [
            2,
            11
          ],
          [
            0,
            12
          ],
          [
            1,
            12
          ],
          [
            2,
            12
          ],
          [
            0,
            13
          ],
          [
            2,
            13
          ]
        ],
        "color": "#6d94c4"
      },
      "highlight": false,
      "showNext": false,
      "caption": "Tetris-ready in column 1. Jd123 uses the one-cell-deep notch in column 3 beside the deeper well."
    },
    {
      "step": "2",
      "ticks": 48,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "showNext": false,
      "caption": "Choose the tactical burn above the prepared Tetris well."
    },
    {
      "step": "3",
      "ticks": 60,
      "active": {
        "type": "J",
        "x": 0,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "buttons": [
        "Left"
      ],
      "showNext": false,
      "caption": "Move over the wider opening above the Tetris-ready stack."
    },
    {
      "step": "4",
      "ticks": 132,
      "active": {
        "type": "J",
        "x": 0,
        "y": 11,
        "rotation": 0
      },
      "animate": true,
      "showNext": false,
      "caption": "Jd123 fits the one-cell-deep notch in column 3, skimming above the four prepared rows in column 1."
    },
    {
      "step": "5",
      "ticks": 93,
      "active": {
        "type": "J",
        "x": 0,
        "y": 11,
        "rotation": 0
      },
      "clear": true,
      "highlight": false,
      "showNext": false,
      "caption": "Tactical burn: skim 1 row above the prepared well."
    },
    {
      "step": "6",
      "ticks": 144,
      "highlight": false,
      "showNext": false,
      "caption": "The lower four rows remain Tetris-ready in column 1. Reassess the surface before the next piece."
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tactical-burn-3-jd"]=situation;})(globalThis);
