// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Double Bar",
  "chapter": "Adjustments",
  "description": "Cross the first I to the two-wide channel, then place the second I beside it.",
  "stack": [
    "........sS",
    ".SSSSs..sS",
    ".SSSSs..sS",
    ".SSSSs..sS"
  ],
  "adjustment": {
    "default": {
      "type": "I",
      "x": 8,
      "y": 10,
      "rotation": 1
    },
    "adjusted": {
      "type": "I",
      "x": 6,
      "y": 14,
      "rotation": 1
    },
    "next": {
      "type": "I",
      "x": 5,
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
        "type": "I",
        "x": 3,
        "y": -1,
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
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "ghost": {
        "type": "I",
        "x": 8,
        "y": 10,
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
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "ghost": {
        "type": "I",
        "x": 8,
        "y": 10,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Cross the first I to the two-wide channel, then place the second I beside it.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "ghost": {
        "type": "I",
        "x": 6,
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
      "caption": "Next: I fits beside the adjusted I.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "I",
        "x": 6,
        "y": 14,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "I",
        "x": 5,
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
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "rows": {},
      "caption": "Bring in I."
    },
    {
      "step": "5a",
      "lessonStage": 5,
      "active": {
        "type": "I",
        "x": 6,
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
      "showNext": true,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move I into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "I",
        "x": 6,
        "y": -1,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": 6,
        "y": -1,
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
      "caption": "Press A to rotate I."
    },
    {
      "step": "5c",
      "lessonStage": 5,
      "active": {
        "type": "I",
        "x": 6,
        "y": 14,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": 6,
        "y": -1,
        "rotation": 3
      },
      "animate": true,
      "ticks": 84,
      "highlight": false,
      "next": "I",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower I."
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
        "14": ".......ILL",
        "15": ".LLLLL.ILL",
        "16": ".LLLLL.ILL",
        "17": ".LLLLL.ILL"
      },
      "caption": "Bring in I.",
      "tileOverrides": [
        {
          "x": 7,
          "y": 14,
          "tile": 128
        },
        {
          "x": 7,
          "y": 15,
          "tile": 136
        },
        {
          "x": 7,
          "y": 16,
          "tile": 136
        },
        {
          "x": 7,
          "y": 17,
          "tile": 137
        }
      ]
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": 5,
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
        "Right"
      ],
      "caption": "Press right to move I into place.",
      "tileOverrides": [
        {
          "x": 7,
          "y": 14,
          "tile": 128
        },
        {
          "x": 7,
          "y": 15,
          "tile": 136
        },
        {
          "x": 7,
          "y": 16,
          "tile": 136
        },
        {
          "x": 7,
          "y": 17,
          "tile": 137
        }
      ]
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": 5,
        "y": -1,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": 5,
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
      "caption": "Press A to rotate I.",
      "tileOverrides": [
        {
          "x": 7,
          "y": 14,
          "tile": 128
        },
        {
          "x": 7,
          "y": 15,
          "tile": 136
        },
        {
          "x": 7,
          "y": 16,
          "tile": 136
        },
        {
          "x": 7,
          "y": 17,
          "tile": 137
        }
      ]
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": 5,
        "y": 14,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": 5,
        "y": -1,
        "rotation": 3
      },
      "animate": true,
      "ticks": 84,
      "highlight": false,
      "next": "I",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower I.",
      "tileOverrides": [
        {
          "x": 7,
          "y": 14,
          "tile": 128
        },
        {
          "x": 7,
          "y": 15,
          "tile": 136
        },
        {
          "x": 7,
          "y": 16,
          "tile": 136
        },
        {
          "x": 7,
          "y": 17,
          "tile": 137
        }
      ]
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "14": "......IILL",
        "15": ".LLLLLIILL",
        "16": ".LLLLLIILL",
        "17": ".LLLLLIILL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "I",
          "x": 6,
          "y": 14,
          "rotation": 1
        },
        {
          "type": "I",
          "x": 5,
          "y": 14,
          "rotation": 1
        }
      ],
      "caption": "Notice the resulting stack.",
      "tileOverrides": [
        {
          "x": 7,
          "y": 14,
          "tile": 128
        },
        {
          "x": 7,
          "y": 15,
          "tile": 136
        },
        {
          "x": 7,
          "y": 16,
          "tile": 136
        },
        {
          "x": 7,
          "y": 17,
          "tile": 137
        },
        {
          "x": 6,
          "y": 14,
          "tile": 128
        },
        {
          "x": 6,
          "y": 15,
          "tile": 136
        },
        {
          "x": 6,
          "y": 16,
          "tile": 136
        },
        {
          "x": 6,
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
            8,
            14
          ],
          [
            5,
            15
          ],
          [
            8,
            15
          ],
          [
            5,
            16
          ],
          [
            8,
            16
          ],
          [
            5,
            17
          ],
          [
            8,
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-double-bar"]=situation;})(globalThis);
