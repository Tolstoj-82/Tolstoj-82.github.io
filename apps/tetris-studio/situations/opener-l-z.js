// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "L → Z",
  "chapter": "Openers",
  "description": "NES J → S, mirrored horizontally for Game Boy.",
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
      "type": "Z",
      "x": 8,
      "y": 14,
      "rotation": 1
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "L → Z: the completed opening.",
      "ticks": 96,
      "rows": {
        "14": ".........Z",
        "15": "........ZZ",
        "16": "........ZL",
        "17": ".......LLL"
      },
      "next": "Z",
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
          "type": "Z",
          "x": 8,
          "y": 14,
          "rotation": 1
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
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "rows": {
        "14": "..........",
        "15": "..........",
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
      "next": "Z",
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
        "16": ".........L",
        "17": ".......LLL"
      },
      "next": "Z",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "8",
      "lessonStage": 6,
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
      "next": "Z",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "9",
      "lessonStage": 6,
      "caption": "Press B to turn Z.",
      "ticks": 36,
      "active": {
        "type": "Z",
        "x": 7,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ],
      "next": "Z",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "10",
      "lessonStage": 6,
      "caption": "Move Z right.",
      "ticks": 36,
      "active": {
        "type": "Z",
        "x": 8,
        "y": 0,
        "rotation": 1
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
      "step": "11",
      "lessonStage": 6,
      "caption": "Let Z fall into position.",
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 8,
        "y": 14,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "Z",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "12",
      "lessonStage": 7,
      "caption": "The L → Z opening.",
      "ticks": 96,
      "rows": {
        "14": ".........Z",
        "15": "........ZZ",
        "16": "........ZL"
      },
      "next": "Z",
      "showNext": false,
      "highlight": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-l-z"]=situation;})(globalThis);
