// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "VITS: J North",
  "chapter": "Adjustments",
  "description": "Lay J across the shelf so its foot fills the notch. The overhang leaves room for I to tuck right underneath.",
  "stack": [
    "....S.....",
    "....s.S.S.",
    "..s.sSSSSS",
    "..ssSSSSSS",
    "..sSSSSSSS",
    "..sSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "J",
      "x": 0,
      "y": 15,
      "rotation": 1
    },
    "adjusted": {
      "type": "J",
      "x": 1,
      "y": 12,
      "rotation": 0
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
        "type": "J",
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
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 0,
        "y": 15,
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
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 0,
        "y": 15,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Lay J across the shelf so its foot fills the notch. The overhang leaves room for I to tuck right underneath.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 1,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The I ghost shows the final tuck underneath J.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "J",
        "x": 1,
        "y": 12,
        "rotation": 0,
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
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "next": "I",
      "showNext": true,
      "highlight": false,
      "caption": "Place J above the channel."
    },
    {
      "step": "5a",
      "lessonStage": 5,
      "ticks": 24,
      "active": {
        "type": "J",
        "x": 1,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "J",
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
      "caption": "Move J left."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "ticks": 72,
      "active": {
        "type": "J",
        "x": 1,
        "y": 12,
        "rotation": 0
      },
      "animationFrom": {
        "type": "J",
        "x": 1,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 12,
      "buttons": [],
      "next": "I",
      "showNext": true,
      "highlight": false,
      "caption": "Let gravity lower J."
    },
    {
      "step": "6",
      "lessonStage": 6,
      "ticks": 2,
      "rows": {
        "13": ".JJJL.L.L.",
        "14": "..LJLLLLLL"
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
      "caption": "Press Right once to tuck I under J."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "13": ".JJJL.L.L.",
        "14": ".ILJLLLLLL",
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
          "type": "J",
          "x": 1,
          "y": 12,
          "rotation": 0
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-vits-j-north"]=situation;})(globalThis);
