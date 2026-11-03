// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Thomas Jefferson 1",
  "chapter": "Adjustments",
  "description": "Stand T beside the isolated edge, then tuck L right beneath it.",
  "stack": [
    "....sSSSSS",
    "....sSSSSS",
    ".sSsSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "T",
      "x": 1,
      "y": 14,
      "rotation": 2
    },
    "adjusted": {
      "type": "T",
      "x": 2,
      "y": 13,
      "rotation": 1
    },
    "next": {
      "type": "L",
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
      "next": "L",
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
      "next": "L",
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
      "caption": "Look ahead: L is next.",
      "ticks": 96,
      "next": "L",
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
      "caption": "Stand T beside the isolated edge, then tuck L right beneath it.",
      "ticks": 96,
      "next": "L",
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
      "caption": "Next: L fits beside the adjusted T.",
      "ticks": 96,
      "next": "L",
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
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "L",
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
      "next": "L",
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
      "next": "L",
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
        "y": 0,
        "rotation": 1
      },
      "animationFrom": {
        "type": "T",
        "x": 2,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "L",
      "showNext": true,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate T."
    },
    {
      "step": "5c",
      "lessonStage": 5,
      "active": {
        "type": "T",
        "x": 2,
        "y": 13,
        "rotation": 1
      },
      "animationFrom": {
        "type": "T",
        "x": 2,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "ticks": 78,
      "highlight": false,
      "next": "L",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower T."
    },
    {
      "step": "6",
      "lessonStage": 6,
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
        "13": "...T......",
        "14": "..TTLLLLLL",
        "15": "...TLLLLLL"
      },
      "caption": "Bring in L."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 0,
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
      "next": "L",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move L into place."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 0,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "L",
        "x": 0,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "L",
      "showNext": false,
      "buttons": [
        "B"
      ],
      "caption": "Press B to rotate L."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": -1,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "L",
        "x": 0,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "L",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move L into place."
    },
    {
      "step": "6d",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": -1,
        "y": 13,
        "rotation": 3
      },
      "animationFrom": {
        "type": "L",
        "x": -1,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 78,
      "highlight": false,
      "next": "L",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower L."
    },
    {
      "step": "6e",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 0,
        "y": 13,
        "rotation": 3
      },
      "animationFrom": {
        "type": "L",
        "x": -1,
        "y": 13,
        "rotation": 3
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "L",
      "showNext": false,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move L into place."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "13": ".L.T......",
        "14": ".LTTLLLLLL",
        "15": ".LLTLLLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "T",
          "x": 2,
          "y": 13,
          "rotation": 1
        },
        {
          "type": "L",
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
            4,
            14
          ],
          [
            4,
            15
          ],
          [
            1,
            16
          ],
          [
            3,
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-thomas-jefferson-1"]=situation;})(globalThis);
