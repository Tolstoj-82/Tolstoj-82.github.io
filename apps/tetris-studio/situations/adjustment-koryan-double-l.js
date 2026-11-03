// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "[Koryan] Double L (Ori: Double J)",
  "chapter": "Adjustments",
  "description": "Stand the first L in the notch so the next L can fit one column beside it.",
  "stack": [
    ".........S",
    ".........S",
    "......sSSS",
    "......sSSS",
    ".SSs..sSSS",
    ".SSs.sSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "L",
      "x": 6,
      "y": 12,
      "rotation": 2
    },
    "adjusted": {
      "type": "L",
      "x": 3,
      "y": 15,
      "rotation": 1
    },
    "next": {
      "type": "L",
      "x": 4,
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
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
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
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 6,
        "y": 12,
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
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 6,
        "y": 12,
        "rotation": 2,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Stand the first L in the notch so the next L can fit one column beside it.",
      "ticks": 96,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 3,
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
      "caption": "Next: L fits beside the adjusted L.",
      "ticks": 96,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "L",
        "x": 3,
        "y": 15,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "L",
        "x": 4,
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
      "caption": "Place L in the adjusted position.",
      "ticks": 144,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 15,
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
      "caption": "Bring in L.",
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
        "12": ".........L",
        "13": ".........L",
        "14": "......LLLL",
        "15": "...LL.LLLL",
        "16": ".LLLL.LLLL",
        "17": ".LLLLLLLLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place L in the space left for it.",
      "ticks": 144,
      "next": "L",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 4,
        "y": 14,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ]
    },
    {
      "step": "7",
      "lessonStage": 7,
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "next": "L",
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
        "12": ".........L",
        "13": ".........L",
        "14": "....LLLLLL",
        "15": "...LLLLLLL",
        "16": ".LLLLLLLLL",
        "17": ".LLLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "L",
          "x": 3,
          "y": 15,
          "rotation": 1
        },
        {
          "type": "L",
          "x": 4,
          "y": 14,
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
      "next": "L",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-koryan-double-l"]=situation;})(globalThis);
