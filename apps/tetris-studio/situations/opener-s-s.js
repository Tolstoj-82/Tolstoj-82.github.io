// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "S → S",
  "chapter": "Openers",
  "description": "NES Z → Z, mirrored horizontally for Game Boy.",
  "stack": [],
  "adjustment": {
    "default": {
      "type": "S",
      "x": 8,
      "y": 15,
      "rotation": 1
    },
    "adjusted": {
      "type": "S",
      "x": 8,
      "y": 15,
      "rotation": 1
    },
    "next": {
      "type": "S",
      "x": 8,
      "y": 13,
      "rotation": 1
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "S → S: the completed opening.",
      "ticks": 96,
      "rows": {
        "13": "........S.",
        "14": "........SS",
        "15": "........SS",
        "16": "........SS",
        "17": ".........S"
      },
      "next": "S",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "S",
          "x": 8,
          "y": 15,
          "rotation": 1
        },
        {
          "type": "S",
          "x": 8,
          "y": 13,
          "rotation": 1
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
      "next": "S",
      "showNext": true,
      "highlight": false,
      "rows": {
        "13": "..........",
        "14": "..........",
        "15": "..........",
        "16": "..........",
        "17": ".........."
      }
    },
    {
      "step": "3",
      "lessonStage": 5,
      "caption": "Move S right 4 columns.",
      "ticks": 48,
      "active": {
        "type": "S",
        "x": 7,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "S",
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
        "x": 7,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ],
      "next": "S",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Move S right.",
      "ticks": 36,
      "active": {
        "type": "S",
        "x": 8,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "S",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "6",
      "lessonStage": 5,
      "caption": "Let S fall into position.",
      "ticks": 144,
      "active": {
        "type": "S",
        "x": 8,
        "y": 15,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "S",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "7",
      "lessonStage": 6,
      "caption": "Bring in S.",
      "ticks": 2,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "15": "........S.",
        "16": "........SS",
        "17": ".........S"
      },
      "next": "S",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "8",
      "lessonStage": 6,
      "caption": "Move S right 4 columns.",
      "ticks": 48,
      "active": {
        "type": "S",
        "x": 7,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "S",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "9",
      "lessonStage": 6,
      "caption": "Press B to turn S.",
      "ticks": 36,
      "active": {
        "type": "S",
        "x": 7,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ],
      "next": "S",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "10",
      "lessonStage": 6,
      "caption": "Move S right.",
      "ticks": 36,
      "active": {
        "type": "S",
        "x": 8,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "S",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "11",
      "lessonStage": 6,
      "caption": "Let S fall into position.",
      "ticks": 144,
      "active": {
        "type": "S",
        "x": 8,
        "y": 13,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "S",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "12",
      "lessonStage": 7,
      "caption": "The S → S opening.",
      "ticks": 96,
      "rows": {
        "13": "........S.",
        "14": "........SS",
        "15": "........SS"
      },
      "next": "S",
      "showNext": false,
      "highlight": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-s-s"]=situation;})(globalThis);
