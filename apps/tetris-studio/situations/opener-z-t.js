// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Z → T",
  "chapter": "Openers",
  "description": "NES S → T, mirrored horizontally for Game Boy.",
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
      "type": "T",
      "x": 5,
      "y": 16,
      "rotation": 2
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "Z → T: the completed opening.",
      "ticks": 96,
      "rows": {
        "16": "......TZZ.",
        "17": ".....TTTZZ"
      },
      "next": "T",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "Z",
          "x": 7,
          "y": 15,
          "rotation": 0
        },
        {
          "type": "T",
          "x": 5,
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
      "caption": "Start with Z in the spawning position.",
      "ticks": 2,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "next": "T",
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
      "next": "T",
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
      "next": "T",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "5",
      "lessonStage": 6,
      "caption": "Bring in T.",
      "ticks": 2,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "16": ".......ZZ.",
        "17": "........ZZ"
      },
      "next": "T",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Move T right.",
      "ticks": 36,
      "active": {
        "type": "T",
        "x": 4,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "T",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "7",
      "lessonStage": 6,
      "caption": "Press A for the first quarter-turn.",
      "ticks": 36,
      "active": {
        "type": "T",
        "x": 4,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ],
      "next": "T",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "8",
      "lessonStage": 6,
      "caption": "Press A again for the second quarter-turn.",
      "ticks": 36,
      "active": {
        "type": "T",
        "x": 4,
        "y": 0,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ],
      "next": "T",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "9",
      "lessonStage": 6,
      "caption": "Let T fall into position.",
      "ticks": 144,
      "active": {
        "type": "T",
        "x": 4,
        "y": 16,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "T",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "10",
      "lessonStage": 6,
      "caption": "Move T right.",
      "ticks": 36,
      "active": {
        "type": "T",
        "x": 5,
        "y": 16,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "T",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "11",
      "lessonStage": 7,
      "caption": "The Z → T opening.",
      "ticks": 96,
      "rows": {
        "16": "......TZZ.",
        "17": ".....TTTZZ"
      },
      "next": "T",
      "showNext": false,
      "highlight": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-z-t"]=situation;})(globalThis);
