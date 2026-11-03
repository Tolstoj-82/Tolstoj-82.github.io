// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Joseph Saelee 2018 Adjustment",
  "chapter": "Adjustments",
  "description": "Turn T onto its side to make a two-wide landing for O. The default downward T would obstruct it.",
  "stack": [
    ".Ss....SS.",
    ".Ss....sSS",
    ".SSss.sSSS",
    ".SSSSsSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "T",
      "x": 4,
      "y": 14,
      "rotation": 0
    },
    "adjusted": {
      "type": "T",
      "x": 4,
      "y": 14,
      "rotation": 3
    },
    "next": {
      "type": "O",
      "x": 2,
      "y": 13,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "next": "O",
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
      "next": "O",
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
        "x": 4,
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
      "caption": "Look ahead: O is next.",
      "ticks": 96,
      "next": "O",
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
        "x": 4,
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
      "caption": "Turn T onto its side to make a two-wide landing for O. The default downward T would obstruct it.",
      "ticks": 96,
      "next": "O",
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
        "x": 4,
        "y": 14,
        "rotation": 3,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "Next: O fits beside the adjusted T.",
      "ticks": 96,
      "next": "O",
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
        "x": 4,
        "y": 14,
        "rotation": 3,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "O",
        "x": 2,
        "y": 13,
        "rotation": 0,
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
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 4,
        "y": 14,
        "rotation": 3
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
      "caption": "Bring in O.",
      "ticks": 2,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "O",
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
        "14": ".LL..T.LL.",
        "15": ".LL..TTLLL",
        "16": ".LLLLTLLLL",
        "17": ".LLLLLLLLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place O in the space left for it.",
      "ticks": 144,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 2,
        "y": 13,
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
      "next": "O",
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
        "14": ".LLOOT.LL.",
        "15": ".LLOOTTLLL",
        "16": ".LLLLTLLLL",
        "17": ".LLLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "T",
          "x": 4,
          "y": 14,
          "rotation": 3
        },
        {
          "type": "O",
          "x": 2,
          "y": 13,
          "rotation": 0
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
      "next": "O",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-joseph-saelee"]=situation;})(globalThis);
