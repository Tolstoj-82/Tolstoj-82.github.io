// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "T flip for L spawn: Twister (Ori: T flip for J spawn)",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "T",
      "x": 3,
      "y": 13,
      "rotation": 0
    },
    "adjusted": {
      "type": "T",
      "x": 3,
      "y": 13,
      "rotation": 1
    },
    "next": {
      "type": "L",
      "x": 5,
      "y": 12,
      "rotation": 0
    }
  },
  "description": "Stand T on its side to leave a clean landing for L in its spawning orientation.",
  "stack": [
    ".........S",
    ".S......sS",
    ".Ss...ssSS",
    ".SSs.sSSSS",
    ".SSSsSSSSS",
    ".SSSSSSSSS"
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
        "type": "T",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "T",
        "x": 3,
        "y": 13,
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
        "type": "T",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "T",
        "x": 3,
        "y": 13,
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
      "caption": "Stand T on its side to leave a clean landing for L in its spawning orientation.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "T",
        "x": 3,
        "y": 13,
        "rotation": 1,
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
      "caption": "Next: L fits beside the adjusted T.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "referenceGhost": {
        "type": "T",
        "x": 3,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "L",
        "x": 5,
        "y": 12,
        "rotation": 0,
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
      "caption": "Place T in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "T",
        "x": 3,
        "y": 13,
        "rotation": 1
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "L",
      "buttons": [
        "A"
      ],
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "Bring in L.",
      "ticks": 2,
      "rows": {
        "13": ".L..T...LL",
        "14": ".LLTT.LLLL",
        "15": ".LLLTLLLLL"
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
        "x": 5,
        "y": 12
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "L",
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "6a"
    },
    {
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "rows": {
        "13": ".L..TLLLLL",
        "14": ".LLTTLLLLL"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "T",
          "x": 3,
          "y": 13,
          "rotation": 1
        },
        {
          "type": "L",
          "x": 5,
          "y": 12,
          "rotation": 0
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-twister"]=situation;})(globalThis);
