// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "I: Restore the Tetris well",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "Column 2 is only three minos high, so the existing well cannot yield a Tetris yet. Place I in column 2 to rebuild the inner edge while keeping column 1 open for a later Tetris.",
  "stack": [
    "........SS",
    ".......SSS",
    ".......SSS",
    ".......SSS",
    "....SSSSSS",
    "..SSSSSSSS",
    "..SSSSSSSS",
    "..SSSSSSSS",
    "..SSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "doubleWell": {
    "role": "repair",
    "target": {
      "type": "I",
      "rotation": 1,
      "x": 0,
      "y": 11
    },
    "clears": 0,
    "note": "Column 2 is only three minos high, so the existing well cannot yield a Tetris yet. Place I in column 2 to rebuild the inner edge while keeping column 1 open for a later Tetris.",
    "key": "double-well-i-repair"
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
          ],
          [
            0,
            14
          ],
          [
            1,
            14
          ]
        ],
        "color": "#6d94c4"
      },
      "highlight": false,
      "showNext": false,
      "caption": "The inner edge in column 2 is only three minos high: the lower well is not Tetris-ready."
    },
    {
      "step": "2",
      "ticks": 48,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "showNext": false,
      "caption": "The current piece is I. Choose its orientation before the descent."
    },
    {
      "step": "3",
      "ticks": 36,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
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
        "type": "I",
        "rotation": 1,
        "x": 0,
        "y": -1
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
        "type": "I",
        "rotation": 1,
        "x": 0,
        "y": 11
      },
      "animate": true,
      "showNext": false,
      "caption": "Column 2 is only three minos high, so the existing well cannot yield a Tetris yet. Place I in column 2 to rebuild the inner edge while keeping column 1 open for a later Tetris."
    },
    {
      "step": "6",
      "ticks": 96,
      "rows": {
        "11": ".ILLLLLLLL",
        "12": ".ILLLLLLLL",
        "13": ".ILLLLLLLL",
        "14": ".ILLLLLLLL"
      },
      "tileOverrides": [
        {
          "x": 1,
          "y": 11,
          "tile": 128
        },
        {
          "x": 1,
          "y": 12,
          "tile": 136
        },
        {
          "x": 1,
          "y": 13,
          "tile": 136
        },
        {
          "x": 1,
          "y": 14,
          "tile": 137
        }
      ],
      "highlight": false,
      "showNext": false,
      "caption": "No line clear yet. Column 2 is rebuilt and column 1 stays open."
    },
    {
      "step": "7",
      "ticks": 144,
      "highlight": false,
      "showNext": false,
      "caption": "The inner edge is now high enough for a Tetris. A later I can clear four rows in column 1."
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["double-well-i-repair"]=situation;})(globalThis);
