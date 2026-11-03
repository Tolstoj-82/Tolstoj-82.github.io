// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "L tap over for O: Stepback (Ori: J tap over for O)",
  "chapter": "Adjustments",
  "description": "Move L inward to leave a landing for O at the wall.",
  "stack": [
    "....Ssssss",
    "..SSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "L",
      "x": 7,
      "y": 13,
      "rotation": 2
    },
    "adjusted": {
      "type": "L",
      "x": 5,
      "y": 13,
      "rotation": 2
    },
    "next": {
      "type": "O",
      "x": 7,
      "y": 12,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
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
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 7,
        "y": 13,
        "rotation": 2,
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
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 7,
        "y": 13,
        "rotation": 2,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Move L inward to leave a landing for O at the wall.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 5,
        "y": 13,
        "rotation": 2,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next O fits beside the adjusted L.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "L",
        "x": 5,
        "y": 13,
        "rotation": 2,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "O",
        "x": 7,
        "y": 12,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Place L in the adjusted position.",
      "ticks": 144,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 5,
        "y": 13,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
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
        "13": ".......L..",
        "14": ".....LLL.."
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place O in the landing left for it.",
      "ticks": 144,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 7,
        "y": 12,
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
      "placementHighlights": [
        {
          "type": "L",
          "x": 5,
          "y": 13,
          "rotation": 2
        },
        {
          "type": "O",
          "x": 7,
          "y": 12,
          "rotation": 0
        }
      ],
      "placementBlink": true,
      "blink": true,
      "rows": {
        "13": ".......LOO",
        "14": ".....LLLOO"
      }
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "caption": "Notice the motif around the completed pair.",
      "ticks": 96,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ],
  "section": "Good but Situational"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-l-tap-over-o"]=situation;})(globalThis);
