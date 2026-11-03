// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "J: Double-well single",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "Put the J backbone in column 2. Its lower spike completes one row; the remaining minos rebuild the inside edge of the well.",
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
      "type": "J",
      "rotation": 1,
      "x": 0,
      "y": 11
    },
    "clears": 1,
    "note": "Put the J backbone in column 2. Its lower spike completes one row; the remaining minos rebuild the inside edge of the well.",
    "key": "double-well-j-single"
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
        "type": "J",
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
        "type": "J",
        "rotation": 1,
        "x": 0,
        "y": 11
      },
      "animate": true,
      "showNext": false,
      "caption": "Put the J backbone in column 2. Its lower spike completes one row; the remaining minos rebuild the inside edge of the well."
    },
    {
      "step": "6",
      "ticks": 93,
      "active": {
        "type": "J",
        "rotation": 1,
        "x": 0,
        "y": 11
      },
      "clear": true,
      "highlight": false,
      "showNext": false,
      "caption": "Skim 1 row with the original line-clear animation."
    },
    {
      "step": "7",
      "ticks": 144,
      "highlight": false,
      "showNext": false,
      "caption": "The stack is lower and the original Tetris well is still usable. Reassess the surface before the next placement."
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["double-well-j-single"]=situation;})(globalThis);
