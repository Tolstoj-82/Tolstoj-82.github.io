// Tactical burn above a Tetris-ready lower well; ROM-based inputs and clears.
(function(root){const situation={
  "title": "Ld123: Three-wide tactical burn",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "The stack is Tetris-ready in column 1. Ld123 puts its downward spike into the one-cell-deep gap in column 1 and completes a double.",
  "stack": [
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    ".........S",
    ".......SSS",
    ".....SSSSS",
    "...SSSSSSS",
    "...SSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "doubleWell": {
    "key": "tactical-burn-3-ld",
    "width": 3,
    "role": "skim",
    "target": {
      "type": "L",
      "x": 0,
      "y": 11,
      "rotation": 0
    },
    "clears": 2,
    "note": "The stack is Tetris-ready in column 1. Ld123 puts its downward spike into the one-cell-deep gap in column 1 and completes a double.",
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
            0,
            14
          ]
        ],
        "color": "#6d94c4"
      },
      "highlight": false,
      "showNext": false,
      "caption": "Tetris-ready in column 1: four prepared rows below the wider opening. Use Ld123 for a tactical burn above them."
    },
    {
      "step": "2",
      "ticks": 48,
      "active": {
        "type": "L",
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
        "type": "L",
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
        "type": "L",
        "x": 0,
        "y": 11,
        "rotation": 0
      },
      "animate": true,
      "showNext": false,
      "caption": "Ld123 skims 2 rows above the prepared Tetris well."
    },
    {
      "step": "5",
      "ticks": 93,
      "active": {
        "type": "L",
        "x": 0,
        "y": 11,
        "rotation": 0
      },
      "clear": true,
      "highlight": false,
      "showNext": false,
      "caption": "Tactical burn: skim 2 rows above the prepared well."
    },
    {
      "step": "6",
      "ticks": 144,
      "highlight": false,
      "showNext": false,
      "caption": "The lower four rows remain Tetris-ready in column 1. Reassess the surface before the next piece."
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tactical-burn-3-ld"]=situation;})(globalThis);
