// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Pump Fake Passer Upper",
  "motionVerified": true,
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "I",
      "x": 5,
      "y": 12,
      "rotation": 1
    },
    "adjusted": {
      "type": "I",
      "x": 1,
      "y": 11,
      "rotation": 0
    },
    "next": {
      "type": "L",
      "x": 5,
      "y": 13,
      "rotation": 1
    }
  },
  "description": "Keep I flat across columns 2–5. The next L fills the adjacent hook-shaped gap in columns 6–7, making the column-1 Tetris well ready.",
  "stack": [
    ".......SSS",
    ".......sSS",
    ".sssss.sSS",
    ".SSSSs.sSS",
    ".SSSSSsSSS",
    ".SSSSSSSSS"
  ],
  "frames": [
    {
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "showNext": true,
      "lessonStage": 1,
      "next": "L",
      "highlight": false,
      "blink": true,
      "step": "1",
      "motif": true
    },
    {
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "ghost": {
        "type": "I",
        "x": 5,
        "y": 12,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 2,
      "next": "L",
      "highlight": false,
      "blink": true,
      "step": "2"
    },
    {
      "caption": "Look ahead: L is next.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "ghost": {
        "type": "I",
        "x": 5,
        "y": 12,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "showNext": true,
      "lessonStage": 3,
      "next": "L",
      "highlight": false,
      "blink": true,
      "step": "3"
    },
    {
      "caption": "Keep I flat across columns 2–5. The next L fills the adjacent hook-shaped gap in columns 6–7, making the column-1 Tetris well ready.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "ghost": {
        "type": "I",
        "x": 1,
        "y": 11,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "L",
      "highlight": false,
      "blink": true,
      "step": "4"
    },
    {
      "caption": "Place L beside the flat I, filling the three-deep hook without a tuck.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "referenceGhost": {
        "type": "I",
        "x": 1,
        "y": 11,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "L",
        "x": 5,
        "y": 13,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "L",
      "highlight": false,
      "blink": true,
      "step": "4a"
    },
    {
      "caption": "Keep I in its horizontal spawning orientation.",
      "ticks": 2,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "L",
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "Move I left to columns 2–5.",
      "ticks": 24,
      "active": {
        "type": "I",
        "x": 1,
        "y": -1
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "L",
      "buttons": [
        "Left"
      ],
      "animate": true,
      "highlight": false,
      "step": "5a"
    },
    {
      "caption": "Let the flat I land on the shelf.",
      "ticks": 72,
      "active": {
        "type": "I",
        "x": 1,
        "y": 11
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "L",
      "animate": true,
      "highlight": false,
      "step": "5b"
    },
    {
      "caption": "Bring in L to fill the hook-shaped gap.",
      "ticks": 2,
      "rows": {
        "13": ".IIII..LLL"
      },
      "active": {
        "type": "L",
        "x": 3,
        "y": 0
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "L",
      "highlight": false,
      "step": "6"
    },
    {
      "caption": "Move L right to columns 6–7.",
      "ticks": 24,
      "active": {
        "type": "L",
        "x": 5,
        "y": 0
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "L",
      "buttons": [
        "Right"
      ],
      "animate": true,
      "highlight": false,
      "step": "6a"
    },
    {
      "caption": "Press A to point the L backbone down beside the I.",
      "ticks": 24,
      "active": {
        "type": "L",
        "x": 5,
        "y": 0,
        "rotation": 1
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "L",
      "buttons": [
        "A"
      ],
      "animate": true,
      "highlight": false,
      "step": "6b"
    },
    {
      "caption": "Let L drop into the hook-shaped gap.",
      "ticks": 78,
      "active": {
        "type": "L",
        "x": 5,
        "y": 13,
        "rotation": 1
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "L",
      "animate": true,
      "highlight": false,
      "step": "6c"
    },
    {
      "caption": "The pair fills the dependency and leaves the Tetris well in column 1 ready.",
      "ticks": 96,
      "rows": {
        "13": ".IIIILLLLL",
        "14": ".LLLLLLLLL",
        "15": ".LLLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "I",
          "x": 1,
          "y": 11,
          "rotation": 0
        },
        {
          "type": "L",
          "x": 5,
          "y": 13,
          "rotation": 1
        }
      ],
      "placementBlink": true,
      "lessonStage": 7,
      "highlight": false,
      "step": "7"
    },
    {
      "caption": "Notice how the two pieces accommodate the original hook-shaped motif.",
      "ticks": 96,
      "lessonStage": 7,
      "blink": true,
      "step": "7a",
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-pump-fake"]=situation;})(globalThis);
