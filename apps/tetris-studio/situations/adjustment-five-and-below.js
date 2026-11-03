// Mirrored Game Boy adjustment. Native routes and final tucks verified.
(function(root){const situation={
  "title": "Five and Below",
  "chapter": "Adjustments",
  "description": "Stand L at the wall, then tuck O right underneath.",
  "stack": [
    ".S........",
    ".SS.......",
    ".SSS.S.sSs",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "L",
      "x": 6,
      "y": 13,
      "rotation": 0
    },
    "adjusted": {
      "type": "L",
      "x": 8,
      "y": 12,
      "rotation": 1
    },
    "next": {
      "type": "O",
      "x": 6,
      "y": 12,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
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
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 6,
        "y": 13,
        "rotation": 0,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: O is next.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 6,
        "y": 13,
        "rotation": 0,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Stand L at the wall, then tuck O right underneath.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 8,
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
      "caption": "The next O fits beside the adjusted L.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "L",
        "x": 8,
        "y": 12,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "O",
        "x": 6,
        "y": 12,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "ticks": 2,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {},
      "caption": "Bring in L."
    },
    {
      "step": "5a",
      "lessonStage": 5,
      "active": {
        "type": "L",
        "x": 7,
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
      "next": "O",
      "showNext": true,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move L into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "L",
        "x": 7,
        "y": 0,
        "rotation": 1
      },
      "animationFrom": {
        "type": "L",
        "x": 7,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "O",
      "showNext": true,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate L."
    },
    {
      "step": "5c",
      "lessonStage": 5,
      "active": {
        "type": "L",
        "x": 8,
        "y": 0,
        "rotation": 1
      },
      "animationFrom": {
        "type": "L",
        "x": 7,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "O",
      "showNext": true,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move L into place."
    },
    {
      "step": "5d",
      "lessonStage": 5,
      "active": {
        "type": "L",
        "x": 8,
        "y": 12,
        "rotation": 1
      },
      "animationFrom": {
        "type": "L",
        "x": 8,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "ticks": 72,
      "highlight": false,
      "next": "O",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower L."
    },
    {
      "step": "6",
      "lessonStage": 6,
      "ticks": 2,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "12": "........LL",
        "13": ".L.......L",
        "14": ".LL......L"
      },
      "caption": "Bring in O."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "O",
        "x": 5,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "O",
      "showNext": false,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to position O."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "O",
        "x": 5,
        "y": 12,
        "rotation": 0
      },
      "animationFrom": {
        "type": "O",
        "x": 5,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 72,
      "highlight": false,
      "next": "O",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower O beside the overhang."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "O",
        "x": 6,
        "y": 12,
        "rotation": 0
      },
      "animationFrom": {
        "type": "O",
        "x": 5,
        "y": 12,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "ticks": 36,
      "highlight": false,
      "next": "O",
      "showNext": false,
      "buttons": [
        "Right"
      ],
      "caption": "Press Right once to tuck O under the overhang."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "12": "........LL",
        "13": ".L.....OOL",
        "14": ".LL....OOL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "L",
          "x": 8,
          "y": 12,
          "rotation": 1
        },
        {
          "type": "O",
          "x": 6,
          "y": 12,
          "rotation": 0
        }
      ],
      "caption": "Notice the resulting stack."
    }
  ],
  "section": "Dicey",
  "motionVerified": true
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-five-and-below"]=situation;})(globalThis);
