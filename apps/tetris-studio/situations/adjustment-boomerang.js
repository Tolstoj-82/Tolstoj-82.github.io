// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Boomerang",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "T",
      "x": 7,
      "y": 16,
      "rotation": 2
    },
    "adjusted": {
      "type": "T",
      "x": 6,
      "y": 15,
      "rotation": 1
    },
    "next": {
      "type": "O",
      "x": 7,
      "y": 15,
      "rotation": 0
    }
  },
  "description": "Stand T beside the slope to leave a two-wide landing for O, making the lower surface flat.",
  "stack": [
    ".SSSSs....",
    ".SSSSSs..."
  ],
  "frames": [
    {
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "showNext": true,
      "lessonStage": 1,
      "next": "O",
      "highlight": false,
      "blink": true,
      "step": "1",
      "motif": true
    },
    {
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "T",
        "x": 7,
        "y": 16,
        "rotation": 2,
        "label": "Default"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 2,
      "next": "O",
      "highlight": false,
      "blink": true,
      "step": "2"
    },
    {
      "caption": "Look ahead: O is next.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "T",
        "x": 7,
        "y": 16,
        "rotation": 2,
        "label": "Default"
      },
      "nextBlink": true,
      "showNext": true,
      "lessonStage": 3,
      "next": "O",
      "highlight": false,
      "blink": true,
      "step": "3"
    },
    {
      "caption": "Stand T beside the slope to leave a two-wide landing for O, making the lower surface flat.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "T",
        "x": 6,
        "y": 15,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "O",
      "highlight": false,
      "blink": true,
      "step": "4"
    },
    {
      "caption": "Next: O fits beside the adjusted T.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "referenceGhost": {
        "type": "T",
        "x": 6,
        "y": 15,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "O",
        "x": 7,
        "y": 15,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "O",
      "highlight": false,
      "blink": true,
      "step": "4a"
    },
    {
      "caption": "Place T in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "T",
        "x": 6,
        "y": 15,
        "rotation": 1
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "O",
      "buttons": [
        "A"
      ],
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "Bring in O.",
      "ticks": 2,
      "rows": {
        "15": ".......T..",
        "16": ".LLLLLTT..",
        "17": ".LLLLLLT.."
      },
      "active": {
        "type": "O",
        "x": 3,
        "y": 0
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "O",
      "highlight": false,
      "step": "6"
    },
    {
      "caption": "Place O in the space left for it.",
      "ticks": 144,
      "active": {
        "type": "O",
        "x": 7,
        "y": 15
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "O",
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "6a"
    },
    {
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "rows": {
        "16": ".LLLLLTTOO",
        "17": ".LLLLLLTOO"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "T",
          "x": 6,
          "y": 15,
          "rotation": 1
        },
        {
          "type": "O",
          "x": 7,
          "y": 15,
          "rotation": 0
        }
      ],
      "placementBlink": true,
      "lessonStage": 7,
      "next": "O",
      "highlight": false,
      "blink": true,
      "step": "7"
    },
    {
      "caption": "Notice the motif again around the completed pair.",
      "ticks": 96,
      "showNext": false,
      "lessonStage": 7,
      "next": "O",
      "highlight": false,
      "blink": true,
      "step": "7a",
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-boomerang"]=situation;})(globalThis);
