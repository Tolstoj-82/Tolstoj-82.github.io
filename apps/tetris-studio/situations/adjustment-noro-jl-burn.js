// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Noro JL burn (Ori: Noro LJ burn)",
  "chapter": "Adjustments",
  "description": "Lay J across the low ledge, then place L flat to burn two rows.",
  "stack": [
    "......S...",
    "......SS.S",
    "......SSSS",
    ".....SSSSS",
    "...SSSSSSS",
    "...sSSSSSS",
    "....sSSSSS",
    "....sSSSSS",
    "..SsSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "J",
      "x": -1,
      "y": 15,
      "rotation": 3
    },
    "adjusted": {
      "type": "J",
      "x": 1,
      "y": 12,
      "rotation": 0
    },
    "next": {
      "type": "L",
      "x": 0,
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
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
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
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": -1,
        "y": 15,
        "rotation": 3,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: L is next.",
      "ticks": 96,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": -1,
        "y": 15,
        "rotation": 3,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Lay J across the low ledge, then place L flat to burn two rows.",
      "ticks": 96,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 1,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next L fits beside the adjusted J.",
      "ticks": 96,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "J",
        "x": 1,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "L",
        "x": 0,
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
      "caption": "Lower J upright beside the overhang.",
      "ticks": 144,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
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
      "step": "5b",
      "lessonStage": 5,
      "caption": "Press B to turn J flat beneath the overhang.",
      "ticks": 36,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 0,
        "y": 12,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ]
    },
    {
      "step": "5c",
      "lessonStage": 5,
      "caption": "Press Right once to tuck J onto the ledge.",
      "ticks": 36,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 1,
        "y": 12,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ]
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in L.",
      "ticks": 2,
      "next": "L",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "13": ".JJJLLLLLL",
        "14": "...JLLLLLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place L in the landing left for it.",
      "ticks": 144,
      "next": "L",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 0,
        "y": 11,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": []
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "caption": "L completes two rows. Watch the Game Boy double line clear.",
      "clear": true,
      "next": "L",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "7",
      "lessonStage": 7,
      "caption": "After the double burn, the upper stack has dropped two rows.",
      "ticks": 96,
      "next": "L",
      "showNext": false,
      "highlight": false,
      "blink": true
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "caption": "Notice the motif on the lowered stack.",
      "ticks": 96,
      "next": "L",
      "showNext": false,
      "highlight": false,
      "motif": {
        "cells": [
          [
            4,
            14
          ],
          [
            3,
            15
          ]
        ]
      },
      "blink": true
    }
  ],
  "section": "Dicey"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-noro-jl-burn"]=situation;})(globalThis);
