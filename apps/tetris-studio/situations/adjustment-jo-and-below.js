// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "JO and Below (Ori: LO and Below)",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "J",
      "x": 8,
      "y": 11,
      "rotation": 1
    },
    "adjusted": {
      "type": "J",
      "x": 2,
      "y": 12,
      "rotation": 0
    },
    "next": {
      "type": "O",
      "x": 0,
      "y": 13,
      "rotation": 0
    }
  },
  "description": "Lay J across the shelf and place O beside the left-wall well, leaving four Tetris-ready rows.",
  "stack": [
    "...s.sSSSS",
    "...ssSSSSS",
    ".ssSSSSSSS",
    ".SSSSSSSSS"
  ],
  "frames": [
    {
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "active": {
        "type": "J",
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
        "type": "J",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "J",
        "x": 8,
        "y": 11,
        "rotation": 1,
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
        "type": "J",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "J",
        "x": 8,
        "y": 11,
        "rotation": 1,
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
      "caption": "Lay J across the shelf and place O beside the left-wall well, leaving four Tetris-ready rows.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "J",
        "x": 2,
        "y": 12,
        "rotation": 0,
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
      "caption": "Next: O fits beside the adjusted J.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0
      },
      "referenceGhost": {
        "type": "J",
        "x": 2,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "O",
        "x": 0,
        "y": 13,
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
      "caption": "Place J in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "J",
        "x": 2,
        "y": 12
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "O",
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "Bring in O.",
      "ticks": 2,
      "rows": {
        "13": "..JJJ.....",
        "14": "...LJLLLLL"
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
      "caption": "Lower O along the wall, below the overhang.",
      "ticks": 144,
      "active": {
        "type": "O",
        "x": -1,
        "y": 13
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
      "caption": "Press Right once to tuck O beneath the overhang.",
      "ticks": 36,
      "active": {
        "type": "O",
        "x": 0,
        "y": 13
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "O",
      "buttons": [
        "Right"
      ],
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "6b"
    },
    {
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "rows": {
        "14": ".OOLJLLLLL",
        "15": ".OOLLLLLLL"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "J",
          "x": 2,
          "y": 12,
          "rotation": 0
        },
        {
          "type": "O",
          "x": 0,
          "y": 13,
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-jo-and-below"]=situation;})(globalThis);
