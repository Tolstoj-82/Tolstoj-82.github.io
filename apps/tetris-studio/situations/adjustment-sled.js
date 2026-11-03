// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Z flat for L dependency: Sled (Ori: S flat for J dependency)",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 4,
      "y": 12,
      "rotation": 0
    },
    "adjusted": {
      "type": "Z",
      "x": 6,
      "y": 13,
      "rotation": 0
    },
    "next": {
      "type": "L",
      "x": 8,
      "y": 14,
      "rotation": 1
    }
  },
  "description": "Move Z toward the low side before lowering it, creating a shelf for the next upright L.",
  "stack": [
    ".SSSS.....",
    ".SSSSSs...",
    ".SSSSSSss.",
    ".SSSSSSSSs"
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
      "next": "L",
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
        "x": 4,
        "y": 12,
        "rotation": 0,
        "label": "Default"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 2,
      "next": "L",
      "highlight": false,
      "blink": true,
      "step": "2"
    },
    {
      "caption": "Look ahead: L is next.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 4,
        "y": 12,
        "rotation": 0,
        "label": "Default"
      },
      "nextBlink": true,
      "showNext": true,
      "lessonStage": 3,
      "next": "L",
      "highlight": false,
      "blink": true,
      "step": "3"
    },
    {
      "caption": "Move Z toward the low side before lowering it, creating a shelf for the next upright L.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 6,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "L",
      "highlight": false,
      "blink": true,
      "step": "4"
    },
    {
      "caption": "Next: L fits beside the adjusted Z.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "referenceGhost": {
        "type": "Z",
        "x": 6,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "L",
        "x": 8,
        "y": 14,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "L",
      "highlight": false,
      "blink": true,
      "step": "4a"
    },
    {
      "caption": "Place Z in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 6,
        "y": 13
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "L",
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "Bring in L.",
      "ticks": 2,
      "rows": {
        "14": ".LLLL.ZZ..",
        "15": ".LLLLLLZZ."
      },
      "active": {
        "type": "L",
        "x": 3,
        "y": 0
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "L",
      "highlight": false,
      "step": "6"
    },
    {
      "caption": "Place L in the space left for it.",
      "ticks": 144,
      "active": {
        "type": "L",
        "x": 8,
        "y": 14,
        "rotation": 1
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "L",
      "buttons": [
        "A"
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
        "14": ".LLLL.ZZLL",
        "15": ".LLLLLLZZL",
        "16": ".LLLLLLLLL"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "Z",
          "x": 6,
          "y": 13,
          "rotation": 0
        },
        {
          "type": "L",
          "x": 8,
          "y": 14,
          "rotation": 1
        }
      ],
      "placementBlink": true,
      "lessonStage": 7,
      "next": "L",
      "highlight": false,
      "blink": true,
      "step": "7"
    },
    {
      "caption": "Notice the motif again around the completed pair.",
      "ticks": 96,
      "showNext": false,
      "lessonStage": 7,
      "next": "L",
      "highlight": false,
      "blink": true,
      "step": "7a",
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-sled"]=situation;})(globalThis);
