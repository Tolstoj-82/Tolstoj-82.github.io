// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "L pullback for Z/T (Ori: J pullback for S/T)",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "L",
      "x": 1,
      "y": 13,
      "rotation": 0
    },
    "adjusted": {
      "type": "L",
      "x": 3,
      "y": 12,
      "rotation": 0
    },
    "next": {
      "type": "Z",
      "x": 1,
      "y": 13,
      "rotation": 1
    },
    "alternatives": [
      {
        "type": "Z",
        "x": 1,
        "y": 13,
        "rotation": 1
      },
      {
        "type": "T",
        "x": 0,
        "y": 13,
        "rotation": 0
      }
    ]
  },
  "description": "Pull L back onto the higher shelf, leaving a wall-side landing for the next Z or T.",
  "stack": [
    "....ssSSSS",
    "..ssSSSSSS",
    ".sSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "frames": [
    {
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0
      },
      "showNext": true,
      "lessonStage": 1,
      "next": "Z",
      "highlight": false,
      "blink": true,
      "step": "1",
      "motif": true
    },
    {
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "L",
        "x": 1,
        "y": 13,
        "rotation": 0,
        "label": "Default"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 2,
      "next": "Z",
      "highlight": false,
      "blink": true,
      "step": "2"
    },
    {
      "caption": "Look ahead: Z is next.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "L",
        "x": 1,
        "y": 13,
        "rotation": 0,
        "label": "Default"
      },
      "nextBlink": true,
      "showNext": true,
      "lessonStage": 3,
      "next": "Z",
      "highlight": false,
      "blink": true,
      "step": "3"
    },
    {
      "caption": "Pull L back onto the higher shelf, leaving a wall-side landing for the next Z or T.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "L",
        "x": 3,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "Z",
      "highlight": false,
      "blink": true,
      "step": "4"
    },
    {
      "caption": "Next: Z fits beside the adjusted L.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0
      },
      "referenceGhost": {
        "type": "L",
        "x": 3,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "Z",
        "x": 1,
        "y": 13,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "Z",
      "highlight": false,
      "blink": true,
      "step": "4a"
    },
    {
      "caption": "Place L in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "L",
        "x": 3,
        "y": 12
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "Z",
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "Bring in Z.",
      "ticks": 2,
      "rows": {
        "13": "...LLL....",
        "14": "...LLLLLLL"
      },
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "Z",
      "highlight": false,
      "step": "6"
    },
    {
      "caption": "Place Z in the space left for it.",
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 1,
        "y": 13,
        "rotation": 1
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "Z",
      "buttons": [
        "B"
      ],
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "6a"
    },
    {
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "rows": {
        "13": "..ZLLL....",
        "14": ".ZZLLLLLLL",
        "15": ".ZLLLLLLLL"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "L",
          "x": 3,
          "y": 12,
          "rotation": 0
        },
        {
          "type": "Z",
          "x": 1,
          "y": 13,
          "rotation": 1
        }
      ],
      "placementBlink": true,
      "lessonStage": 7,
      "next": "Z",
      "highlight": false,
      "blink": true,
      "step": "7"
    },
    {
      "caption": "Notice the motif again around the completed pair.",
      "ticks": 96,
      "showNext": false,
      "lessonStage": 7,
      "next": "Z",
      "highlight": false,
      "blink": true,
      "step": "7a",
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-l-pullback-zt"]=situation;})(globalThis);
