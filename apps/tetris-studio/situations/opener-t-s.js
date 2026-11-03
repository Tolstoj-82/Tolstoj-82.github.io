// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "T → S",
  "chapter": "Openers",
  "description": "NES T → Z, mirrored horizontally for Game Boy.",
  "stack": [],
  "adjustment": {
    "default": {
      "type": "T",
      "x": 7,
      "y": 16,
      "rotation": 2
    },
    "adjusted": {
      "type": "T",
      "x": 7,
      "y": 16,
      "rotation": 2
    },
    "next": {
      "type": "S",
      "x": 5,
      "y": 15,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "T → S: the completed opening.",
      "ticks": 96,
      "rows": {
        "16": "......SST.",
        "17": ".....SSTTT"
      },
      "next": "S",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "T",
          "x": 7,
          "y": 16,
          "rotation": 2
        },
        {
          "type": "S",
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
      "caption": "Start with T in the spawning position.",
      "ticks": 2,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
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
      "caption": "Move T right 4 columns.",
      "ticks": 48,
      "active": {
        "type": "T",
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
      "caption": "Press A for the first quarter-turn.",
      "ticks": 36,
      "active": {
        "type": "T",
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
      "caption": "Press A again for the second quarter-turn.",
      "ticks": 36,
      "active": {
        "type": "T",
        "x": 7,
        "y": 0,
        "rotation": 2
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
      "step": "6",
      "lessonStage": 5,
      "caption": "Let T fall into position.",
      "ticks": 144,
      "active": {
        "type": "T",
        "x": 7,
        "y": 16,
        "rotation": 2
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
        "16": "........T.",
        "17": ".......TTT"
      },
      "next": "S",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "8",
      "lessonStage": 6,
      "caption": "Move S right 2 columns.",
      "ticks": 36,
      "active": {
        "type": "S",
        "x": 5,
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
        "x": 5,
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
      "caption": "The T → S opening.",
      "ticks": 96,
      "rows": {
        "16": "......SST.",
        "17": ".....SSTTT"
      },
      "next": "S",
      "showNext": false,
      "highlight": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-t-s"]=situation;})(globalThis);
