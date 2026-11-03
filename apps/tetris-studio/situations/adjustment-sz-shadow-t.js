// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "S/Z Shadow T adjustment",
  "chapter": "Adjustments",
  "description": "Keep Z out of the deep notch so S can fill it. Together they leave a gentler surface.",
  "stack": [
    "........SS",
    ".......sSS",
    ".......sSS",
    ".Ss...sSSS",
    ".SSs.sSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 4,
      "y": 15,
      "rotation": 1
    },
    "adjusted": {
      "type": "Z",
      "x": 5,
      "y": 14,
      "rotation": 1
    },
    "next": {
      "type": "S",
      "x": 3,
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
      "next": "S",
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
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
      "ticks": 96,
      "next": "S",
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
        "x": 4,
        "y": 15,
        "rotation": 1,
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
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 4,
        "y": 15,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Keep Z out of the deep notch so S can fill it. Together they leave a gentler surface.",
      "ticks": 96,
      "next": "S",
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
        "x": 5,
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
      "caption": "Next: S fits beside the adjusted Z.",
      "ticks": 96,
      "next": "S",
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
        "x": 5,
        "y": 14,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "S",
        "x": 3,
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
      "caption": "Place Z in the adjusted position.",
      "ticks": 144,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 5,
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
        "13": "........LL",
        "14": "......ZLLL",
        "15": ".....ZZLLL",
        "16": ".LL..ZLLLL",
        "17": ".LLL.LLLLL"
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
        "x": 3,
        "y": 15,
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
      "next": "S",
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
        "13": "........LL",
        "14": "......ZLLL",
        "15": "...S.ZZLLL",
        "16": ".LLSSZLLLL",
        "17": ".LLLSLLLLL"
      },
      "placementHighlights": [
        {
          "type": "Z",
          "x": 5,
          "y": 14,
          "rotation": 1
        },
        {
          "type": "S",
          "x": 3,
          "y": 15,
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
      "next": "S",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-sz-shadow-t"]=situation;})(globalThis);
