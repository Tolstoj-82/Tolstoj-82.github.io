// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "I → S",
  "chapter": "Openers",
  "description": "NES I → Z, mirrored horizontally for Game Boy.",
  "stack": [],
  "adjustment": {
    "default": {
      "type": "I",
      "x": 6,
      "y": 15,
      "rotation": 0
    },
    "adjusted": {
      "type": "I",
      "x": 6,
      "y": 15,
      "rotation": 0
    },
    "next": {
      "type": "S",
      "x": 4,
      "y": 15,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "I → S: the completed opening.",
      "ticks": 96,
      "rows": {
        "16": ".....SS...",
        "17": "....SSIIII"
      },
      "next": "S",
      "showNext": false,
      "highlight": false,
      "tileOverrides": [
        {
          "x": 6,
          "y": 17,
          "tile": 138
        },
        {
          "x": 7,
          "y": 17,
          "tile": 139
        },
        {
          "x": 8,
          "y": 17,
          "tile": 139
        },
        {
          "x": 9,
          "y": 17,
          "tile": 143
        }
      ],
      "placementHighlights": [
        {
          "type": "I",
          "x": 6,
          "y": 15,
          "rotation": 0
        },
        {
          "type": "S",
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
      "caption": "Start with I in the spawning position.",
      "ticks": 2,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "next": "S",
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
      "caption": "Move I right 3 columns.",
      "ticks": 36,
      "active": {
        "type": "I",
        "x": 6,
        "y": -1,
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
      "caption": "Let I fall into position.",
      "ticks": 144,
      "active": {
        "type": "I",
        "x": 6,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "S",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "5",
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
        "17": "......IIII"
      },
      "next": "S",
      "showNext": false,
      "highlight": false,
      "tileOverrides": [
        {
          "x": 6,
          "y": 17,
          "tile": 138
        },
        {
          "x": 7,
          "y": 17,
          "tile": 139
        },
        {
          "x": 8,
          "y": 17,
          "tile": 139
        },
        {
          "x": 9,
          "y": 17,
          "tile": 143
        }
      ]
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Move S right.",
      "ticks": 36,
      "active": {
        "type": "S",
        "x": 4,
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
      "highlight": false,
      "tileOverrides": [
        {
          "x": 6,
          "y": 17,
          "tile": 138
        },
        {
          "x": 7,
          "y": 17,
          "tile": 139
        },
        {
          "x": 8,
          "y": 17,
          "tile": 139
        },
        {
          "x": 9,
          "y": 17,
          "tile": 143
        }
      ]
    },
    {
      "step": "7",
      "lessonStage": 6,
      "caption": "Let S fall into position.",
      "ticks": 144,
      "active": {
        "type": "S",
        "x": 4,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "S",
      "showNext": false,
      "highlight": false,
      "tileOverrides": [
        {
          "x": 6,
          "y": 17,
          "tile": 138
        },
        {
          "x": 7,
          "y": 17,
          "tile": 139
        },
        {
          "x": 8,
          "y": 17,
          "tile": 139
        },
        {
          "x": 9,
          "y": 17,
          "tile": 143
        }
      ]
    },
    {
      "step": "8",
      "lessonStage": 7,
      "caption": "The I → S opening.",
      "ticks": 96,
      "rows": {
        "16": ".....SS...",
        "17": "....SSIIII"
      },
      "next": "S",
      "showNext": false,
      "highlight": false,
      "tileOverrides": [
        {
          "x": 6,
          "y": 17,
          "tile": 138
        },
        {
          "x": 7,
          "y": 17,
          "tile": 139
        },
        {
          "x": 8,
          "y": 17,
          "tile": 139
        },
        {
          "x": 9,
          "y": 17,
          "tile": 143
        }
      ]
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-i-s"]=situation;})(globalThis);
