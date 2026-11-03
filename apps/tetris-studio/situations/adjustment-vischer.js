// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Vischer Thing",
  "chapter": "Adjustments",
  "description": "Stand Z in the pocket and place S vertically beside it.",
  "stack": [
    "s....sSSSS",
    "Ss..sSSSSS",
    ".S..SSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 4,
      "y": 12,
      "rotation": 1
    },
    "adjusted": {
      "type": "Z",
      "x": 3,
      "y": 13,
      "rotation": 1
    },
    "next": {
      "type": "S",
      "x": 1,
      "y": 13,
      "rotation": 1
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
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
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 4,
        "y": 12,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: S is next.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 4,
        "y": 12,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Stand Z in the pocket and place S vertically beside it.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 3,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next S fits beside the adjusted Z.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "Z",
        "x": 3,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "S",
        "x": 1,
        "y": 13,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "ticks": 2,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {},
      "caption": "Bring in Z."
    },
    {
      "step": "5a",
      "lessonStage": 5,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "S",
      "showNext": true,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate Z."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 13,
        "rotation": 3
      },
      "animationFrom": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 78,
      "highlight": false,
      "next": "S",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower Z."
    },
    {
      "step": "6",
      "lessonStage": 6,
      "ticks": 2,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "13": "....Z.....",
        "14": "L..ZZLLLLL",
        "15": "LL.ZLLLLLL"
      },
      "caption": "Bring in S."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "S",
        "x": 1,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "S",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move S into place."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "S",
        "x": 1,
        "y": 0,
        "rotation": 3
      },
      "animationFrom": {
        "type": "S",
        "x": 1,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "S",
      "showNext": false,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate S."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "S",
        "x": 1,
        "y": 13,
        "rotation": 3
      },
      "animationFrom": {
        "type": "S",
        "x": 1,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "ticks": 78,
      "highlight": false,
      "next": "S",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower S."
    },
    {
      "step": "6z",
      "lessonStage": 6,
      "clear": true,
      "ticks": 93,
      "next": "S",
      "showNext": false,
      "caption": "Clear 2 lines."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "14": "..........",
        "15": ".S..Z....."
      },
      "highlight": false,
      "placementHighlights": [],
      "caption": "Notice the resulting stack."
    }
  ],
  "section": "Good but Situational",
  "motionVerified": true
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-vischer"]=situation;})(globalThis);
