// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "J vert for Z vert (Ori: L vert for S vert)",
  "chapter": "Adjustments",
  "description": "Stand J against the right wall so the vertical Z can settle immediately beside it.",
  "stack": [
    ".SSSSSs...",
    ".SSSSSSsss"
  ],
  "adjustment": {
    "default": {
      "type": "J",
      "x": 7,
      "y": 15,
      "rotation": 2
    },
    "adjusted": {
      "type": "J",
      "x": 8,
      "y": 14,
      "rotation": 1
    },
    "next": {
      "type": "Z",
      "x": 7,
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
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
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
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 7,
        "y": 15,
        "rotation": 2,
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
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 7,
        "y": 15,
        "rotation": 2,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Stand J against the right wall so the vertical Z can settle immediately beside it.",
      "ticks": 96,
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 8,
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
      "caption": "Next: Z fits beside the adjusted J.",
      "ticks": 96,
      "next": "Z",
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
        "x": 8,
        "y": 14,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "Z",
        "x": 7,
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
      "caption": "Place J in the adjusted position.",
      "ticks": 144,
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 8,
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
        "13": "..........",
        "14": ".........J",
        "15": ".........J",
        "16": ".LLLLLL.JJ",
        "17": ".LLLLLLLLL"
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
        "x": 7,
        "y": 14,
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
      "next": "Z",
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
        "13": "..........",
        "14": "........ZJ",
        "15": ".......ZZJ",
        "16": ".LLLLLLZJJ",
        "17": ".LLLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "J",
          "x": 8,
          "y": 14,
          "rotation": 1
        },
        {
          "type": "Z",
          "x": 7,
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
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-j-vert-z-vert"]=situation;})(globalThis);
