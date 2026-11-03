// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "JS Tristop thing (Ori: LZ Tristop thing)",
  "chapter": "Adjustments",
  "description": "Lay J on the shelf, then spin and tuck S underneath it.",
  "stack": [
    ".....sSSSS",
    ".....sSSSS",
    "...ssSSSSS",
    ".ssSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "J",
      "x": 3,
      "y": 12,
      "rotation": 3
    },
    "adjusted": {
      "type": "J",
      "x": 2,
      "y": 12,
      "rotation": 0
    },
    "next": {
      "type": "S",
      "x": 1,
      "y": 13,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
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
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 3,
        "y": 12,
        "rotation": 3,
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
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 3,
        "y": 12,
        "rotation": 3,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Lay J on the shelf, then spin and tuck S underneath it.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
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
      "caption": "The next S fits beside the adjusted J.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "J",
        "x": 2,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "S",
        "x": 1,
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
      "caption": "Place J in the adjusted position.",
      "ticks": 144,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
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
        "13": "..JJJLLLLL",
        "14": "....JLLLLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Lower S vertically beside the overhang.",
      "ticks": 144,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 0,
        "y": 13,
        "rotation": 1
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
      "caption": "Press A or B to spin S flat beneath J.",
      "ticks": 36,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 0,
        "y": 13,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ],
      "buttonOptions": [
        "B",
        "A"
      ]
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "caption": "Press Right once to finish the Spuck underneath J.",
      "ticks": 36,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 1,
        "y": 13,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
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
          "type": "J",
          "x": 2,
          "y": 12,
          "rotation": 0
        },
        {
          "type": "S",
          "x": 1,
          "y": 13,
          "rotation": 0
        }
      ],
      "placementBlink": true,
      "blink": true,
      "rows": {
        "14": "..SSJLLLLL",
        "15": ".SSLLLLLLL"
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-js-tristop"]=situation;})(globalThis);
