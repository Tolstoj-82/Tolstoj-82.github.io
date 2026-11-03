// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Z flat for S tuck: Jigsaw (Ori: S flat for Z tuck)",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 5,
      "y": 13,
      "rotation": 1
    },
    "adjusted": {
      "type": "Z",
      "x": 3,
      "y": 13,
      "rotation": 0
    },
    "next": {
      "type": "S",
      "x": 1,
      "y": 14,
      "rotation": 0
    }
  },
  "description": "Lay Z flat, then lower S along the wall and tuck it right underneath the overhang.",
  "stack": [
    "......sSSS",
    "...sssSSSS",
    ".ssSSSSSSS"
  ],
  "frames": [
    {
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "showNext": true,
      "lessonStage": 1,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "1",
      "motif": true
    },
    {
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 5,
        "y": 13,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 2,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "2"
    },
    {
      "caption": "Look ahead: S is next.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 5,
        "y": 13,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "showNext": true,
      "lessonStage": 3,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "3"
    },
    {
      "caption": "Lay Z flat, then lower S along the wall and tuck it right underneath the overhang.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 3,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "4"
    },
    {
      "caption": "Next: S fits beside the adjusted Z.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "referenceGhost": {
        "type": "Z",
        "x": 3,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "S",
        "x": 1,
        "y": 14,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "4a"
    },
    {
      "caption": "Place Z in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 13
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "S",
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "Bring in S.",
      "ticks": 2,
      "rows": {
        "14": "...ZZ.....",
        "15": "....ZZLLLL"
      },
      "active": {
        "type": "S",
        "x": 3,
        "y": 0
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "S",
      "highlight": false,
      "step": "6"
    },
    {
      "caption": "Lower S along the wall, below the overhang.",
      "ticks": 144,
      "active": {
        "type": "S",
        "x": 0,
        "y": 14
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "S",
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "6a"
    },
    {
      "caption": "Press Right once to tuck S beneath the overhang.",
      "ticks": 36,
      "active": {
        "type": "S",
        "x": 1,
        "y": 14
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "S",
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
        "15": "..SSZZLLLL",
        "16": ".SSLLLLLLL"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "Z",
          "x": 3,
          "y": 13,
          "rotation": 0
        },
        {
          "type": "S",
          "x": 1,
          "y": 14,
          "rotation": 0
        }
      ],
      "placementBlink": true,
      "lessonStage": 7,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "7"
    },
    {
      "caption": "Notice the motif again around the completed pair.",
      "ticks": 96,
      "showNext": false,
      "lessonStage": 7,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "7a",
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-jigsaw"]=situation;})(globalThis);
