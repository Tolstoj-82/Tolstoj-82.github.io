// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Bar in 1: Dog bar (Ori: Bar in 10)",
  "chapter": "Adjustments",
  "description": "Place the first I against the wall, leaving the adjacent column for the next I and a Tetris.",
  "stack": [
    "..sSSSSSSS",
    "..sSSSSSSS",
    "..sSSSSSSS",
    "..sSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "I",
      "x": 0,
      "y": 14,
      "rotation": 1
    },
    "adjusted": {
      "type": "I",
      "x": -1,
      "y": 14,
      "rotation": 1
    },
    "next": {
      "type": "I",
      "x": 0,
      "y": 14,
      "rotation": 1
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "motif": true,
      "blink": true
    },
    {
      "step": "2",
      "lessonStage": 2,
      "caption": "Default: the usual landing without this adjustment.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "ghost": {
        "type": "I",
        "x": 0,
        "y": 14,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: I is next.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "ghost": {
        "type": "I",
        "x": 0,
        "y": 14,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Place the first I against the wall, leaving the adjacent column for the next I and a Tetris.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "ghost": {
        "type": "I",
        "x": -1,
        "y": 14,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next I fits beside the adjusted I.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "I",
        "x": -1,
        "y": 14,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "I",
        "x": 0,
        "y": 14,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Place I in the adjusted position.",
      "ticks": 144,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": -1,
        "y": 14,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ]
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in I.",
      "ticks": 2,
      "next": "I",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "rows": {
        "14": "I.LLLLLLLL",
        "15": "I.LLLLLLLL",
        "16": "I.LLLLLLLL",
        "17": "I.LLLLLLLL"
      },
      "tileOverrides": [
        {
          "x": 0,
          "y": 14,
          "tile": 128
        },
        {
          "x": 0,
          "y": 15,
          "tile": 136
        },
        {
          "x": 0,
          "y": 16,
          "tile": 136
        },
        {
          "x": 0,
          "y": 17,
          "tile": 137
        }
      ]
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place I in the landing left for it.",
      "ticks": 144,
      "next": "I",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 0,
        "y": 14,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ],
      "tileOverrides": [
        {
          "x": 0,
          "y": 14,
          "tile": 128
        },
        {
          "x": 0,
          "y": 15,
          "tile": 136
        },
        {
          "x": 0,
          "y": 16,
          "tile": 136
        },
        {
          "x": 0,
          "y": 17,
          "tile": 137
        }
      ]
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "caption": "The second I completes all four rows: Tetris.",
      "clear": true,
      "next": "I",
      "showNext": false,
      "highlight": false
    },
    {
      "step": "7",
      "lessonStage": 7,
      "caption": "Both I pieces and all four rows are cleared.",
      "ticks": 96,
      "next": "I",
      "showNext": false,
      "highlight": false,
      "blink": true
    }
  ],
  "section": "Memes/Anti-Adjustments"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-bar-in-10"]=situation;})(globalThis);
