// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "O → J",
  "chapter": "Openers",
  "description": "NES O → L, mirrored horizontally for Game Boy.",
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
      "type": "J",
      "x": 1,
      "y": 16,
      "rotation": 2
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "O → J: the completed opening.",
      "ticks": 96,
      "rows": {
        "16": ".J......OO",
        "17": ".JJJ....OO"
      },
      "next": "J",
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
          "type": "J",
          "x": 1,
          "y": 16,
          "rotation": 2
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
      "next": "J",
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
      "next": "J",
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
      "next": "J",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "5",
      "lessonStage": 6,
      "caption": "Bring in J.",
      "ticks": 2,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "16": "........OO",
        "17": "........OO"
      },
      "next": "J",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "6",
      "lessonStage": 6,
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
      "next": "J",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "7",
      "lessonStage": 6,
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
      "next": "J",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "8",
      "lessonStage": 6,
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
      "next": "J",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "9",
      "lessonStage": 6,
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
      "next": "J",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "10",
      "lessonStage": 7,
      "caption": "The O → J opening.",
      "ticks": 96,
      "rows": {
        "16": ".J......OO",
        "17": ".JJJ....OO"
      },
      "next": "J",
      "showNext": false,
      "highlight": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-o-j"]=situation;})(globalThis);
