// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "J: Safety triple",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "Use the other upright J orientation when the lower opening is one column wide. The top spike fills the wider entrance and the backbone clears three rows.",
  "stack": [
    "........SS",
    ".......SSS",
    ".......SSS",
    ".......SSS",
    "....SSSSSS",
    "..SSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "doubleWell": {
    "role": "skim",
    "target": {
      "type": "J",
      "rotation": 3,
      "x": -1,
      "y": 11
    },
    "clears": 3,
    "note": "Use the other upright J orientation when the lower opening is one column wide. The top spike fills the wider entrance and the backbone clears three rows.",
    "key": "double-well-j-safety-triple"
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
            0,
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
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "showNext": false,
      "caption": "The current piece is J. Choose its orientation before the descent."
    },
    {
      "step": "3",
      "ticks": 36,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "buttons": [
        "B"
      ],
      "showNext": false,
      "caption": "Orient the piece using the original Game Boy rotation buttons."
    },
    {
      "step": "4",
      "ticks": 60,
      "active": {
        "type": "J",
        "rotation": 3,
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
        "type": "J",
        "rotation": 3,
        "x": -1,
        "y": 11
      },
      "animate": true,
      "showNext": false,
      "caption": "Use the other upright J orientation when the lower opening is one column wide. The top spike fills the wider entrance and the backbone clears three rows."
    },
    {
      "step": "6",
      "ticks": 93,
      "active": {
        "type": "J",
        "rotation": 3,
        "x": -1,
        "y": 11
      },
      "clear": true,
      "highlight": false,
      "showNext": false,
      "caption": "Safety triple: burn three rows to lower the stack."
    },
    {
      "step": "7",
      "ticks": 144,
      "highlight": false,
      "showNext": false,
      "caption": "The stack is lower and the original Tetris well is still usable. Reassess the surface before the next placement."
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["double-well-j-safety-triple"]=situation;})(globalThis);
