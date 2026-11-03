// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "VITS: T East",
  "chapter": "Adjustments",
  "description": "Stand T with its spike pointing left, filling the step while leaving a roof for I. Lower I at the wall and tuck it right underneath to get Tetris ready.",
  "stack": [
    "...sSSSSSS",
    "...sSSSSSS",
    "..sSSSSSSS",
    "..sSSSSSSS",
    "..sSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "T",
      "x": 5,
      "y": 11,
      "rotation": 2
    },
    "adjusted": {
      "type": "T",
      "x": 1,
      "y": 12,
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
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
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
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "T",
        "x": 5,
        "y": 11,
        "rotation": 2,
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
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "T",
        "x": 5,
        "y": 11,
        "rotation": 2,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Stand T with its spike pointing left, filling the step while leaving a roof for I. Lower I at the wall and tuck it right underneath to get Tetris ready.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "T",
        "x": 1,
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
      "caption": "The I ghost shows the final tuck underneath T.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "T",
        "x": 1,
        "y": 12,
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
      "ticks": 2,
      "rows": {},
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "next": "I",
      "showNext": true,
      "highlight": false,
      "caption": "Place T above the channel."
    },
    {
      "step": "5a",
      "lessonStage": 5,
      "ticks": 24,
      "active": {
        "type": "T",
        "x": 1,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
      ],
      "next": "I",
      "showNext": true,
      "highlight": false,
      "caption": "Move T left."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "ticks": 24,
      "active": {
        "type": "T",
        "x": 1,
        "y": 0,
        "rotation": 1
      },
      "animationFrom": {
        "type": "T",
        "x": 1,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ],
      "next": "I",
      "showNext": true,
      "highlight": false,
      "caption": "Press A to turn T."
    },
    {
      "step": "5c",
      "lessonStage": 5,
      "ticks": 72,
      "active": {
        "type": "T",
        "x": 1,
        "y": 12,
        "rotation": 1
      },
      "animationFrom": {
        "type": "T",
        "x": 1,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 12,
      "buttons": [],
      "next": "I",
      "showNext": true,
      "highlight": false,
      "caption": "Let gravity lower T."
    },
    {
      "step": "6",
      "lessonStage": 6,
      "ticks": 2,
      "rows": {
        "12": "..T.......",
        "13": ".TTLLLLLLL",
        "14": "..TLLLLLLL"
      },
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "next": "I",
      "showNext": false,
      "highlight": false,
      "caption": "Bring in I, ready for the tuck."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "ticks": 24,
      "active": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 0
      },
      "animationFrom": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
      ],
      "next": "I",
      "showNext": false,
      "highlight": false,
      "caption": "Move I left."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "ticks": 24,
      "active": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ],
      "next": "I",
      "showNext": false,
      "highlight": false,
      "caption": "Press A to turn I."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "ticks": 24,
      "active": {
        "type": "I",
        "x": -1,
        "y": -1,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
      ],
      "next": "I",
      "showNext": false,
      "highlight": false,
      "caption": "Move I left."
    },
    {
      "step": "6d",
      "lessonStage": 6,
      "ticks": 84,
      "active": {
        "type": "I",
        "x": -1,
        "y": 14,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": -1,
        "y": -1,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 14,
      "buttons": [],
      "next": "I",
      "showNext": false,
      "highlight": false,
      "caption": "Let gravity lower I."
    },
    {
      "step": "6e",
      "lessonStage": 6,
      "ticks": 24,
      "active": {
        "type": "I",
        "x": 0,
        "y": 14,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": -1,
        "y": 14,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "next": "I",
      "showNext": false,
      "highlight": false,
      "caption": "Press Right once to tuck I under T."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "12": "..T.......",
        "13": ".TTLLLLLLL",
        "14": ".ITLLLLLLL",
        "15": ".ILLLLLLLL",
        "16": ".ILLLLLLLL",
        "17": ".ILLLLLLLL"
      },
      "tileOverrides": [
        {
          "x": 1,
          "y": 14,
          "tile": 128
        },
        {
          "x": 1,
          "y": 15,
          "tile": 136
        },
        {
          "x": 1,
          "y": 16,
          "tile": 136
        },
        {
          "x": 1,
          "y": 17,
          "tile": 137
        }
      ],
      "placementHighlights": [
        {
          "type": "T",
          "x": 1,
          "y": 12,
          "rotation": 1
        },
        {
          "type": "I",
          "x": 0,
          "y": 14,
          "rotation": 1
        }
      ],
      "placementBlink": true,
      "highlight": false,
      "showNext": false,
      "caption": "Four rows are ready for a Tetris; the left well stays open."
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "ticks": 96,
      "tileOverrides": [
        {
          "x": 1,
          "y": 14,
          "tile": 128
        },
        {
          "x": 1,
          "y": 15,
          "tile": 136
        },
        {
          "x": 1,
          "y": 16,
          "tile": 136
        },
        {
          "x": 1,
          "y": 17,
          "tile": 137
        }
      ],
      "motif": true,
      "blink": true,
      "highlight": false,
      "showNext": false,
      "caption": "Notice how L leaves space for the vertical I tuck."
    }
  ],
  "motionVerified": true,
  "section": "VITS"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-vits-t-east"]=situation;})(globalThis);
