(function(root){const situation={
  "title": "I1234: Four-wide tactical burn",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "The lower well is only two rows deep, so no Tetris is available. I1234 takes a tactical single across the four-wide opening.",
  "stack": [
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    ".........S",
    "....SS...S",
    "....SSS..S",
    "....SSSSSS",
    "....SSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "doubleWell": {
    "key": "tactical-burn-4-i",
    "width": 4,
    "role": "skim",
    "target": {
      "type": "I",
      "x": 0,
      "y": 13,
      "rotation": 0
    },
    "clears": 1,
    "note": "The lower well is only two rows deep, so no Tetris is available. I1234 takes a tactical single across the four-wide opening."
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
            14
          ],
          [
            1,
            14
          ],
          [
            2,
            14
          ],
          [
            3,
            14
          ],
          [
            0,
            15
          ],
          [
            1,
            15
          ],
          [
            2,
            15
          ],
          [
            3,
            15
          ],
          [
            0,
            16
          ]
        ],
        "color": "#6d94c4"
      },
      "highlight": false,
      "showNext": false,
      "caption": "The lower well is only two rows deep, so no Tetris is available. I1234 takes a tactical single across the four-wide opening."
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
      "caption": "Choose the horizontal I for the tactical burn."
    },
    {
      "step": "3",
      "ticks": 60,
      "active": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 0
      },
      "animate": true,
      "buttons": [
        "Left"
      ],
      "showNext": false,
      "caption": "Place the horizontal I across the four-wide opening."
    },
    {
      "step": "4",
      "ticks": 132,
      "active": {
        "type": "I",
        "x": 0,
        "y": 13,
        "rotation": 0
      },
      "animate": true,
      "showNext": false,
      "caption": "Place the horizontal I across the four-wide opening."
    },
    {
      "step": "5",
      "ticks": 93,
      "active": {
        "type": "I",
        "x": 0,
        "y": 13,
        "rotation": 0
      },
      "clear": true,
      "highlight": false,
      "showNext": false,
      "caption": "Skim one row with I1234."
    },
    {
      "step": "6",
      "ticks": 144,
      "highlight": false,
      "showNext": false,
      "caption": "The tactical single is complete. Reassess the surface."
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tactical-burn-4-i"]=situation;})(globalThis);
