// Mirrored Game Boy adjustment. Default checked with the free-play AI.
(function(root){const situation={
  "title": "L doubletuck (Ori: J doubletuck)",
  "chapter": "Adjustments",
  "description": "Place J above the pocket, then tuck L right, turn it, and tuck right again.",
  "stack": [
    "........s.",
    "........ss",
    ".........S",
    ".SSSSSSsSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "J",
      "x": 6,
      "y": 14,
      "rotation": 2
    },
    "adjusted": {
      "type": "J",
      "x": 7,
      "y": 11,
      "rotation": 0
    },
    "next": {
      "type": "L",
      "x": 6,
      "y": 13,
      "rotation": 3
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
      "next": "L",
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
        "x": 6,
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
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 6,
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
      "caption": "Place J above the pocket, then tuck L right, turn it, and tuck right again.",
      "ticks": 96,
      "next": "L",
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
        "x": 7,
        "y": 11,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next L fits beside the adjusted J.",
      "ticks": 96,
      "next": "L",
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
        "x": 7,
        "y": 11,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "L",
        "x": 6,
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
      "next": "L",
      "showNext": true,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move J into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "J",
        "x": 7,
        "y": 11,
        "rotation": 0
      },
      "animationFrom": {
        "type": "J",
        "x": 7,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 66,
      "highlight": false,
      "next": "L",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower J."
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
        "12": ".......JJJ",
        "13": "........LJ"
      },
      "caption": "Bring in L."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 4,
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
        "x": 4,
        "y": 13,
        "rotation": 0
      },
      "animationFrom": {
        "type": "L",
        "x": 4,
        "y": 0,
        "rotation": 0
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
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 5,
        "y": 13,
        "rotation": 0
      },
      "animationFrom": {
        "type": "L",
        "x": 4,
        "y": 13,
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
      "step": "6d",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 5,
        "y": 13,
        "rotation": 3
      },
      "animationFrom": {
        "type": "L",
        "x": 5,
        "y": 13,
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
      "step": "6e",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 6,
        "y": 13,
        "rotation": 3
      },
      "animationFrom": {
        "type": "L",
        "x": 5,
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
        "12": ".......JJJ",
        "13": ".......LLJ",
        "14": ".......LLL",
        "15": ".......LLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "J",
          "x": 7,
          "y": 11,
          "rotation": 0
        },
        {
          "type": "L",
          "x": 6,
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
            8,
            13
          ],
          [
            8,
            14
          ],
          [
            9,
            14
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
  "section": "Dicey",
  "motionVerified": true
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-l-doubletuck"]=situation;})(globalThis);
