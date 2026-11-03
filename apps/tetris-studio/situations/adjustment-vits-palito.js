// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "VITS: Palito Tuck",
  "chapter": "Adjustments",
  "description": "Place L above the shelf, then lower I beside it and tuck the long bar right underneath the overhang.",
  "stack": [
    ".......SSS",
    "....SSSSSS",
    "...sSSSSSS",
    "...sSSSSSS",
    "..sSSSSSSS",
    "..SSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "L",
      "x": 0,
      "y": 15,
      "rotation": 1
    },
    "adjusted": {
      "type": "L",
      "x": 1,
      "y": 13,
      "rotation": 1
    },
    "next": {
      "type": "I",
      "x": 0,
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
      "next": "I",
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
      "next": "I",
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
        "x": 0,
        "y": 15,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: I is next.",
      "ticks": 96,
      "next": "I",
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
        "x": 0,
        "y": 15,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Place L above the shelf, then lower I beside it and tuck the long bar right underneath the overhang.",
      "ticks": 96,
      "next": "I",
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
        "x": 1,
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
      "caption": "Next: I fits beside the adjusted L.",
      "ticks": 96,
      "next": "I",
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
        "x": 1,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "I",
        "x": 0,
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
      "next": "I",
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
        "x": 1,
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
      "next": "I",
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
        "x": 1,
        "y": 0,
        "rotation": 1
      },
      "animationFrom": {
        "type": "L",
        "x": 1,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "I",
      "showNext": true,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate L."
    },
    {
      "step": "5c",
      "lessonStage": 5,
      "active": {
        "type": "L",
        "x": 1,
        "y": 13,
        "rotation": 1
      },
      "animationFrom": {
        "type": "L",
        "x": 1,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "ticks": 78,
      "highlight": false,
      "next": "I",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower L."
    },
    {
      "step": "6",
      "lessonStage": 6,
      "ticks": 2,
      "next": "I",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "rows": {
        "13": ".LL.LLLLLL",
        "14": "..LLLLLLLL",
        "15": "..LLLLLLLL"
      },
      "caption": "Bring in I."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 0
      },
      "animationFrom": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "I",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move I into place."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "I",
      "showNext": false,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate I."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": -1,
        "y": -1,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 3
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "I",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move I into place."
    },
    {
      "step": "6d",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": -1,
        "y": 14,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": -1,
        "y": -1,
        "rotation": 3
      },
      "animate": true,
      "ticks": 84,
      "highlight": false,
      "next": "I",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower I."
    },
    {
      "step": "6e",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": 0,
        "y": 14,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": -1,
        "y": 14,
        "rotation": 3
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "I",
      "showNext": false,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move I into place."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "13": ".LL.LLLLLL",
        "14": ".ILLLLLLLL",
        "15": ".ILLLLLLLL",
        "16": ".ILLLLLLLL",
        "17": ".ILLLLLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "L",
          "x": 1,
          "y": 13,
          "rotation": 1
        },
        {
          "type": "I",
          "x": 0,
          "y": 14,
          "rotation": 1
        }
      ],
      "caption": "Notice the resulting stack.",
      "tileOverrides": [
        {
          "x": 1,
          "y": 14,
          "tile": 128
        },
        {
          "x": 1,
          "y": 15,
          "tile": 136
        },
        {
          "x": 1,
          "y": 16,
          "tile": 136
        },
        {
          "x": 1,
          "y": 17,
          "tile": 137
        }
      ],
      "placementBlink": true
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "ticks": 96,
      "motif": {
        "cells": [
          [
            3,
            14
          ],
          [
            3,
            15
          ],
          [
            2,
            16
          ]
        ],
        "color": "#e7a52b"
      },
      "blink": true,
      "caption": "Notice the motif around the completed pair."
    }
  ],
  "motionVerified": true,
  "section": "VITS"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-vits-palito"]=situation;})(globalThis);
