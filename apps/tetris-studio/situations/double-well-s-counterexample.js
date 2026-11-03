// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "S: Why this burn fails",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "S can complete a row here, but a mino remains over column 1 after the clear. It covers the Tetris well and creates buried empty cells. This is a warning example, not a placement to practise.",
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
    "role": "counterexample",
    "target": {
      "type": "S",
      "rotation": 1,
      "x": 0,
      "y": 11
    },
    "clears": 1,
    "note": "S can complete a row here, but a mino remains over column 1 after the clear. It covers the Tetris well and creates buried empty cells. This is a warning example, not a placement to practise.",
    "key": "double-well-s-counterexample"
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
      "caption": "The standard two-wide opening does not make this S burn safe."
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
      "caption": "The current piece is S. Choose its orientation before the descent."
    },
    {
      "step": "3",
      "ticks": 36,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "buttons": [
        "A"
      ],
      "showNext": false,
      "caption": "Orient the piece using the original Game Boy rotation buttons."
    },
    {
      "step": "4",
      "ticks": 60,
      "active": {
        "type": "S",
        "rotation": 1,
        "x": 0,
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
        "type": "S",
        "rotation": 1,
        "x": 0,
        "y": 11
      },
      "animate": true,
      "showNext": false,
      "caption": "S can complete a row here, but a mino remains over column 1 after the clear. It covers the Tetris well and creates buried empty cells. This is a warning example, not a placement to practise."
    },
    {
      "step": "6",
      "ticks": 93,
      "active": {
        "type": "S",
        "rotation": 1,
        "x": 0,
        "y": 11
      },
      "clear": true,
      "highlight": false,
      "showNext": false,
      "caption": "A row clears, but look at what remains over the well."
    },
    {
      "step": "7",
      "ticks": 144,
      "highlight": false,
      "showNext": false,
      "caption": "The S has capped the Tetris column. Avoid this standard burn; it defeats the purpose of the safety well."
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["double-well-s-counterexample"]=situation;})(globalThis);
