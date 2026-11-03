// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Nenu thing",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "I",
      "x": 8,
      "y": 10,
      "rotation": 1
    },
    "adjusted": {
      "type": "I",
      "x": 5,
      "y": 12,
      "rotation": 0
    },
    "next": {
      "type": "T",
      "x": 3,
      "y": 14,
      "rotation": 0
    }
  },
  "description": "Lay I across the higher shelf, then lower the upright T and spin it into the notch.",
  "stack": [
    ".........s",
    "......sssS",
    ".SSs.sSSSS",
    ".SSSsSSSSS"
  ],
  "frames": [
    {
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "showNext": true,
      "lessonStage": 1,
      "highlight": false,
      "blink": true,
      "step": "1",
      "motif": true
    },
    {
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "ghost": {
        "type": "I",
        "x": 8,
        "y": 10,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 2,
      "highlight": false,
      "blink": true,
      "step": "2"
    },
    {
      "caption": "Look ahead: T is next.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "ghost": {
        "type": "I",
        "x": 8,
        "y": 10,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "showNext": true,
      "lessonStage": 3,
      "highlight": false,
      "blink": true,
      "step": "3"
    },
    {
      "caption": "Lay I across the higher shelf, then lower the upright T and spin it into the notch.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "ghost": {
        "type": "I",
        "x": 5,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "highlight": false,
      "blink": true,
      "step": "4"
    },
    {
      "caption": "Next: T fits beside the adjusted I.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "referenceGhost": {
        "type": "I",
        "x": 5,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "T",
        "x": 3,
        "y": 14,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "highlight": false,
      "blink": true,
      "step": "4a"
    },
    {
      "step": "5",
      "lessonStage": 5,
      "ticks": 2,
      "next": "T",
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
      "next": "T",
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
        "x": 5,
        "y": 12,
        "rotation": 0
      },
      "animationFrom": {
        "type": "I",
        "x": 5,
        "y": -1,
        "rotation": 0
      },
      "animate": true,
      "ticks": 72,
      "highlight": false,
      "next": "T",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower I."
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
        "14": ".....IIIIL"
      },
      "caption": "Bring in T.",
      "tileOverrides": [
        {
          "x": 5,
          "y": 14,
          "tile": 138
        },
        {
          "x": 6,
          "y": 14,
          "tile": 139
        },
        {
          "x": 7,
          "y": 14,
          "tile": 139
        },
        {
          "x": 8,
          "y": 14,
          "tile": 143
        }
      ]
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 1
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
        "A"
      ],
      "caption": "Press A to rotate T.",
      "tileOverrides": [
        {
          "x": 5,
          "y": 14,
          "tile": 138
        },
        {
          "x": 6,
          "y": 14,
          "tile": 139
        },
        {
          "x": 7,
          "y": 14,
          "tile": 139
        },
        {
          "x": 8,
          "y": 14,
          "tile": 143
        }
      ]
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 3,
        "y": 14,
        "rotation": 1
      },
      "animationFrom": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "ticks": 84,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower T.",
      "tileOverrides": [
        {
          "x": 5,
          "y": 14,
          "tile": 138
        },
        {
          "x": 6,
          "y": 14,
          "tile": 139
        },
        {
          "x": 7,
          "y": 14,
          "tile": 139
        },
        {
          "x": 8,
          "y": 14,
          "tile": 143
        }
      ]
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 3,
        "y": 14,
        "rotation": 0
      },
      "animationFrom": {
        "type": "T",
        "x": 3,
        "y": 14,
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
      "caption": "Press B to rotate T.",
      "tileOverrides": [
        {
          "x": 5,
          "y": 14,
          "tile": 138
        },
        {
          "x": 6,
          "y": 14,
          "tile": 139
        },
        {
          "x": 7,
          "y": 14,
          "tile": 139
        },
        {
          "x": 8,
          "y": 14,
          "tile": 143
        }
      ]
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "14": ".....IIIIL",
        "15": "...TTTLLLL",
        "16": ".LLLTLLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "I",
          "x": 5,
          "y": 12,
          "rotation": 0
        },
        {
          "type": "T",
          "x": 3,
          "y": 14,
          "rotation": 0
        }
      ],
      "caption": "Notice the resulting stack.",
      "tileOverrides": [
        {
          "x": 5,
          "y": 14,
          "tile": 138
        },
        {
          "x": 6,
          "y": 14,
          "tile": 139
        },
        {
          "x": 7,
          "y": 14,
          "tile": 139
        },
        {
          "x": 8,
          "y": 14,
          "tile": 143
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
            9,
            14
          ],
          [
            6,
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
            3,
            16
          ],
          [
            5,
            16
          ],
          [
            4,
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-nenu"]=situation;})(globalThis);
