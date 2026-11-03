// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Z → L",
  "chapter": "Openers",
  "description": "NES S → J, mirrored horizontally for Game Boy.",
  "stack": [],
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 2,
      "y": 15,
      "rotation": 0
    },
    "adjusted": {
      "type": "Z",
      "x": 2,
      "y": 15,
      "rotation": 0
    },
    "next": {
      "type": "L",
      "x": 0,
      "y": 15,
      "rotation": 3
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 4,
      "caption": "Z → L: the completed opening.",
      "ticks": 96,
      "rows": {
        "15": ".L........",
        "16": ".LZZ......",
        "17": ".LLZZ....."
      },
      "next": "L",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "Z",
          "x": 2,
          "y": 15,
          "rotation": 0
        },
        {
          "type": "L",
          "x": 0,
          "y": 15,
          "rotation": 3
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
      "next": "L",
      "showNext": true,
      "highlight": false,
      "rows": {
        "15": "..........",
        "16": "..........",
        "17": ".........."
      }
    },
    {
      "step": "3",
      "lessonStage": 5,
      "caption": "Move Z left.",
      "ticks": 36,
      "active": {
        "type": "Z",
        "x": 2,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
      ],
      "next": "L",
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
        "x": 2,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "L",
      "showNext": true,
      "highlight": false
    },
    {
      "step": "5",
      "lessonStage": 6,
      "caption": "Bring in L.",
      "ticks": 2,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "16": "..ZZ......",
        "17": "...ZZ....."
      },
      "next": "L",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Move L left 3 columns.",
      "ticks": 36,
      "active": {
        "type": "L",
        "x": 0,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
      ],
      "next": "L",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "7",
      "lessonStage": 6,
      "caption": "Press B to turn L.",
      "ticks": 36,
      "active": {
        "type": "L",
        "x": 0,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ],
      "next": "L",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "8",
      "lessonStage": 6,
      "caption": "Move L left.",
      "ticks": 36,
      "active": {
        "type": "L",
        "x": -1,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
      ],
      "next": "L",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "9",
      "lessonStage": 6,
      "caption": "Let L fall into position.",
      "ticks": 144,
      "active": {
        "type": "L",
        "x": -1,
        "y": 15,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [],
      "next": "L",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "10",
      "lessonStage": 6,
      "caption": "Move L right.",
      "ticks": 36,
      "active": {
        "type": "L",
        "x": 0,
        "y": 15,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "L",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "11",
      "lessonStage": 7,
      "caption": "The Z → L opening.",
      "ticks": 96,
      "rows": {
        "15": ".L........",
        "16": ".LZZ......",
        "17": ".LLZZ....."
      },
      "next": "L",
      "showNext": false,
      "highlight": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["opener-z-l"]=situation;})(globalThis);
