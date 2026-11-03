// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "I → Z",
  "chapter": "Openers",
  "description": "NES I → S, mirrored horizontally for Game Boy.",
  "stack": [],
  "adjustment": {
    "default": {
      "type": "I",
      "x": 1,
      "y": 15,
      "rotation": 0
    },
    "adjusted": {
      "type": "I",
      "x": 1,
      "y": 15,
      "rotation": 0
    },
    "next": {
      "type": "Z",
      "x": 4,
      "y": 15,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "I → Z: the completed opening.",
      "ticks": 96,
      "rows": {
        "16": "....ZZ....",
        "17": ".IIIIZZ..."
      },
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "tileOverrides": [
        {
          "x": 1,
          "y": 17,
          "tile": 138
        },
        {
          "x": 2,
          "y": 17,
          "tile": 139
        },
        {
          "x": 3,
          "y": 17,
          "tile": 139
        },
        {
          "x": 4,
          "y": 17,
          "tile": 143
        }
      ],
      "placementHighlights": [
        {
          "type": "I",
          "x": 1,
          "y": 15,
          "rotation": 0
        },
        {
          "type": "Z",
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
      "caption": "Move I left 2 columns.",
      "ticks": 36,
      "active": {
        "type": "I",
        "x": 1,
        "y": -1,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
      ],
      "next": "Z",
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
        "x": 1,
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
        "17": ".IIII....."
      },
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "tileOverrides": [
        {
          "x": 1,
          "y": 17,
          "tile": 138
        },
        {
          "x": 2,
          "y": 17,
          "tile": 139
        },
        {
          "x": 3,
          "y": 17,
          "tile": 139
        },
        {
          "x": 4,
          "y": 17,
          "tile": 143
        }
      ]
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Move Z right.",
      "ticks": 36,
      "active": {
        "type": "Z",
        "x": 4,
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
      "highlight": false,
      "tileOverrides": [
        {
          "x": 1,
          "y": 17,
          "tile": 138
        },
        {
          "x": 2,
          "y": 17,
          "tile": 139
        },
        {
          "x": 3,
          "y": 17,
          "tile": 139
        },
        {
          "x": 4,
          "y": 17,
          "tile": 143
        }
      ]
    },
    {
      "step": "7",
      "lessonStage": 6,
      "caption": "Let Z fall into position.",
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 4,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "tileOverrides": [
        {
          "x": 1,
          "y": 17,
          "tile": 138
        },
        {
          "x": 2,
          "y": 17,
          "tile": 139
        },
        {
          "x": 3,
          "y": 17,
          "tile": 139
        },
        {
          "x": 4,
          "y": 17,
          "tile": 143
        }
      ]
    },
    {
      "step": "8",
      "lessonStage": 7,
      "caption": "The I → Z opening.",
      "ticks": 96,
      "rows": {
        "16": "....ZZ....",
        "17": ".IIIIZZ..."
      },
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "tileOverrides": [
        {
          "x": 1,
          "y": 17,
          "tile": 138
        },
        {
          "x": 2,
          "y": 17,
          "tile": 139
        },
        {
          "x": 3,
          "y": 17,
          "tile": 139
        },
        {
          "x": 4,
          "y": 17,
          "tile": 143
        }
      ]
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-i-z"]=situation;})(globalThis);
