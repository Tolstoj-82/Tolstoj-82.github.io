// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "S → O",
  "chapter": "Openers",
  "description": "NES Z → O, mirrored horizontally for Game Boy.",
  "stack": [],
  "adjustment": {
    "default": {
      "type": "S",
      "x": 6,
      "y": 15,
      "rotation": 1
    },
    "adjusted": {
      "type": "S",
      "x": 6,
      "y": 15,
      "rotation": 1
    },
    "next": {
      "type": "O",
      "x": 7,
      "y": 15,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "S → O: the completed opening.",
      "ticks": 96,
      "rows": {
        "15": "......S...",
        "16": "......SSOO",
        "17": ".......SOO"
      },
      "next": "O",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "S",
          "x": 6,
          "y": 15,
          "rotation": 1
        },
        {
          "type": "O",
          "x": 7,
          "y": 15,
          "rotation": 0
        }
      ],
      "placementColors": [
        "#e04444",
        "#35a35c"
      ]
    },
    {
      "step": "2",
      "lessonStage": 4,
      "caption": "Start with S in the spawning position.",
      "ticks": 2,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "next": "O",
      "showNext": true,
      "highlight": false,
      "rows": {
        "15": "..........",
        "16": "..........",
        "17": ".........."
      }
    },
    {
      "step": "3",
      "lessonStage": 5,
      "caption": "Move S right 3 columns.",
      "ticks": 36,
      "active": {
        "type": "S",
        "x": 6,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "O",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "4",
      "lessonStage": 5,
      "caption": "Press B to turn S.",
      "ticks": 36,
      "active": {
        "type": "S",
        "x": 6,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ],
      "next": "O",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Let S fall into position.",
      "ticks": 144,
      "active": {
        "type": "S",
        "x": 6,
        "y": 15,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "O",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in O.",
      "ticks": 2,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "15": "......S...",
        "16": "......SS..",
        "17": ".......S.."
      },
      "next": "O",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "7",
      "lessonStage": 6,
      "caption": "Move O right 4 columns.",
      "ticks": 48,
      "active": {
        "type": "O",
        "x": 7,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "O",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "8",
      "lessonStage": 6,
      "caption": "Let O fall into position.",
      "ticks": 144,
      "active": {
        "type": "O",
        "x": 7,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "O",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "9",
      "lessonStage": 7,
      "caption": "The S → O opening.",
      "ticks": 96,
      "rows": {
        "16": "......SSOO",
        "17": ".......SOO"
      },
      "next": "O",
      "showNext": false,
      "highlight": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-s-o"]=situation;})(globalThis);
