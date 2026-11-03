// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "T pullback for I dependency",
  "chapter": "Adjustments",
  "description": "Pull T back onto the slope instead of filling the wall-side channel needed by I.",
  "stack": [
    ".SSSSSs...",
    ".SSSSSSs..",
    ".SSSSSSSs.",
    ".SSSSSSSSs"
  ],
  "adjustment": {
    "default": {
      "type": "T",
      "x": 8,
      "y": 14,
      "rotation": 1
    },
    "adjusted": {
      "type": "T",
      "x": 7,
      "y": 13,
      "rotation": 1
    },
    "next": {
      "type": "I",
      "x": 8,
      "y": 13,
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
      "next": "I",
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
      "caption": "Look ahead: I is next.",
      "ticks": 96,
      "next": "I",
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
      "caption": "Pull T back onto the slope instead of filling the wall-side channel needed by I.",
      "ticks": 96,
      "next": "I",
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
        "x": 7,
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
      "caption": "Next: I fits beside the adjusted T.",
      "ticks": 96,
      "next": "I",
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
        "x": 7,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "I",
        "x": 8,
        "y": 13,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Place T in the adjusted position.",
      "ticks": 144,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 7,
        "y": 13,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ]
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in I.",
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
        "0": "..........",
        "1": "..........",
        "2": "..........",
        "3": "..........",
        "4": "..........",
        "5": "..........",
        "6": "..........",
        "7": "..........",
        "8": "..........",
        "9": "..........",
        "10": "..........",
        "11": "..........",
        "12": "..........",
        "13": "........T.",
        "14": ".LLLLLLTT.",
        "15": ".LLLLLLLT.",
        "16": ".LLLLLLLL.",
        "17": ".LLLLLLLLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place I in the space left for it.",
      "ticks": 144,
      "next": "I",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 8,
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
      "step": "7",
      "lessonStage": 7,
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "next": "I",
      "showNext": false,
      "highlight": false,
      "rows": {
        "0": "..........",
        "1": "..........",
        "2": "..........",
        "3": "..........",
        "4": "..........",
        "5": "..........",
        "6": "..........",
        "7": "..........",
        "8": "..........",
        "9": "..........",
        "10": "..........",
        "11": "..........",
        "12": "..........",
        "13": "........TI",
        "14": ".LLLLLLTTI",
        "15": ".LLLLLLLTI",
        "16": ".LLLLLLLLI",
        "17": ".LLLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "T",
          "x": 7,
          "y": 13,
          "rotation": 1
        },
        {
          "type": "I",
          "x": 8,
          "y": 13,
          "rotation": 1
        }
      ],
      "placementBlink": true,
      "blink": true
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "caption": "Notice the motif again around the completed pair.",
      "ticks": 96,
      "next": "I",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-t-pullback-i"]=situation;})(globalThis);
