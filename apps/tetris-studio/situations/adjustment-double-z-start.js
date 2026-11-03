// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Double Z Start (Ori: Double S Start)",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 7,
      "y": 13,
      "rotation": 0
    },
    "adjusted": {
      "type": "Z",
      "x": 5,
      "y": 13,
      "rotation": 0
    },
    "next": {
      "type": "Z",
      "x": 7,
      "y": 13,
      "rotation": 0
    }
  },
  "description": "Place the first Z two columns inward, then the second beside it. Swapping their order gives the same surface with easier early taps.",
  "stack": [
    ".SSSSSssss",
    ".SSSSSSSSS"
  ],
  "piece": "Z",
  "frames": [
    {
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "active": {
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
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 7,
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
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 7,
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
      "caption": "Place the first Z two columns inward, then the second beside it. Swapping their order gives the same surface with easier early taps.",
      "ticks": 96,
      "active": {
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 5,
        "y": 13,
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
      "caption": "Next: Z fits beside the adjusted Z.",
      "ticks": 96,
      "active": {
        "x": 3,
        "y": 0
      },
      "referenceGhost": {
        "type": "Z",
        "x": 5,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "Z",
        "x": 7,
        "y": 13,
        "rotation": 0,
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
      "caption": "Place Z in the adjusted position.",
      "ticks": 144,
      "active": {
        "x": 5,
        "y": 13
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
        "14": ".....ZZ...",
        "15": "......ZZ.."
      },
      "active": {
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
        "x": 7,
        "y": 13
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "Z",
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "6a"
    },
    {
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "rows": {
        "14": ".....ZZZZ.",
        "15": "......ZZZZ"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "Z",
          "x": 5,
          "y": 13,
          "rotation": 0
        },
        {
          "type": "Z",
          "x": 7,
          "y": 13,
          "rotation": 0
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-double-z-start"]=situation;})(globalThis);
