// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "L for T: Hanging Feet Dangler (Ori: J for T)",
  "chapter": "Adjustments",
  "description": "Turn L so its foot hangs above the slope, then tuck the upright T right beneath it.",
  "stack": [
    ".....sSSSS",
    ".....sSSSS",
    "...ssSSSSS",
    "..sSSSSSSS",
    ".sSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "L",
      "x": 2,
      "y": 12,
      "rotation": 0
    },
    "adjusted": {
      "type": "L",
      "x": 2,
      "y": 12,
      "rotation": 2
    },
    "next": {
      "type": "T",
      "x": 0,
      "y": 13,
      "rotation": 3
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
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
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 2,
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
      "caption": "Look ahead: T is next.",
      "ticks": 96,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 2,
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
      "caption": "Turn L so its foot hangs above the slope, then tuck the upright T right beneath it.",
      "ticks": 96,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 2,
        "y": 12,
        "rotation": 2,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "Next: T fits beside the adjusted L.",
      "ticks": 96,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "L",
        "x": 2,
        "y": 12,
        "rotation": 2,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "T",
        "x": 0,
        "y": 13,
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
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {},
      "caption": "Bring in L."
    },
    {
      "step": "5a",
      "lessonStage": 5,
      "active": {
        "type": "L",
        "x": 2,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": true,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move L into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "L",
        "x": 2,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "L",
        "x": 2,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": true,
      "buttons": [
        "B"
      ],
      "caption": "Press B to rotate L."
    },
    {
      "step": "5c",
      "lessonStage": 5,
      "active": {
        "type": "L",
        "x": 2,
        "y": 0,
        "rotation": 2
      },
      "animationFrom": {
        "type": "L",
        "x": 2,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": true,
      "buttons": [
        "B"
      ],
      "caption": "Press B to rotate L."
    },
    {
      "step": "5d",
      "lessonStage": 5,
      "active": {
        "type": "L",
        "x": 2,
        "y": 12,
        "rotation": 2
      },
      "animationFrom": {
        "type": "L",
        "x": 2,
        "y": 0,
        "rotation": 2
      },
      "animate": true,
      "ticks": 72,
      "highlight": false,
      "next": "T",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower L."
    },
    {
      "step": "6",
      "lessonStage": 6,
      "ticks": 2,
      "next": "T",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "12": "....LLLLLL",
        "13": "..LLLLLLLL"
      },
      "caption": "Bring in T."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 0,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move T into place."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 0,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "T",
        "x": 0,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [
        "B"
      ],
      "caption": "Press B to rotate T."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": -1,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "T",
        "x": 0,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move T into place."
    },
    {
      "step": "6d",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": -1,
        "y": 13,
        "rotation": 3
      },
      "animationFrom": {
        "type": "T",
        "x": -1,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 78,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower T."
    },
    {
      "step": "6e",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 0,
        "y": 13,
        "rotation": 3
      },
      "animationFrom": {
        "type": "T",
        "x": -1,
        "y": 13,
        "rotation": 3
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move T into place."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "12": "....LLLLLL",
        "13": ".TLLLLLLLL",
        "14": ".TTLLLLLLL",
        "15": ".TLLLLLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "L",
          "x": 2,
          "y": 12,
          "rotation": 2
        },
        {
          "type": "T",
          "x": 0,
          "y": 13,
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
            5,
            12
          ],
          [
            5,
            13
          ],
          [
            3,
            14
          ],
          [
            4,
            14
          ],
          [
            2,
            15
          ],
          [
            1,
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-l-for-t-dangler"]=situation;})(globalThis);
