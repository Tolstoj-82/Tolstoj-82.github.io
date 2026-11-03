// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "J → S",
  "chapter": "Openers",
  "description": "NES L → Z, mirrored horizontally for Game Boy.",
  "stack": [],
  "adjustment": {
    "default": {
      "type": "J",
      "x": 8,
      "y": 15,
      "rotation": 1
    },
    "adjusted": {
      "type": "J",
      "x": 8,
      "y": 15,
      "rotation": 1
    },
    "next": {
      "type": "S",
      "x": 6,
      "y": 15,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "J → S: the completed opening.",
      "ticks": 96,
      "rows": {
        "15": ".........J",
        "16": ".......SSJ",
        "17": "......SSJJ"
      },
      "next": "S",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "J",
          "x": 8,
          "y": 15,
          "rotation": 1
        },
        {
          "type": "S",
          "x": 6,
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
      "caption": "Start with J in the spawning position.",
      "ticks": 2,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "next": "S",
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
      "caption": "Move J right 4 columns.",
      "ticks": 48,
      "active": {
        "type": "J",
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
      "caption": "Press A to turn J.",
      "ticks": 36,
      "active": {
        "type": "J",
        "x": 7,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ],
      "next": "S",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Move J right.",
      "ticks": 36,
      "active": {
        "type": "J",
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
      "caption": "Let J fall into position.",
      "ticks": 144,
      "active": {
        "type": "J",
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
        "15": ".........J",
        "16": ".........J",
        "17": "........JJ"
      },
      "next": "S",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "8",
      "lessonStage": 6,
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
      "next": "S",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "9",
      "lessonStage": 6,
      "caption": "Let S fall into position.",
      "ticks": 144,
      "active": {
        "type": "S",
        "x": 6,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "S",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "10",
      "lessonStage": 7,
      "caption": "The J → S opening.",
      "ticks": 96,
      "rows": {
        "16": ".......SSJ",
        "17": "......SSJJ"
      },
      "next": "S",
      "showNext": false,
      "highlight": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-j-s"]=situation;})(globalThis);
