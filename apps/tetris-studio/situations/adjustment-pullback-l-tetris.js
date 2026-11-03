// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Pullback L (for tetris)",
  "chapter": "Adjustments",
  "description": "Pull J inward to preserve the I well. Move I over before lowering it, particularly at high speed.",
  "stack": [
    "...SSSS...",
    "...SSSSS..",
    "..sSSSSSS.",
    "..sSSSSSSS",
    ".sSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "J",
      "x": -1,
      "y": 8,
      "rotation": 3
    },
    "adjusted": {
      "type": "J",
      "x": 0,
      "y": 6,
      "rotation": 3
    },
    "next": {
      "type": "I",
      "x": -1,
      "y": 14,
      "rotation": 1
    }
  },
  "frames": [
    {
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "1",
      "caption": "The motif: the stack edge that supports the adjustment.",
      "ticks": 96,
      "motif": true,
      "blink": true,
      "lessonStage": 1,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      }
    },
    {
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "2",
      "caption": "Default: J would normally go here. Compare the space it leaves for the next piece.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": -1,
        "y": 8,
        "rotation": 3,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 2
    },
    {
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "3",
      "caption": "Look ahead: I is next. The default placement blocks its intended landing space.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": -1,
        "y": 8,
        "rotation": 3,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true,
      "lessonStage": 3
    },
    {
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "4",
      "caption": "Adjusted: Pull J back onto the ledge so I can reach the deep wall well for a tetris.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 0,
        "y": 6,
        "rotation": 3,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 4
    },
    {
      "step": "4a",
      "caption": "Next: I will fit here beside the adjusted J.",
      "ticks": 96,
      "next": "I",
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
        "x": 0,
        "y": 6,
        "rotation": 3,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "I",
        "x": -1,
        "y": 14,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 4
    },
    {
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "5",
      "caption": "Place J in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "J",
        "x": 0,
        "y": 6,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ],
      "lessonStage": 5
    },
    {
      "next": "I",
      "showNext": false,
      "highlight": false,
      "step": "6",
      "caption": "Bring in I and move it across to the wall before lowering it. Make sure it can get over the stack.",
      "ticks": 2,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "rows": {
        "6": ".JJLLLLL..",
        "7": ".JLLLLLLL.",
        "8": ".JLLLLLLLL"
      },
      "lessonStage": 6
    },
    {
      "next": "I",
      "showNext": false,
      "highlight": false,
      "step": "6a",
      "caption": "Turn I upright and lower it into the space left by J.",
      "ticks": 144,
      "active": {
        "type": "I",
        "x": -1,
        "y": 14,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ],
      "lessonStage": 6
    },
    {
      "step": "6b",
      "caption": "The I completes four rows: tetris. Watch the original Game Boy line-clear animation.",
      "clear": true,
      "next": "I",
      "showNext": false,
      "highlight": false,
      "lessonStage": 6
    },
    {
      "next": "I",
      "showNext": false,
      "highlight": false,
      "step": "7",
      "caption": "After the tetris, the surviving J and the stack have dropped four rows.",
      "ticks": 96,
      "placementHighlights": [
        {
          "type": "J",
          "x": 0,
          "y": 10,
          "rotation": 3
        }
      ],
      "placementBlink": true,
      "blink": true,
      "lessonStage": 7
    },
    {
      "next": "I",
      "showNext": false,
      "highlight": false,
      "step": "7a",
      "caption": "The motif has also moved down four rows. Notice the lower stack after the tetris.",
      "ticks": 96,
      "motif": {
        "cells": [
          [
            2,
            11
          ],
          [
            2,
            12
          ],
          [
            1,
            13
          ]
        ]
      },
      "blink": true,
      "lessonStage": 7
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-pullback-l-tetris"]=situation;})(globalThis);
