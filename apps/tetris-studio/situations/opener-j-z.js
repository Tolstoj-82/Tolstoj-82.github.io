// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "J → Z",
  "chapter": "Openers",
  "description": "NES L → S, mirrored horizontally for Game Boy.",
  "stack": [],
  "adjustment": {
    "default": {
      "type": "J",
      "x": 1,
      "y": 16,
      "rotation": 2
    },
    "adjusted": {
      "type": "J",
      "x": 1,
      "y": 16,
      "rotation": 2
    },
    "next": {
      "type": "Z",
      "x": 3,
      "y": 15,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "J → Z: the completed opening.",
      "ticks": 96,
      "rows": {
        "16": ".J.ZZ.....",
        "17": ".JJJZZ...."
      },
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "J",
          "x": 1,
          "y": 16,
          "rotation": 2
        },
        {
          "type": "Z",
          "x": 3,
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
      "caption": "Move J left 2 columns.",
      "ticks": 36,
      "active": {
        "type": "J",
        "x": 1,
        "y": 0,
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
      "caption": "Press A for the first quarter-turn.",
      "ticks": 36,
      "active": {
        "type": "J",
        "x": 1,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ],
      "next": "Z",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Press A again for the second quarter-turn.",
      "ticks": 36,
      "active": {
        "type": "J",
        "x": 1,
        "y": 0,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ],
      "next": "Z",
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
        "x": 1,
        "y": 16,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "Z",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "7",
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
        "16": ".J........",
        "17": ".JJJ......"
      },
      "next": "Z",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "8",
      "lessonStage": 6,
      "caption": "Let Z fall into position.",
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 3,
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
      "step": "9",
      "lessonStage": 7,
      "caption": "The J → Z opening.",
      "ticks": 96,
      "rows": {
        "16": ".J.ZZ.....",
        "17": ".JJJZZ...."
      },
      "next": "Z",
      "showNext": false,
      "highlight": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-j-z"]=situation;})(globalThis);
