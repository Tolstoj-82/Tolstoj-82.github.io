// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "I → I",
  "chapter": "Openers",
  "description": "NES I → I, mirrored horizontally for Game Boy.",
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
      "type": "I",
      "x": 2,
      "y": 15,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "I → I: the completed opening.",
      "ticks": 96,
      "rows": {
        "17": "..IIIIIIII"
      },
      "next": "I",
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
        },
        {
          "x": 2,
          "y": 17,
          "tile": 138
        },
        {
          "x": 3,
          "y": 17,
          "tile": 139
        },
        {
          "x": 4,
          "y": 17,
          "tile": 139
        },
        {
          "x": 5,
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
          "type": "I",
          "x": 2,
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
      "next": "I",
      "showNext": true,
      "highlight": false,
      "rows": {
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
      "next": "I",
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
        "17": "......IIII"
      },
      "next": "I",
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
      "caption": "Move I left.",
      "ticks": 36,
      "active": {
        "type": "I",
        "x": 2,
        "y": -1,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
      ],
      "next": "I",
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
      "caption": "Let I fall into position.",
      "ticks": 144,
      "active": {
        "type": "I",
        "x": 2,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "I",
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
      "caption": "The I → I opening.",
      "ticks": 96,
      "rows": {
        "17": "..IIIIIIII"
      },
      "next": "I",
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
        },
        {
          "x": 2,
          "y": 17,
          "tile": 138
        },
        {
          "x": 3,
          "y": 17,
          "tile": 139
        },
        {
          "x": 4,
          "y": 17,
          "tile": 139
        },
        {
          "x": 5,
          "y": 17,
          "tile": 143
        }
      ]
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-i-i"]=situation;})(globalThis);
