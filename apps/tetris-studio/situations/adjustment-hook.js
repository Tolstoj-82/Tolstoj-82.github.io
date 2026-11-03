// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Hook",
  "chapter": "Adjustments",
  "description": "Mirrored NES hook adjustment: L first, I next. Leave the right wall clear for I.",
  "stack": [
    ".SSSSSSs..",
    ".SSSSSSs.."
  ],
  "adjustment": {
    "default": {
      "type": "L",
      "x": 7,
      "y": 15,
      "rotation": 3
    },
    "adjusted": {
      "type": "L",
      "x": 7,
      "y": 15,
      "rotation": 1
    },
    "next": {
      "type": "I",
      "x": 8,
      "y": 14,
      "rotation": 1
    }
  },
  "frames": [
    {
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "1",
      "caption": "The hook motif: the stack edge that L will cap, with space beside the wall for I.",
      "ticks": 96,
      "motif": true,
      "blink": true,
      "lessonStage": 1,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      }
    },
    {
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "2",
      "caption": "Default: the L foot would normally face the wall. That would block the next I.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 7,
        "y": 15,
        "rotation": 3,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 2
    },
    {
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "3",
      "caption": "Look ahead: I is next. Keep the wall column open for its vertical placement.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 7,
        "y": 15,
        "rotation": 3,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true,
      "lessonStage": 3
    },
    {
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "4",
      "caption": "Adjusted: turn the L foot inward, capping the stack edge instead of blocking the wall.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 7,
        "y": 15,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 4
    },
    {
      "step": "4a",
      "caption": "Next: the vertical I will fit against the wall beside the adjusted L.",
      "ticks": 96,
      "next": "I",
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
        "x": 7,
        "y": 15,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "I",
        "x": 8,
        "y": 14,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 4
    },
    {
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "5",
      "caption": "Turn L upright and lower it with the hook pointing inward.",
      "ticks": 144,
      "active": {
        "type": "L",
        "x": 7,
        "y": 15,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 4,
      "buttons": [
        "A"
      ],
      "lessonStage": 5
    },
    {
      "next": "I",
      "showNext": false,
      "highlight": false,
      "step": "6",
      "caption": "Bring in the next I. The wall column is still open.",
      "ticks": 2,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "rows": {
        "15": ".......LL.",
        "16": ".LLLLLLLL.",
        "17": ".LLLLLLLL."
      },
      "lessonStage": 6
    },
    {
      "next": "I",
      "showNext": false,
      "highlight": false,
      "step": "6a",
      "caption": "Turn I vertical and lower it against the right wall.",
      "ticks": 144,
      "active": {
        "type": "I",
        "x": 8,
        "y": 14,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 4,
      "buttons": [
        "B"
      ],
      "lessonStage": 6
    },
    {
      "next": "I",
      "showNext": false,
      "highlight": false,
      "step": "7",
      "caption": "The hook and I form a unit, creating a gentler slope on the right.",
      "ticks": 96,
      "rows": {
        "14": ".........I",
        "15": ".......LLI",
        "16": ".LLLLLLLLI",
        "17": ".LLLLLLLLI"
      },
      "placementHighlights": [
        {
          "type": "L",
          "x": 7,
          "y": 15,
          "rotation": 1
        },
        {
          "type": "I",
          "x": 8,
          "y": 14,
          "rotation": 1
        }
      ],
      "placementBlink": true,
      "blink": true,
      "lessonStage": 7
    },
    {
      "next": "I",
      "showNext": false,
      "highlight": false,
      "step": "7a",
      "caption": "Notice the motif again: the adjusted hook caps the stack edge and leaves room for I.",
      "ticks": 96,
      "motif": true,
      "blink": true,
      "lessonStage": 7
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-hook"]=situation;})(globalThis);
