// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "O → Z",
  "chapter": "Openers",
  "description": "NES O → S, mirrored horizontally for Game Boy.",
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
      "type": "Z",
      "x": 5,
      "y": 15,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "O → Z: the completed opening.",
      "ticks": 96,
      "rows": {
        "16": ".....ZZ.OO",
        "17": "......ZZOO"
      },
      "next": "Z",
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
          "type": "Z",
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
      "next": "Z",
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
      "next": "Z",
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
      "next": "Z",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "5",
      "lessonStage": 6,
      "caption": "Bring in Z.",
      "ticks": 2,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "16": "........OO",
        "17": "........OO"
      },
      "next": "Z",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Move Z right 2 columns.",
      "ticks": 36,
      "active": {
        "type": "Z",
        "x": 5,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "Z",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "7",
      "lessonStage": 6,
      "caption": "Let Z fall into position.",
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 5,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "Z",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "8",
      "lessonStage": 7,
      "caption": "The O → Z opening.",
      "ticks": 96,
      "rows": {
        "16": ".....ZZ.OO",
        "17": "......ZZOO"
      },
      "next": "Z",
      "showNext": false,
      "highlight": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-o-z"]=situation;})(globalThis);
