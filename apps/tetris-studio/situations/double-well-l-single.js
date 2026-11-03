// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "L: Double-well single",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "The upper L spike completes a row near the top of the double well. The minos below it remain beside the open Tetris column.",
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
      "type": "L",
      "rotation": 1,
      "x": 0,
      "y": 11
    },
    "clears": 1,
    "note": "The upper L spike completes a row near the top of the double well. The minos below it remain beside the open Tetris column.",
    "key": "double-well-l-single"
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
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "showNext": false,
      "caption": "The current piece is L. Choose its orientation before the descent."
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
      "caption": "Orient the piece using the original Game Boy rotation buttons."
    },
    {
      "step": "4",
      "ticks": 60,
      "active": {
        "type": "L",
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
        "type": "L",
        "rotation": 1,
        "x": 0,
        "y": 11
      },
      "animate": true,
      "showNext": false,
      "caption": "The upper L spike completes a row near the top of the double well. The minos below it remain beside the open Tetris column."
    },
    {
      "step": "6",
      "ticks": 93,
      "active": {
        "type": "L",
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["double-well-l-single"]=situation;})(globalThis);
