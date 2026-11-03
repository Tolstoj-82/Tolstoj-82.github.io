// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Luke Anderson 26",
  "chapter": "Adjustments",
  "description": "Lay T flat on the slope, then tuck O right underneath its overhang.",
  "stack": [
    ".....sSSSS",
    "....sSSSSS",
    "...sSSSSSS",
    ".sSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "T",
      "x": 1,
      "y": 13,
      "rotation": 3
    },
    "adjusted": {
      "type": "T",
      "x": 2,
      "y": 12,
      "rotation": 0
    },
    "next": {
      "type": "O",
      "x": 0,
      "y": 13,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
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
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
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
        "x": 1,
        "y": 13,
        "rotation": 3,
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
        "x": 1,
        "y": 13,
        "rotation": 3,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Lay T flat on the slope, then tuck O right underneath its overhang.",
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
        "x": 2,
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
      "caption": "Next: O fits beside the adjusted T.",
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
        "x": 2,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "O",
        "x": 0,
        "y": 13,
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
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {},
      "caption": "Bring in T."
    },
    {
      "step": "5a",
      "lessonStage": 5,
      "active": {
        "type": "T",
        "x": 2,
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
      "next": "O",
      "showNext": true,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move T into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "T",
        "x": 2,
        "y": 12,
        "rotation": 0
      },
      "animationFrom": {
        "type": "T",
        "x": 2,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 72,
      "highlight": false,
      "next": "O",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower T."
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
        "13": "..TTTLLLLL",
        "14": "...TLLLLLL"
      },
      "caption": "Bring in O."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "O",
        "x": -1,
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
        "x": -1,
        "y": 13,
        "rotation": 0
      },
      "animationFrom": {
        "type": "O",
        "x": -1,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 78,
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
        "x": 0,
        "y": 13,
        "rotation": 0
      },
      "animationFrom": {
        "type": "O",
        "x": -1,
        "y": 13,
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
        "13": "..TTTLLLLL",
        "14": ".OOTLLLLLL",
        "15": ".OOLLLLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "T",
          "x": 2,
          "y": 12,
          "rotation": 0
        },
        {
          "type": "O",
          "x": 0,
          "y": 13,
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
            5,
            13
          ],
          [
            4,
            14
          ],
          [
            3,
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-luke-anderson"]=situation;})(globalThis);
