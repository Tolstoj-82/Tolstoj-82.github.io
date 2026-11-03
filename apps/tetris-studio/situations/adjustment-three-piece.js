// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "3 piece",
  "chapter": "Adjustments",
  "description": "Tuck L beneath the shelf, then place I one column in from the left wall, leaving four rows ready for a Tetris.",
  "stack": [
    "........SS",
    "...sSSSSSS",
    "....sSSSSS",
    "..ssSSSSSS",
    ".sSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "L",
      "x": 1,
      "y": 14,
      "rotation": 0
    },
    "adjusted": {
      "type": "L",
      "x": 1,
      "y": 13,
      "rotation": 3
    },
    "next": {
      "type": "I",
      "x": 0,
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
      "next": "I",
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
        "x": 1,
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
      "caption": "Look ahead: I is next.",
      "ticks": 96,
      "next": "I",
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
        "x": 1,
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
      "caption": "Stand L upright one row higher and keep the left wall open for I and the follow-up.",
      "ticks": 96,
      "next": "I",
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
        "x": 1,
        "y": 13,
        "rotation": 3,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "Next: I fits beside the adjusted L.",
      "ticks": 96,
      "next": "I",
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
        "x": 1,
        "y": 13,
        "rotation": 3,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "I",
        "x": 0,
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
      "caption": "Lower L beside the shelf, with its foot below the overhang.",
      "ticks": 144,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 0,
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
      "step": "5b",
      "lessonStage": 5,
      "caption": "Press Right once to tuck L underneath the shelf.",
      "ticks": 36,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 1,
        "y": 13,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
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
        "13": "..L.....LL",
        "14": "..LLLLLLLL",
        "15": "..LLLLLLLL",
        "16": "..LLLLLLLL",
        "17": ".LLLLLLLLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place I beside the left-wall well, leaving the well empty.",
      "ticks": 144,
      "next": "I",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 0,
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
        "13": ".IL.....LL",
        "14": ".ILLLLLLLL",
        "15": ".ILLLLLLLL",
        "16": ".ILLLLLLLL",
        "17": ".LLLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "L",
          "x": 1,
          "y": 13,
          "rotation": 3
        },
        {
          "type": "I",
          "x": 0,
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-three-piece"]=situation;})(globalThis);
