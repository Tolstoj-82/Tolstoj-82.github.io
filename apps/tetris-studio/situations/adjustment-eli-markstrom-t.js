// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Eli Markstrom T: GarbageEgg T",
  "chapter": "Adjustments",
  "description": "Stand T at the wall to leave room for O and prepare the stack for a Tetris.",
  "stack": [
    ".........S",
    ".......SSS",
    "......SSSS",
    ".....SSSSS",
    "....sSSSSS",
    "..ssSSSSSS",
    ".sSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "T",
      "x": 0,
      "y": 12,
      "rotation": 0
    },
    "adjusted": {
      "type": "T",
      "x": 0,
      "y": 12,
      "rotation": 1
    },
    "next": {
      "type": "O",
      "x": 1,
      "y": 11,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "motif": true,
      "blink": true
    },
    {
      "step": "2",
      "lessonStage": 2,
      "caption": "Default: the usual landing without this adjustment.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "T",
        "x": 0,
        "y": 12,
        "rotation": 0,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: O is next.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "T",
        "x": 0,
        "y": 12,
        "rotation": 0,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Stand T at the wall to leave room for O and prepare the stack for a Tetris.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "T",
        "x": 0,
        "y": 12,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next O fits beside the adjusted T.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "T",
        "x": 0,
        "y": 12,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "O",
        "x": 1,
        "y": 11,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Place T in the adjusted position.",
      "ticks": 144,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 0,
        "y": 12,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ]
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in O.",
      "ticks": 2,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "12": ".T...LLLLL",
        "13": "TT..LLLLLL",
        "14": ".TLLLLLLLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place O in the landing left for it.",
      "ticks": 144,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 1,
        "y": 11,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": []
    },
    {
      "step": "6z",
      "lessonStage": 6,
      "caption": "The second piece completes a row. Watch the Game Boy line clear.",
      "clear": true,
      "showNext": false,
      "highlight": false
    },
    {
      "step": "7",
      "lessonStage": 7,
      "caption": "After the clear, the surviving minos and upper stack have dropped.",
      "ticks": 96,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "blink": true
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "caption": "Notice the motif on the lowered stack.",
      "ticks": 96,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "motif": {
        "cells": [
          [
            2,
            14
          ],
          [
            3,
            14
          ],
          [
            1,
            15
          ]
        ],
        "color": "#e7a52b"
      },
      "blink": true
    }
  ],
  "section": "Good but Situational"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-eli-markstrom-t"]=situation;})(globalThis);
