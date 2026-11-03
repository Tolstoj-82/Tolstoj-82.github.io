// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "J upright for Z: Situp (Ori: L upright for S)",
  "chapter": "Adjustments",
  "description": "Stand J upright to leave a vertical landing for the next Z.",
  "stack": [
    "......sSSS",
    "......sSSS",
    ".s...sSSSS",
    ".SsssSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "J",
      "x": 2,
      "y": 14,
      "rotation": 2
    },
    "adjusted": {
      "type": "J",
      "x": 2,
      "y": 13,
      "rotation": 1
    },
    "next": {
      "type": "Z",
      "x": 4,
      "y": 13,
      "rotation": 1
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "Z",
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
      "next": "Z",
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
        "x": 2,
        "y": 14,
        "rotation": 2,
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
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 2,
        "y": 14,
        "rotation": 2,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Stand J upright to leave a vertical landing for the next Z.",
      "ticks": 96,
      "next": "Z",
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
        "x": 2,
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
      "caption": "The next Z fits beside the adjusted J.",
      "ticks": 96,
      "next": "Z",
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
        "x": 2,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "Z",
        "x": 4,
        "y": 13,
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
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {},
      "caption": "Bring in J."
    },
    {
      "step": "5a",
      "lessonStage": 5,
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
      "next": "Z",
      "showNext": true,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move J into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
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
      "next": "Z",
      "showNext": true,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate J."
    },
    {
      "step": "5c",
      "lessonStage": 5,
      "active": {
        "type": "J",
        "x": 2,
        "y": 13,
        "rotation": 1
      },
      "animationFrom": {
        "type": "J",
        "x": 2,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "ticks": 78,
      "highlight": false,
      "next": "Z",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower J."
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
        "13": "...J..LLLL",
        "14": "...J..LLLL",
        "15": ".LJJ.LLLLL"
      },
      "caption": "Bring in Z."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "Z",
        "x": 4,
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
        "x": 4,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "Z",
        "x": 4,
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
        "x": 4,
        "y": 13,
        "rotation": 3
      },
      "animationFrom": {
        "type": "Z",
        "x": 4,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 78,
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
        "13": "...J.ZLLLL",
        "14": "...JZZLLLL",
        "15": ".LJJZLLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "J",
          "x": 2,
          "y": 13,
          "rotation": 1
        },
        {
          "type": "Z",
          "x": 4,
          "y": 13,
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
            13
          ],
          [
            6,
            14
          ],
          [
            1,
            15
          ],
          [
            5,
            15
          ],
          [
            2,
            16
          ],
          [
            3,
            16
          ],
          [
            4,
            16
          ]
        ],
        "color": "#e7a52b"
      },
      "blink": true,
      "caption": "Notice the motif around the completed pair."
    }
  ],
  "section": "Good but Situational",
  "motionVerified": true
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-j-upright-z"]=situation;})(globalThis);
