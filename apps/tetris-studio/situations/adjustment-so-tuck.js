// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "SO tuck: Zuke Anderson (Ori: ZO tuck)",
  "chapter": "Adjustments",
  "description": "Lay S above the pocket, then tuck O right beneath it.",
  "stack": [
    "....sSSSSS",
    "...sSSSSSS",
    "...sSSSSSS",
    ".ssSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "S",
      "x": 1,
      "y": 13,
      "rotation": 1
    },
    "adjusted": {
      "type": "S",
      "x": 2,
      "y": 11,
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
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "O",
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
      "next": "O",
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
        "x": 1,
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
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
        "x": 1,
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
      "caption": "Lay S above the pocket, then tuck O right beneath it.",
      "ticks": 96,
      "next": "O",
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
      "caption": "The next O fits beside the adjusted S.",
      "ticks": 96,
      "next": "O",
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
        "x": 2,
        "y": 11,
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
        "x": 2,
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
      "next": "O",
      "showNext": true,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move S into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "S",
        "x": 2,
        "y": 11,
        "rotation": 0
      },
      "animationFrom": {
        "type": "S",
        "x": 2,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 66,
      "highlight": false,
      "next": "O",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower S."
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
        "12": "...SS.....",
        "13": "..SSLLLLLL"
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
        "12": "...SS.....",
        "13": "..SSLLLLLL",
        "14": ".OOLLLLLLL",
        "15": ".OOLLLLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "S",
          "x": 2,
          "y": 11,
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
            4,
            13
          ],
          [
            3,
            14
          ],
          [
            3,
            15
          ],
          [
            1,
            16
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
  "section": "Good but Situational",
  "motionVerified": true
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-so-tuck"]=situation;})(globalThis);
