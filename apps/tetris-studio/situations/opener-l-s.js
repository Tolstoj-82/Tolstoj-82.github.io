// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "L → S",
  "chapter": "Openers",
  "description": "NES J → Z, mirrored horizontally for Game Boy.",
  "stack": [],
  "adjustment": {
    "default": {
      "type": "L",
      "x": 7,
      "y": 16,
      "rotation": 2
    },
    "adjusted": {
      "type": "L",
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
      "caption": "L → S: the completed opening.",
      "ticks": 96,
      "rows": {
        "16": "......SS.L",
        "17": ".....SSLLL"
      },
      "next": "S",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "L",
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
      "caption": "Start with L in the spawning position.",
      "ticks": 2,
      "active": {
        "type": "L",
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
      "caption": "Move L right 4 columns.",
      "ticks": 48,
      "active": {
        "type": "L",
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
        "type": "L",
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
        "type": "L",
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
      "caption": "Let L fall into position.",
      "ticks": 144,
      "active": {
        "type": "L",
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
        "16": ".........L",
        "17": ".......LLL"
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
      "caption": "The L → S opening.",
      "ticks": 96,
      "rows": {
        "16": "......SS.L",
        "17": ".....SSLLL"
      },
      "next": "S",
      "showNext": false,
      "highlight": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-l-s"]=situation;})(globalThis);
