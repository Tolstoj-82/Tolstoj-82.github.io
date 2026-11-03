// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Basic T-spin adjustment",
  "chapter": "Adjustments",
  "description": "Lay Z across the tower, then lower the upright T and spin it into the notch.",
  "stack": [
    ".SSSSs.sss",
    ".SSSSSsSSS",
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
      "x": 7,
      "y": 12,
      "rotation": 0
    },
    "next": {
      "type": "T",
      "x": 5,
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
      "next": "T",
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
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
      "ticks": 96,
      "next": "T",
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
      "caption": "Look ahead: T is next.",
      "ticks": 96,
      "next": "T",
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
      "caption": "Lay Z across the tower, then lower the upright T and spin it into the notch.",
      "ticks": 96,
      "next": "T",
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
        "x": 7,
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
      "caption": "Next: T fits beside the adjusted Z.",
      "ticks": 96,
      "next": "T",
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
        "x": 7,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "T",
        "x": 5,
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
      "next": "T",
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
        "x": 7,
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
      "next": "T",
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
        "x": 7,
        "y": 12,
        "rotation": 0
      },
      "animationFrom": {
        "type": "Z",
        "x": 7,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 72,
      "highlight": false,
      "next": "T",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower Z."
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
        "13": ".......ZZ.",
        "14": "........ZZ"
      },
      "caption": "Bring in T."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 5,
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
        "Right"
      ],
      "caption": "Press right to move T into place."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 5,
        "y": 0,
        "rotation": 1
      },
      "animationFrom": {
        "type": "T",
        "x": 5,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate T."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 5,
        "y": 13,
        "rotation": 1
      },
      "animationFrom": {
        "type": "T",
        "x": 5,
        "y": 0,
        "rotation": 1
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
      "step": "6d",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 5,
        "y": 13,
        "rotation": 0
      },
      "animationFrom": {
        "type": "T",
        "x": 5,
        "y": 13,
        "rotation": 1
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
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "13": ".......ZZ.",
        "14": ".....TTTZZ",
        "15": ".LLLLLTLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "Z",
          "x": 7,
          "y": 12,
          "rotation": 0
        },
        {
          "type": "T",
          "x": 5,
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
            15
          ],
          [
            7,
            15
          ],
          [
            8,
            15
          ],
          [
            9,
            15
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
  "motionVerified": true
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-basic-tspin"]=situation;})(globalThis);
