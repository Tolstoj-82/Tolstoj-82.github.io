// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Water: T for L/J",
  "chapter": "Adjustments",
  "description": "Keep T horizontal until the next hook is revealed, then stand it on the side that leaves the matching landing.",
  "stack": [
    ".SSs...sSS",
    ".SSs...sSS",
    ".SSs.s.sSS"
  ],
  "adjustment": {
    "default": {
      "type": "T",
      "x": 4,
      "y": 14,
      "rotation": 0
    },
    "adjusted": {
      "type": "T",
      "x": 5,
      "y": 15,
      "rotation": 1
    },
    "next": {
      "type": "J",
      "x": 3,
      "y": 15,
      "rotation": 3
    },
    "alternatives": [
      {
        "type": "J",
        "x": 3,
        "y": 15,
        "rotation": 3
      },
      {
        "type": "L",
        "x": 5,
        "y": 15,
        "rotation": 1,
        "adjusted": {
          "type": "T",
          "x": 3,
          "y": 15,
          "rotation": 3
        }
      }
    ]
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "next": "J",
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
      "next": "J",
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
        "x": 4,
        "y": 14,
        "rotation": 0,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: J is next.",
      "ticks": 96,
      "next": "J",
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
        "x": 4,
        "y": 14,
        "rotation": 0,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Keep T horizontal until the next hook is revealed, then stand it on the side that leaves the matching landing.",
      "ticks": 96,
      "next": "J",
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
        "x": 5,
        "y": 15,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "Next: J fits beside the adjusted T.",
      "ticks": 96,
      "next": "J",
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
        "x": 5,
        "y": 15,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "J",
        "x": 3,
        "y": 15,
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
      "next": "J",
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
      "next": "J",
      "showNext": true,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move T into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
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
      "next": "J",
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
        "x": 5,
        "y": 15,
        "rotation": 1
      },
      "animationFrom": {
        "type": "T",
        "x": 5,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "ticks": 90,
      "highlight": false,
      "next": "J",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower T."
    },
    {
      "step": "6",
      "lessonStage": 6,
      "ticks": 2,
      "next": "J",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "15": ".LLL..TLLL",
        "16": ".LLL.TTLLL",
        "17": ".LLL.LTLLL"
      },
      "caption": "Bring in J."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 3
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
      "next": "J",
      "showNext": false,
      "buttons": [
        "B"
      ],
      "caption": "Press B to rotate J."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "J",
        "x": 3,
        "y": 15,
        "rotation": 3
      },
      "animationFrom": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 90,
      "highlight": false,
      "next": "J",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower J."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "15": ".LLLJJTLLL",
        "16": ".LLLJTTLLL",
        "17": ".LLLJLTLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "T",
          "x": 5,
          "y": 15,
          "rotation": 1
        },
        {
          "type": "J",
          "x": 3,
          "y": 15,
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
            3,
            15
          ],
          [
            7,
            15
          ],
          [
            3,
            16
          ],
          [
            7,
            16
          ],
          [
            3,
            17
          ],
          [
            5,
            17
          ],
          [
            7,
            17
          ]
        ],
        "color": "#e7a52b"
      },
      "blink": true,
      "caption": "Notice the motif around the completed pair."
    }
  ],
  "motionVerified": true
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-water-t-hooks"]=situation;})(globalThis);
