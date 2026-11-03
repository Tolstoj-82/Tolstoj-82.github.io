// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Null Adjustment",
  "chapter": "Adjustments",
  "description": "Adjust L for J: the two placements produce the same shape as the default sequence.",
  "stack": [
    ".....sSSSS",
    "...ssSSSSS",
    ".ssSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "L",
      "x": 0,
      "y": 13,
      "rotation": 3
    },
    "adjusted": {
      "type": "L",
      "x": 2,
      "y": 13,
      "rotation": 0
    },
    "next": {
      "type": "J",
      "x": 0,
      "y": 13,
      "rotation": 3
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "J",
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
      "next": "J",
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
        "x": 0,
        "y": 13,
        "rotation": 3,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: J is next.",
      "ticks": 96,
      "next": "J",
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
        "x": 0,
        "y": 13,
        "rotation": 3,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Adjust L for J: the two placements produce the same shape as the default sequence.",
      "ticks": 96,
      "next": "J",
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
        "x": 2,
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
      "caption": "The next J fits beside the adjusted L.",
      "ticks": 96,
      "next": "J",
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
        "x": 2,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "J",
        "x": 0,
        "y": 13,
        "rotation": 3,
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
      "next": "J",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 2,
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
      "caption": "Bring in J.",
      "ticks": 2,
      "next": "J",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "14": "..LLLLLLLL",
        "15": "..LLLLLLLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place J in the landing left for it.",
      "ticks": 144,
      "next": "J",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 0,
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
      "step": "7",
      "lessonStage": 7,
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "next": "J",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "L",
          "x": 2,
          "y": 13,
          "rotation": 0
        },
        {
          "type": "J",
          "x": 0,
          "y": 13,
          "rotation": 3
        }
      ],
      "placementBlink": true,
      "blink": true,
      "rows": {
        "13": ".JJ.......",
        "14": ".JLLLLLLLL",
        "15": ".JLLLLLLLL"
      }
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "caption": "Notice the motif around the completed pair.",
      "ticks": 96,
      "next": "J",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ],
  "section": "Memes/Anti-Adjustments"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-null"]=situation;})(globalThis);
