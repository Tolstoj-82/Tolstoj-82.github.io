// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "O → O",
  "chapter": "Openers",
  "description": "NES O → O, mirrored horizontally for Game Boy.",
  "stack": [],
  "adjustment": {
    "default": {
      "type": "O",
      "x": 7,
      "y": 15,
      "rotation": 0
    },
    "adjusted": {
      "type": "O",
      "x": 7,
      "y": 15,
      "rotation": 0
    },
    "next": {
      "type": "O",
      "x": 5,
      "y": 15,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "O → O: the completed opening.",
      "ticks": 96,
      "rows": {
        "16": "......OOOO",
        "17": "......OOOO"
      },
      "next": "O",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "O",
          "x": 7,
          "y": 15,
          "rotation": 0
        },
        {
          "type": "O",
          "x": 5,
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
      "caption": "Start with O in the spawning position.",
      "ticks": 2,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "next": "O",
      "showNext": true,
      "highlight": false,
      "rows": {
        "16": "..........",
        "17": ".........."
      }
    },
    {
      "step": "3",
      "lessonStage": 5,
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
      "showNext": true,
      "highlight": false
    },
    {
      "step": "4",
      "lessonStage": 5,
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
      "showNext": true,
      "highlight": false
    },
    {
      "step": "5",
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
        "16": "........OO",
        "17": "........OO"
      },
      "next": "O",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Move O right 2 columns.",
      "ticks": 36,
      "active": {
        "type": "O",
        "x": 5,
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
      "step": "7",
      "lessonStage": 6,
      "caption": "Let O fall into position.",
      "ticks": 144,
      "active": {
        "type": "O",
        "x": 5,
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
      "step": "8",
      "lessonStage": 7,
      "caption": "The O → O opening.",
      "ticks": 96,
      "rows": {
        "16": "......OOOO",
        "17": "......OOOO"
      },
      "next": "O",
      "showNext": false,
      "highlight": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-o-o"]=situation;})(globalThis);
