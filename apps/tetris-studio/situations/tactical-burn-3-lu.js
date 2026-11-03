// Tactical burn above a Tetris-ready lower well; ROM-based inputs and clears.
(function(root){const situation={
  "title": "Lu123: Three-wide tactical burn",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "The stack is Tetris-ready in column 1. Lu123 clears a row cleanly. Its surviving mino stays beside the open one-wide well.",
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
    "key": "tactical-burn-3-lu",
    "width": 3,
    "role": "skim",
    "target": {
      "type": "L",
      "x": 0,
      "y": 11,
      "rotation": 2
    },
    "clears": 1,
    "note": "The stack is Tetris-ready in column 1. Lu123 clears a row cleanly. Its surviving mino stays beside the open one-wide well.",
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
      "caption": "Tetris-ready in column 1: four prepared rows below the wider opening. Use Lu123 for a tactical burn above them."
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
      "ticks": 36,
      "active": {
        "type": "L",
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
        "type": "L",
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
        "type": "L",
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
        "type": "L",
        "x": 0,
        "y": 11,
        "rotation": 2
      },
      "animate": true,
      "showNext": false,
      "caption": "Lu123 skims 1 row above the prepared Tetris well."
    },
    {
      "step": "7",
      "ticks": 93,
      "active": {
        "type": "L",
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
      "caption": "The lower four rows remain Tetris-ready in column 1. Reassess the surface before the next piece."
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tactical-burn-3-lu"]=situation;})(globalThis);
