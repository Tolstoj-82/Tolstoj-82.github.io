// NES J-next Waterfall mirrored horizontally for Game Boy.
(function(root){const situation={
  "title": "Waterfall: tall water",
  "chapter": "Adjustments",
  "description": "Mirrored NES J-next Waterfall: move I from column 10 to column 8, then place L in columns 9 and 10 without holes.",
  "stack": [
    "......S...",
    ".....Ss...",
    "...SSSs...",
    "..SSSSs.s.",
    ".SSSSSs.s."
  ],
  "adjustment": {
    "default": {
      "type": "I",
      "x": 8,
      "y": 14,
      "rotation": 1
    },
    "adjusted": {
      "type": "I",
      "x": 6,
      "y": 14,
      "rotation": 1
    },
    "next": {
      "type": "L",
      "x": 8,
      "y": 15,
      "rotation": 1
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
      "next": "L",
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
        "y": 14,
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
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "ghost": {
        "type": "I",
        "x": 8,
        "y": 14,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Bring I across to the side of the slope, leaving room for the next hook at the wall.",
      "ticks": 96,
      "next": "L",
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
      "caption": "Next: L fits beside the adjusted I.",
      "ticks": 96,
      "next": "L",
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
        "type": "L",
        "x": 8,
        "y": 15,
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
      "next": "L",
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
      "next": "L",
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
      "next": "L",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower I."
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
        "14": ".....LLI..",
        "15": "...LLLLI..",
        "16": "..LLLLLIL.",
        "17": ".LLLLLLIL."
      },
      "caption": "Bring in L.",
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
      "caption": "Press right to move L into place.",
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
      "caption": "Press A to rotate L.",
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
      "caption": "Press right to move L into place.",
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
      "step": "6d",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 8,
        "y": 15,
        "rotation": 1
      },
      "animationFrom": {
        "type": "L",
        "x": 8,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "ticks": 90,
      "highlight": false,
      "next": "L",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower L.",
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
        "14": ".....LLI..",
        "15": "...LLLLILL",
        "16": "..LLLLLILL",
        "17": ".LLLLLLILL"
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
          "type": "L",
          "x": 8,
          "y": 15,
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
            6,
            14
          ],
          [
            6,
            15
          ],
          [
            6,
            16
          ],
          [
            8,
            16
          ],
          [
            6,
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-waterfall"]=situation;})(globalThis);
