// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Z → I: alternate",
  "chapter": "Openers",
  "description": "NES S → I, mirrored horizontally for Game Boy.",
  "stack": [],
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 7,
      "y": 15,
      "rotation": 0
    },
    "adjusted": {
      "type": "Z",
      "x": 7,
      "y": 15,
      "rotation": 0
    },
    "next": {
      "type": "I",
      "x": 4,
      "y": 15,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "Z → I: alternate: the completed opening.",
      "ticks": 96,
      "rows": {
        "16": ".......ZZ.",
        "17": "....IIIIZZ"
      },
      "next": "I",
      "showNext": false,
      "highlight": false,
      "tileOverrides": [
        {
          "x": 4,
          "y": 17,
          "tile": 138
        },
        {
          "x": 5,
          "y": 17,
          "tile": 139
        },
        {
          "x": 6,
          "y": 17,
          "tile": 139
        },
        {
          "x": 7,
          "y": 17,
          "tile": 143
        }
      ],
      "placementHighlights": [
        {
          "type": "Z",
          "x": 7,
          "y": 15,
          "rotation": 0
        },
        {
          "type": "I",
          "x": 4,
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
      "caption": "Start with Z in the spawning position.",
      "ticks": 2,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "next": "I",
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
      "caption": "Move Z right 4 columns.",
      "ticks": 48,
      "active": {
        "type": "Z",
        "x": 7,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "I",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "4",
      "lessonStage": 5,
      "caption": "Let Z fall into position.",
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 7,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "I",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "5",
      "lessonStage": 6,
      "caption": "Bring in I.",
      "ticks": 2,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "rows": {
        "16": ".......ZZ.",
        "17": "........ZZ"
      },
      "next": "I",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Let I fall into position.",
      "ticks": 144,
      "active": {
        "type": "I",
        "x": 3,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "I",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "7",
      "lessonStage": 6,
      "caption": "Move I right.",
      "ticks": 36,
      "active": {
        "type": "I",
        "x": 4,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "I",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "8",
      "lessonStage": 7,
      "caption": "The Z → I opening: alternate placement.",
      "ticks": 96,
      "rows": {
        "17": "....IIIIZZ"
      },
      "next": "I",
      "showNext": false,
      "highlight": false,
      "tileOverrides": [
        {
          "x": 4,
          "y": 17,
          "tile": 138
        },
        {
          "x": 5,
          "y": 17,
          "tile": 139
        },
        {
          "x": 6,
          "y": 17,
          "tile": 139
        },
        {
          "x": 7,
          "y": 17,
          "tile": 143
        }
      ]
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-z-i-alternate"]=situation;})(globalThis);
