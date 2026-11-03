// Tactical burn above a Tetris-ready lower well; ROM-based inputs and clears.
(function(root){const situation={
  "title": "Ju123: Delayed follow-up burn",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "The stack is Tetris-ready in column 1. Ju123 clears one row, but its surviving mino sits above the remaining one-wide gap. The follow-up burn is delayed and awkward; this is not the optimal choice.",
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
    "key": "tactical-burn-3-ju",
    "width": 3,
    "role": "delayed",
    "target": {
      "type": "J",
      "x": 0,
      "y": 11,
      "rotation": 2
    },
    "clears": 1,
    "note": "The stack is Tetris-ready in column 1. Ju123 clears one row, but its surviving mino sits above the remaining one-wide gap. The follow-up burn is delayed and awkward; this is not the optimal choice.",
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
          ]
        ],
        "color": "#6d94c4"
      },
      "highlight": false,
      "showNext": false,
      "caption": "Tetris-ready in column 1. Ju123 skims a row, but the remaining mino delays the follow-up burn. This is not the optimal choice."
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
      "ticks": 36,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "buttons": [
        "A"
      ],
      "showNext": false,
      "caption": "Orient the piece above the wider entrance."
    },
    {
      "step": "4",
      "ticks": 36,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 2
      },
      "animate": true,
      "buttons": [
        "A"
      ],
      "showNext": false,
      "caption": "Orient the piece above the wider entrance."
    },
    {
      "step": "5",
      "ticks": 60,
      "active": {
        "type": "J",
        "x": 0,
        "y": 0,
        "rotation": 2
      },
      "animate": true,
      "buttons": [
        "Left"
      ],
      "showNext": false,
      "caption": "Move over the wider opening above the Tetris-ready stack."
    },
    {
      "step": "6",
      "ticks": 132,
      "active": {
        "type": "J",
        "x": 0,
        "y": 11,
        "rotation": 2
      },
      "animate": true,
      "showNext": false,
      "caption": "Ju123 clears one row but leaves a mino over the prepared well. The follow-up burn is delayed; this is not optimal."
    },
    {
      "step": "7",
      "ticks": 93,
      "active": {
        "type": "J",
        "x": 0,
        "y": 11,
        "rotation": 2
      },
      "clear": true,
      "highlight": false,
      "showNext": false,
      "caption": "Tactical burn: skim 1 row above the prepared well."
    },
    {
      "step": "8",
      "ticks": 144,
      "highlight": false,
      "showNext": false,
      "caption": "The initial stack was Tetris-ready, but Ju123 leaves a mino over the well and delays the follow-up burn. This is not optimal."
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tactical-burn-3-ju"]=situation;})(globalThis);
