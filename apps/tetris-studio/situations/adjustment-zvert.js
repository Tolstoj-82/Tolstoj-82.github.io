// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Zvert (Ori: Svert)",
  "chapter": "Adjustments",
  "description": "Stand the first Z vertically to leave a landing for the next Z.",
  "stack": [
    "...sSSSSSS",
    "...sSSSSSS",
    "...SSSSSSS",
    ".sSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 0,
      "y": 13,
      "rotation": 0
    },
    "adjusted": {
      "type": "Z",
      "x": 1,
      "y": 13,
      "rotation": 1
    },
    "next": {
      "type": "Z",
      "x": 0,
      "y": 12,
      "rotation": 1
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "next": "Z",
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
      "caption": "Default: the usual landing without this adjustment.",
      "ticks": 96,
      "next": "Z",
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
        "x": 0,
        "y": 13,
        "rotation": 0,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: Z is next.",
      "ticks": 96,
      "next": "Z",
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
        "x": 0,
        "y": 13,
        "rotation": 0,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Stand the first Z vertically to leave a landing for the next Z.",
      "ticks": 96,
      "next": "Z",
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
        "x": 1,
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
      "caption": "The next Z fits beside the adjusted Z.",
      "ticks": 96,
      "next": "Z",
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
        "x": 1,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "Z",
        "x": 0,
        "y": 12,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Place Z in the adjusted position.",
      "ticks": 144,
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 1,
        "y": 13,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ]
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in Z.",
      "ticks": 2,
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "13": "..ZLLLLLLL",
        "14": ".ZZLLLLLLL",
        "15": ".Z.LLLLLLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place Z in the space left for it.",
      "ticks": 144,
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 0,
        "y": 12,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ]
    },
    {
      "step": "6z",
      "lessonStage": 6,
      "caption": "The second piece completes 2 rows. Watch the Game Boy line clear.",
      "clear": true,
      "showNext": false,
      "highlight": false
    },
    {
      "step": "7",
      "lessonStage": 7,
      "caption": "After the clear, the surviving minos and upper stack have dropped.",
      "ticks": 96,
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "blink": true
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "caption": "Notice the motif on the lowered stack.",
      "ticks": 96,
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "motif": {
        "cells": [
          [
            1,
            16
          ]
        ],
        "color": "#e7a52b"
      },
      "blink": true
    }
  ],
  "section": "Good but Situational"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-zvert"]=situation;})(globalThis);
