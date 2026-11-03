// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "JD spin adjustment",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "T",
      "x": 2,
      "y": 14,
      "rotation": 0
    },
    "adjusted": {
      "type": "T",
      "x": 2,
      "y": 14,
      "rotation": 3
    },
    "next": {
      "type": "O",
      "x": 0,
      "y": 13,
      "rotation": 0
    }
  },
  "description": "Turn T spike-up, lower it beside the overhang, tuck right and spin it into the pocket before placing O.",
  "stack": [
    "....sSSSSS",
    ".....sSSSS",
    ".ss.sSSSSS",
    ".SSsSSSSSS"
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
        "x": 2,
        "y": 14,
        "rotation": 0,
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
        "x": 2,
        "y": 14,
        "rotation": 0,
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
      "caption": "Turn T spike-up, lower it beside the overhang, tuck right and spin it into the pocket before placing O.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "T",
        "x": 2,
        "y": 14,
        "rotation": 3,
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
        "x": 2,
        "y": 14,
        "rotation": 3,
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
      "caption": "First quarter-turn of T.",
      "ticks": 24,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
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
      "step": "4b"
    },
    {
      "caption": "Second quarter-turn: spike up.",
      "ticks": 24,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 2
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
      "step": "4c"
    },
    {
      "caption": "Lower the upright T beside the pocket.",
      "ticks": 144,
      "active": {
        "type": "T",
        "x": 1,
        "y": 14,
        "rotation": 2
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
      "caption": "Press Right once to tuck T beneath the overhang.",
      "ticks": 36,
      "active": {
        "type": "T",
        "x": 2,
        "y": 14,
        "rotation": 2
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "O",
      "buttons": [
        "Right"
      ],
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "5b"
    },
    {
      "caption": "Press A to complete the JD spin.",
      "ticks": 36,
      "active": {
        "type": "T",
        "x": 2,
        "y": 14,
        "rotation": 3
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
      "step": "5c"
    },
    {
      "caption": "Bring in O.",
      "ticks": 2,
      "rows": {
        "14": "...TLLLLLL",
        "15": "...TTLLLLL",
        "16": ".LLTLLLLLL"
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
        "x": 0,
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
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "rows": {
        "14": ".OOTLLLLLL",
        "15": ".OOTTLLLLL"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "T",
          "x": 2,
          "y": 14,
          "rotation": 3
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-jd-spin"]=situation;})(globalThis);
