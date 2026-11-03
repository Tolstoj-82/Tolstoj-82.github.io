// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Z flat for O: ZO Opener (Ori: S flat for O)",
  "chapter": "Adjustments",
  "description": "Move Z inward and lay it flat, leaving the wall landing for O.",
  "stack": [
    ".SSSSSssss",
    ".SSSSSSSSS"
  ],
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
      "type": "O",
      "x": 7,
      "y": 13,
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
        "type": "Z",
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
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 7,
        "y": 13,
        "rotation": 0,
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
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 7,
        "y": 13,
        "rotation": 0,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Move Z inward and lay it flat, leaving the wall landing for O.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 5,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next O fits beside the adjusted Z.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "Z",
        "x": 5,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "O",
        "x": 7,
        "y": 13,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Place Z in the adjusted position.",
      "ticks": 144,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 5,
        "y": 13,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": []
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
        "14": ".....ZZ...",
        "15": "......ZZ.."
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
        "y": 13,
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
          "type": "Z",
          "x": 5,
          "y": 13,
          "rotation": 0
        },
        {
          "type": "O",
          "x": 7,
          "y": 13,
          "rotation": 0
        }
      ],
      "placementBlink": true,
      "blink": true,
      "rows": {
        "14": ".....ZZ.OO",
        "15": "......ZZOO"
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-z-flat-o-opener"]=situation;})(globalThis);
