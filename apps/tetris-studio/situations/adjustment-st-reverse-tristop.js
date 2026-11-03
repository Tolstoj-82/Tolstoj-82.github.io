// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "ST reverse Tristop: Nenu thing (Ori: ZT reverse Tristop)",
  "chapter": "Adjustments",
  "description": "Lay S over the pocket, then spin T and tuck it left underneath.",
  "stack": [
    ".........S",
    "........SS",
    ".s.....SSS",
    ".Ss....SSS",
    ".SSsssSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "S",
      "x": 1,
      "y": 12,
      "rotation": 1
    },
    "adjusted": {
      "type": "S",
      "x": 2,
      "y": 12,
      "rotation": 0
    },
    "next": {
      "type": "T",
      "x": 3,
      "y": 14,
      "rotation": 2
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
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
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
        "x": 1,
        "y": 12,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: T is next.",
      "ticks": 96,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
        "x": 1,
        "y": 12,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Lay S over the pocket, then spin T and tuck it left underneath.",
      "ticks": 96,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
        "x": 2,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next T fits beside the adjusted S.",
      "ticks": 96,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "S",
        "x": 2,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "T",
        "x": 3,
        "y": 14,
        "rotation": 2,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Place S in the adjusted position.",
      "ticks": 144,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 2,
        "y": 12,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": []
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in T.",
      "ticks": 2,
      "next": "T",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "13": "...SS...LL",
        "14": ".LSS...LLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Lower T upright beside the S overhang.",
      "ticks": 144,
      "next": "T",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 4,
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
      "step": "6b",
      "lessonStage": 6,
      "caption": "Press B to turn T beneath the overhang.",
      "ticks": 36,
      "next": "T",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 4,
        "y": 13,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ]
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "caption": "Let gravity lower T one row.",
      "ticks": 36,
      "next": "T",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 4,
        "y": 14,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": []
    },
    {
      "step": "6d",
      "lessonStage": 6,
      "caption": "Press Left once to finish the Spuck beneath S.",
      "ticks": 36,
      "next": "T",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 14,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
      ]
    },
    {
      "step": "7",
      "lessonStage": 7,
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "next": "T",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "S",
          "x": 2,
          "y": 12,
          "rotation": 0
        },
        {
          "type": "T",
          "x": 3,
          "y": 14,
          "rotation": 2
        }
      ],
      "placementBlink": true,
      "blink": true,
      "rows": {
        "14": ".LSST..LLL",
        "15": ".LLTTT.LLL"
      }
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "caption": "Notice the motif around the completed pair.",
      "ticks": 96,
      "next": "T",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ],
  "section": "Good but Situational"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-st-reverse-tristop"]=situation;})(globalThis);
