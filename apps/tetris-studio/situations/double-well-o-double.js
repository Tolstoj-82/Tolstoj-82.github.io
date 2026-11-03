// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "O: Double-well double",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "O fills the lower two rows of the two-wide opening and burns a double. Keep the original Tetris column open underneath.",
  "stack": [
    "........SS",
    ".......SSS",
    ".......SSS",
    ".......SSS",
    "....SSSSSS",
    "..SSSSSSSS",
    "..SSSSSSSS",
    "..SSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "doubleWell": {
    "role": "skim",
    "target": {
      "type": "O",
      "rotation": 0,
      "x": -1,
      "y": 11
    },
    "clears": 2,
    "note": "O fills the lower two rows of the two-wide opening and burns a double. Keep the original Tetris column open underneath.",
    "key": "double-well-o-double"
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
            0,
            12
          ],
          [
            1,
            12
          ],
          [
            0,
            13
          ],
          [
            1,
            13
          ]
        ],
        "color": "#6d94c4"
      },
      "highlight": false,
      "showNext": false,
      "caption": "The two-column entrance sits above the one-column Tetris well."
    },
    {
      "step": "2",
      "ticks": 48,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "showNext": false,
      "caption": "The current piece is O. Choose its orientation before the descent."
    },
    {
      "step": "3",
      "ticks": 36,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "buttons": [],
      "showNext": false,
      "caption": "This piece already has the needed orientation."
    },
    {
      "step": "4",
      "ticks": 60,
      "active": {
        "type": "O",
        "rotation": 0,
        "x": -1,
        "y": 0
      },
      "animate": true,
      "buttons": [
        "Left"
      ],
      "showNext": false,
      "caption": "Move over the left-hand double well."
    },
    {
      "step": "5",
      "ticks": 132,
      "active": {
        "type": "O",
        "rotation": 0,
        "x": -1,
        "y": 11
      },
      "animate": true,
      "showNext": false,
      "caption": "O fills the lower two rows of the two-wide opening and burns a double. Keep the original Tetris column open underneath."
    },
    {
      "step": "6",
      "ticks": 93,
      "active": {
        "type": "O",
        "rotation": 0,
        "x": -1,
        "y": 11
      },
      "clear": true,
      "highlight": false,
      "showNext": false,
      "caption": "Skim 2 rows with the original line-clear animation."
    },
    {
      "step": "7",
      "ticks": 144,
      "highlight": false,
      "showNext": false,
      "caption": "The stack is lower and the original Tetris well is still usable. Reassess the surface before the next placement."
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["double-well-o-double"]=situation;})(globalThis);
