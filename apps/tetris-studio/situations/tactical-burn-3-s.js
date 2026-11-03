// Tactical burn above a Tetris-ready lower well; ROM-based inputs and clears.
(function(root){const situation={
  "title": "S123: Supported three-wide burn",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "The stack is Tetris-ready in column 1. S123 needs support under its upper-right mino in column 3, with the lower pair able to enter columns 1 and 2. A flat three-wide floor would leave an unsupported mino.",
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
    "..SSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "doubleWell": {
    "key": "tactical-burn-3-s",
    "width": 3,
    "role": "skim",
    "target": {
      "type": "S",
      "x": 0,
      "y": 11,
      "rotation": 0
    },
    "clears": 1,
    "note": "The stack is Tetris-ready in column 1. S123 needs support under its upper-right mino in column 3, with the lower pair able to enter columns 1 and 2. A flat three-wide floor would leave an unsupported mino.",
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
            1,
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
      "caption": "Tetris-ready in column 1: four prepared rows below the wider opening. Use S123 for a tactical burn above them."
    },
    {
      "step": "2",
      "ticks": 48,
      "active": {
        "type": "S",
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
        "type": "S",
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
        "type": "S",
        "x": 0,
        "y": 11,
        "rotation": 0
      },
      "animate": true,
      "showNext": false,
      "caption": "S123 fills the two-wide entrance above four prepared rows. The raised support in column 3 allows the skim."
    },
    {
      "step": "5",
      "ticks": 93,
      "active": {
        "type": "S",
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tactical-burn-3-s"]=situation;})(globalThis);
