// Mirrored Game Boy adjustment. Native routes and final tucks verified.
(function(root){const situation={
  "title": "O for Z vert: Sisyphus (Ori: O for S vert)",
  "chapter": "Adjustments",
  "description": "Move O away from the tower to make a flatter landing and leave space for the vertical Z.",
  "stack": [
    "........S.",
    ".......SSS",
    ".......sSS",
    ".......sSS",
    "......sSSS",
    ".SSsssSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "O",
      "x": 3,
      "y": 14,
      "rotation": 0
    },
    "adjusted": {
      "type": "O",
      "x": 2,
      "y": 14,
      "rotation": 0
    },
    "next": {
      "type": "Z",
      "x": 5,
      "y": 14,
      "rotation": 1
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
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
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
      "ticks": 96,
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "O",
        "x": 3,
        "y": 14,
        "rotation": 0,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: Z is next.",
      "ticks": 96,
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "O",
        "x": 3,
        "y": 14,
        "rotation": 0,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Move O away from the tower to make a flatter landing and leave space for the vertical Z.",
      "ticks": 96,
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "O",
        "x": 2,
        "y": 14,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "Next: Z fits beside the adjusted O.",
      "ticks": 96,
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "O",
        "x": 2,
        "y": 14,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "Z",
        "x": 5,
        "y": 14,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "ticks": 2,
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {},
      "caption": "Bring in O."
    },
    {
      "step": "5a",
      "lessonStage": 5,
      "active": {
        "type": "O",
        "x": 2,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "Z",
      "showNext": true,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move O into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "O",
        "x": 2,
        "y": 14,
        "rotation": 0
      },
      "animationFrom": {
        "type": "O",
        "x": 2,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 84,
      "highlight": false,
      "next": "Z",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower O."
    },
    {
      "step": "6",
      "lessonStage": 6,
      "ticks": 2,
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "15": "...OO..LLL",
        "16": "...OO.LLLL"
      },
      "caption": "Bring in Z."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "Z",
        "x": 5,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "Z",
      "showNext": false,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move Z into place."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "Z",
        "x": 5,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "Z",
        "x": 5,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "Z",
      "showNext": false,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate Z."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "Z",
        "x": 5,
        "y": 14,
        "rotation": 3
      },
      "animationFrom": {
        "type": "Z",
        "x": 5,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 84,
      "highlight": false,
      "next": "Z",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower Z."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "14": "......ZLLL",
        "15": "...OOZZLLL",
        "16": "...OOZLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "O",
          "x": 2,
          "y": 14,
          "rotation": 0
        },
        {
          "type": "Z",
          "x": 5,
          "y": 14,
          "rotation": 1
        }
      ],
      "caption": "Notice the resulting stack.",
      "placementBlink": true
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "ticks": 96,
      "motif": {
        "cells": [
          [
            7,
            14
          ],
          [
            7,
            15
          ],
          [
            6,
            16
          ],
          [
            3,
            17
          ],
          [
            4,
            17
          ],
          [
            5,
            17
          ]
        ],
        "color": "#e7a52b"
      },
      "blink": true,
      "caption": "Notice the motif around the completed pair."
    }
  ],
  "motionVerified": true
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-o-z-sisyphus"]=situation;})(globalThis);
