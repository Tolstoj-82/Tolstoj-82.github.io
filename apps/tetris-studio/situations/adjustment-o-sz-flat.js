// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "O for S/Z flat: Manners / Wok / Swipe to unlock",
  "chapter": "Adjustments",
  "description": "Shift O inward to leave a flat landing for S.",
  "stack": [
    ".SSSs....S",
    ".SSSSssSSS"
  ],
  "adjustment": {
    "default": {
      "type": "O",
      "x": 6,
      "y": 14,
      "rotation": 0
    },
    "adjusted": {
      "type": "O",
      "x": 4,
      "y": 14,
      "rotation": 0
    },
    "next": {
      "type": "S",
      "x": 7,
      "y": 14,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
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
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "O",
        "x": 6,
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
      "caption": "Look ahead: S is next.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "O",
        "x": 6,
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
      "caption": "Shift O inward to leave a flat landing for S.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "O",
        "x": 4,
        "y": 14,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next S fits beside the adjusted O.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "O",
        "x": 4,
        "y": 14,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "S",
        "x": 7,
        "y": 14,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Place O in the adjusted position.",
      "ticks": 144,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 4,
        "y": 14,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": []
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in S.",
      "ticks": 2,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "15": ".....OO...",
        "16": ".LLLLOO..L"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place S in the space left for it.",
      "ticks": 144,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 7,
        "y": 14,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": []
    },
    {
      "step": "7",
      "lessonStage": 7,
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "O",
          "x": 4,
          "y": 14,
          "rotation": 0
        },
        {
          "type": "S",
          "x": 7,
          "y": 14,
          "rotation": 0
        }
      ],
      "placementBlink": true,
      "blink": true,
      "rows": {
        "15": ".....OO.SS",
        "16": ".LLLLOOSSL"
      }
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "caption": "Notice the motif around the completed pair.",
      "ticks": 96,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ],
  "section": "Good but Situational"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-o-sz-flat"]=situation;})(globalThis);
