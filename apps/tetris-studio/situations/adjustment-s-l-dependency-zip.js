// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "S for L dependency: Zip (Ori: Z for J dependency)",
  "chapter": "Adjustments",
  "description": "Stand S in the low pocket to create a landing for L.",
  "stack": [
    ".S........",
    ".SS.......",
    ".SSSS.....",
    ".SSSSSSs..",
    ".SSSSSSSss"
  ],
  "adjustment": {
    "default": {
      "type": "S",
      "x": 2,
      "y": 12,
      "rotation": 1
    },
    "adjusted": {
      "type": "S",
      "x": 7,
      "y": 14,
      "rotation": 1
    },
    "next": {
      "type": "L",
      "x": 8,
      "y": 14,
      "rotation": 1
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "L",
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
      "next": "L",
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
        "x": 2,
        "y": 12,
        "rotation": 1,
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
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
        "x": 2,
        "y": 12,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Stand S in the low pocket to create a landing for L.",
      "ticks": 96,
      "next": "L",
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
        "x": 7,
        "y": 14,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next L fits beside the adjusted S.",
      "ticks": 96,
      "next": "L",
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
        "x": 7,
        "y": 14,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "L",
        "x": 8,
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
      "next": "L",
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
        "x": 7,
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
      "next": "L",
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
        "x": 7,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "S",
        "x": 7,
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
      "caption": "Press A to rotate S."
    },
    {
      "step": "5c",
      "lessonStage": 5,
      "active": {
        "type": "S",
        "x": 7,
        "y": 14,
        "rotation": 3
      },
      "animationFrom": {
        "type": "S",
        "x": 7,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 84,
      "highlight": false,
      "next": "L",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower S."
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
        "14": ".LL....S..",
        "15": ".LLLL..SS.",
        "16": ".LLLLLLLS."
      },
      "caption": "Bring in L."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 7,
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
        "Right"
      ],
      "caption": "Press right to move L into place."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 7,
        "y": 0,
        "rotation": 1
      },
      "animationFrom": {
        "type": "L",
        "x": 7,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "L",
      "showNext": false,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate L."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 8,
        "y": 0,
        "rotation": 1
      },
      "animationFrom": {
        "type": "L",
        "x": 7,
        "y": 0,
        "rotation": 1
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
      "step": "6d",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 8,
        "y": 14,
        "rotation": 1
      },
      "animationFrom": {
        "type": "L",
        "x": 8,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "ticks": 84,
      "highlight": false,
      "next": "L",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower L."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "14": ".LL....SLL",
        "15": ".LLLL..SSL",
        "16": ".LLLLLLLSL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "S",
          "x": 7,
          "y": 14,
          "rotation": 1
        },
        {
          "type": "L",
          "x": 8,
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
            16
          ],
          [
            8,
            17
          ],
          [
            9,
            17
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-s-l-dependency-zip"]=situation;})(globalThis);
