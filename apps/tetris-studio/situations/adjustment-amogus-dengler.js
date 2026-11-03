// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Amogus / Dengler thing",
  "chapter": "Adjustments",
  "description": "Stand S above the landing, then tuck J right beneath it.",
  "stack": [
    "......sSSS",
    ".S...sSSSS",
    ".s...SSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "S",
      "x": 3,
      "y": 14,
      "rotation": 0
    },
    "adjusted": {
      "type": "S",
      "x": 4,
      "y": 13,
      "rotation": 1
    },
    "next": {
      "type": "J",
      "x": 3,
      "y": 15,
      "rotation": 1
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
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
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
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
      "caption": "Look ahead: J is next.",
      "ticks": 96,
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
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
      "caption": "Stand S above the landing, then tuck J right beneath it.",
      "ticks": 96,
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
        "x": 4,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next J fits beside the adjusted S.",
      "ticks": 96,
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "S",
        "x": 4,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "J",
        "x": 3,
        "y": 15,
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
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {},
      "caption": "Bring in S."
    },
    {
      "step": "5a",
      "lessonStage": 5,
      "active": {
        "type": "S",
        "x": 4,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "S",
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
      "caption": "Press right to move S into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "S",
        "x": 4,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "S",
        "x": 4,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "J",
      "showNext": true,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate S."
    },
    {
      "step": "5c",
      "lessonStage": 5,
      "active": {
        "type": "S",
        "x": 4,
        "y": 13,
        "rotation": 3
      },
      "animationFrom": {
        "type": "S",
        "x": 4,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 78,
      "highlight": false,
      "next": "J",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower S."
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
        "13": "....S.....",
        "14": "....SS....",
        "15": ".....SLLLL"
      },
      "caption": "Bring in J."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "J",
        "x": 2,
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
        "Left"
      ],
      "caption": "Press left to move J into place."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "J",
        "x": 2,
        "y": 0,
        "rotation": 1
      },
      "animationFrom": {
        "type": "J",
        "x": 2,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "J",
      "showNext": false,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate J."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "J",
        "x": 2,
        "y": 15,
        "rotation": 1
      },
      "animationFrom": {
        "type": "J",
        "x": 2,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "ticks": 90,
      "highlight": false,
      "next": "J",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower J."
    },
    {
      "step": "6d",
      "lessonStage": 6,
      "active": {
        "type": "J",
        "x": 3,
        "y": 15,
        "rotation": 1
      },
      "animationFrom": {
        "type": "J",
        "x": 2,
        "y": 15,
        "rotation": 1
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
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "13": "....S.....",
        "14": "....SS....",
        "15": "....JSLLLL",
        "16": ".L..JLLLLL",
        "17": ".L.JJLLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "S",
          "x": 4,
          "y": 13,
          "rotation": 1
        },
        {
          "type": "J",
          "x": 3,
          "y": 15,
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
            6,
            15
          ],
          [
            5,
            16
          ],
          [
            1,
            17
          ]
        ],
        "color": "#e7a52b"
      },
      "blink": true,
      "caption": "Notice the motif around the completed pair."
    }
  ],
  "section": "Dicey",
  "motionVerified": true
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-amogus-dengler"]=situation;})(globalThis);
