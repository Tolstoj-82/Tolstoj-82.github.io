// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Dengler: Choke thing",
  "chapter": "Adjustments",
  "description": "Stand T beside the pocket to leave a vertical landing for S.",
  "stack": [
    ".SSSSS....",
    ".SSSSs....",
    ".SSSSs...s",
    ".SSSSSs.sS",
    ".SSSSSSsSS"
  ],
  "adjustment": {
    "default": {
      "type": "T",
      "x": 6,
      "y": 14,
      "rotation": 0
    },
    "adjusted": {
      "type": "T",
      "x": 7,
      "y": 13,
      "rotation": 3
    },
    "next": {
      "type": "S",
      "x": 6,
      "y": 14,
      "rotation": 1
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "S",
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
      "caption": "Default: the usual landing without this adjustment.",
      "ticks": 96,
      "next": "S",
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
        "x": 6,
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
      "caption": "Look ahead: S is next.",
      "ticks": 96,
      "next": "S",
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
        "x": 6,
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
      "caption": "Stand T beside the pocket to leave a vertical landing for S.",
      "ticks": 96,
      "next": "S",
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
        "x": 7,
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
      "caption": "The next S fits beside the adjusted T.",
      "ticks": 96,
      "next": "S",
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
        "x": 7,
        "y": 13,
        "rotation": 3,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "S",
        "x": 6,
        "y": 14,
        "rotation": 1,
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
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 7,
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
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in S.",
      "ticks": 2,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "13": ".LLLLL..T.",
        "14": ".LLLLL..TT",
        "15": ".LLLLL..TL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place S in the landing left for it.",
      "ticks": 144,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 6,
        "y": 14,
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
      "next": "S",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "T",
          "x": 7,
          "y": 13,
          "rotation": 3
        },
        {
          "type": "S",
          "x": 6,
          "y": 14,
          "rotation": 1
        }
      ],
      "placementBlink": true,
      "blink": true,
      "rows": {
        "14": ".LLLLLS.TT",
        "15": ".LLLLLSSTL",
        "16": ".LLLLLLSLL"
      }
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "caption": "Notice the motif around the completed pair.",
      "ticks": 96,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ],
  "section": "Good but Situational"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-dengler-choke"]=situation;})(globalThis);
