// Mirrored Game Boy adjustment. Native routes and final tucks verified.
(function(root){const situation={
  "title": "Vertical S for L: 89 (Ori: Vert Z for J)",
  "chapter": "Adjustments",
  "description": "Stand S vertically to support L and prepare the stack for a Tetris.",
  "stack": [
    ".....SSSSS",
    "....sSSSSS",
    ".sSsSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "S",
      "x": 2,
      "y": 12,
      "rotation": 0
    },
    "adjusted": {
      "type": "S",
      "x": 2,
      "y": 12,
      "rotation": 1
    },
    "next": {
      "type": "L",
      "x": 0,
      "y": 12,
      "rotation": 3
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
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
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
        "x": 2,
        "y": 12,
        "rotation": 0,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: L is next.",
      "ticks": 96,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
        "x": 2,
        "y": 12,
        "rotation": 0,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Stand S vertically to support L and prepare the stack for a Tetris.",
      "ticks": 96,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "S",
        "x": 2,
        "y": 12,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next L fits beside the adjusted S.",
      "ticks": 96,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "S",
        "x": 2,
        "y": 12,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "L",
        "x": 0,
        "y": 12,
        "rotation": 3,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Place S in the adjusted position.",
      "ticks": 144,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 2,
        "y": 12,
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
      "ticks": 2,
      "next": "L",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "12": "..S.......",
        "13": "..SS.LLLLL",
        "14": "...SLLLLLL"
      },
      "caption": "Bring in L."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 0,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "L",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to position L."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 0,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "L",
        "x": 0,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "L",
      "showNext": false,
      "buttons": [
        "B"
      ],
      "caption": "Press b to position L."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": -1,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "L",
        "x": 0,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "L",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to position L."
    },
    {
      "step": "6d",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": -1,
        "y": 12,
        "rotation": 3
      },
      "animationFrom": {
        "type": "L",
        "x": -1,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 72,
      "highlight": false,
      "next": "L",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower L beside the overhang."
    },
    {
      "step": "6e",
      "lessonStage": 6,
      "active": {
        "type": "L",
        "x": 0,
        "y": 12,
        "rotation": 3
      },
      "animationFrom": {
        "type": "L",
        "x": -1,
        "y": 12,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
      "ticks": 36,
      "highlight": false,
      "next": "L",
      "showNext": false,
      "buttons": [
        "Right"
      ],
      "caption": "Press Right once to tuck L under the overhang."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "12": ".LS.......",
        "13": ".LSS.LLLLL",
        "14": ".LLSLLLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "S",
          "x": 2,
          "y": 12,
          "rotation": 1
        },
        {
          "type": "L",
          "x": 0,
          "y": 12,
          "rotation": 3
        }
      ],
      "caption": "Notice the resulting stack."
    }
  ],
  "section": "Good but Situational"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-vert-s-for-l"]=situation;})(globalThis);
