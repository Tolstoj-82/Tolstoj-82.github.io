// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Unnamed: S/J",
  "chapter": "Adjustments",
  "description": "Raise S one row on the slope and move it inward, preserving the wall-side space for J.",
  "stack": [
    "...Ss....S",
    "..SSs....s",
    ".SSSSs..sS",
    ".SSSSSs.sS",
    ".SSSSSSsSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "S",
      "x": 6,
      "y": 13,
      "rotation": 1
    },
    "adjusted": {
      "type": "S",
      "x": 5,
      "y": 12,
      "rotation": 1
    },
    "next": {
      "type": "J",
      "x": 6,
      "y": 13,
      "rotation": 3
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
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
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
        "x": 6,
        "y": 13,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: J is next.",
      "ticks": 96,
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
        "x": 6,
        "y": 13,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Raise S one row on the slope and move it inward, preserving the wall-side space for J.",
      "ticks": 96,
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
        "x": 5,
        "y": 12,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "Next: J fits beside the adjusted S.",
      "ticks": 96,
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "S",
        "x": 5,
        "y": 12,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "J",
        "x": 6,
        "y": 13,
        "rotation": 3,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Place S in the adjusted position.",
      "ticks": 144,
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 5,
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
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in J.",
      "ticks": 2,
      "next": "J",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "J",
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
        "12": "...LLS...L",
        "13": "..LLLSS..L",
        "14": ".LLLLLS.LL",
        "15": ".LLLLLL.LL",
        "16": ".LLLLLLLLL",
        "17": ".LLLLLLLLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place J in the space left for it.",
      "ticks": 144,
      "next": "J",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 6,
        "y": 13,
        "rotation": 3
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
      "next": "J",
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
        "12": "...LLS...L",
        "13": "..LLLSSJJL",
        "14": ".LLLLLSJLL",
        "15": ".LLLLLLJLL",
        "16": ".LLLLLLLLL",
        "17": ".LLLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "S",
          "x": 5,
          "y": 12,
          "rotation": 1
        },
        {
          "type": "J",
          "x": 6,
          "y": 13,
          "rotation": 3
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
      "next": "J",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-unnamed-s-j"]=situation;})(globalThis);
