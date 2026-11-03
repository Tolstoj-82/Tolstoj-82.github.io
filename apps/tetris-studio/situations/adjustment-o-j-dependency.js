// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "O for J dependency: Below and six (Ori: O for L)",
  "chapter": "Adjustments",
  "description": "Shift O one cell right to avoid another hook dependency afterwards.",
  "stack": [
    ".SSSS....S",
    ".SSSSSss.S",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "O",
      "x": 4,
      "y": 13,
      "rotation": 0
    },
    "adjusted": {
      "type": "O",
      "x": 5,
      "y": 13,
      "rotation": 0
    },
    "next": {
      "type": "J",
      "x": 7,
      "y": 14,
      "rotation": 3
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "next": "J",
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
      "next": "J",
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
        "x": 4,
        "y": 13,
        "rotation": 0,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: J is next.",
      "ticks": 96,
      "next": "J",
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
        "x": 4,
        "y": 13,
        "rotation": 0,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Shift O one cell right to avoid another hook dependency afterwards.",
      "ticks": 96,
      "next": "J",
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
        "x": 5,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "Next: J fits beside the adjusted O.",
      "ticks": 96,
      "next": "J",
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
        "x": 5,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "J",
        "x": 7,
        "y": 14,
        "rotation": 3,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "ticks": 2,
      "next": "J",
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
        "x": 5,
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
      "next": "J",
      "showNext": true,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move O into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "O",
        "x": 5,
        "y": 13,
        "rotation": 0
      },
      "animationFrom": {
        "type": "O",
        "x": 5,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 78,
      "highlight": false,
      "next": "J",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower O."
    },
    {
      "step": "6",
      "lessonStage": 6,
      "ticks": 2,
      "next": "J",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "14": "......OO..",
        "15": ".LLLL.OO.L"
      },
      "caption": "Bring in J."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "J",
        "x": 7,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "J",
      "showNext": false,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move J into place."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "J",
        "x": 7,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "J",
        "x": 7,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "J",
      "showNext": false,
      "buttons": [
        "B"
      ],
      "caption": "Press B to rotate J."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "J",
        "x": 7,
        "y": 14,
        "rotation": 3
      },
      "animationFrom": {
        "type": "J",
        "x": 7,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 84,
      "highlight": false,
      "next": "J",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower J."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "14": "......OOJJ",
        "15": ".LLLL.OOJL",
        "16": ".LLLLLLLJL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "O",
          "x": 5,
          "y": 13,
          "rotation": 0
        },
        {
          "type": "J",
          "x": 7,
          "y": 14,
          "rotation": 3
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
            6,
            16
          ],
          [
            7,
            16
          ]
        ],
        "color": "#e7a52b"
      },
      "blink": true,
      "caption": "Notice the motif around the completed pair."
    }
  ],
  "motionVerified": true
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-o-j-dependency"]=situation;})(globalThis);
