// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Significant Other: Sodium thing",
  "chapter": "Adjustments",
  "description": "Lay Z flat to create a square pocket, then tuck O into the new space.",
  "stack": [
    "........s.",
    ".......sSS",
    ".....ssSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 6,
      "y": 13,
      "rotation": 1
    },
    "adjusted": {
      "type": "Z",
      "x": 4,
      "y": 13,
      "rotation": 0
    },
    "next": {
      "type": "O",
      "x": 2,
      "y": 14,
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
        "type": "Z",
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
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 6,
        "y": 13,
        "rotation": 1,
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
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 6,
        "y": 13,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Lay Z flat to create a square pocket, then tuck O into the new space.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 4,
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
      "caption": "The next O fits beside the adjusted Z.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "Z",
        "x": 4,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "O",
        "x": 2,
        "y": 14,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "ticks": 2,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {},
      "caption": "Bring in Z."
    },
    {
      "step": "5a",
      "lessonStage": 5,
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
      "next": "O",
      "showNext": true,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move Z into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "Z",
        "x": 4,
        "y": 13,
        "rotation": 0
      },
      "animationFrom": {
        "type": "Z",
        "x": 4,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 78,
      "highlight": false,
      "next": "O",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower Z."
    },
    {
      "step": "6",
      "lessonStage": 6,
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
        "14": "....ZZ..L.",
        "15": ".....ZZLLL"
      },
      "caption": "Bring in O."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "O",
        "x": 1,
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
      "next": "O",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move O into place."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "O",
        "x": 1,
        "y": 14,
        "rotation": 0
      },
      "animationFrom": {
        "type": "O",
        "x": 1,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 84,
      "highlight": false,
      "next": "O",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower O."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "O",
        "x": 2,
        "y": 14,
        "rotation": 0
      },
      "animationFrom": {
        "type": "O",
        "x": 1,
        "y": 14,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "O",
      "showNext": false,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move O into place."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "14": "....ZZ..L.",
        "15": "...OOZZLLL",
        "16": "...OOLLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "Z",
          "x": 4,
          "y": 13,
          "rotation": 0
        },
        {
          "type": "O",
          "x": 2,
          "y": 14,
          "rotation": 0
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
            8,
            14
          ],
          [
            7,
            15
          ],
          [
            5,
            16
          ],
          [
            6,
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-significant-other"]=situation;})(globalThis);
