// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Blue Sponge",
  "chapter": "Adjustments",
  "description": "Keep L unrotated until you know whether the next Z or T needs this adjustment.",
  "stack": [
    ".........S",
    "........SS",
    ".......SSS",
    ".......SSS",
    ".SSs...SSS",
    ".SSs..sSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "L",
      "x": 3,
      "y": 14,
      "rotation": 3
    },
    "adjusted": {
      "type": "L",
      "x": 3,
      "y": 14,
      "rotation": 1
    },
    "next": {
      "type": "Z",
      "x": 5,
      "y": 14,
      "rotation": 1
    },
    "alternatives": [
      {
        "type": "Z",
        "x": 5,
        "y": 14,
        "rotation": 1
      },
      {
        "type": "T",
        "x": 4,
        "y": 14,
        "rotation": 3
      }
    ]
  },
  "frames": [
    {
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "step": "1",
      "caption": "The motif: the stack edge that supports the adjustment.",
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
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "step": "2",
      "caption": "Default: L would normally go here. Compare the space it leaves for the next piece.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 3,
        "y": 14,
        "rotation": 3,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 2
    },
    {
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "step": "3",
      "caption": "Look ahead: Z is next. The default placement blocks its intended landing space.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 3,
        "y": 14,
        "rotation": 3,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true,
      "lessonStage": 3
    },
    {
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "step": "4",
      "caption": "Adjusted: Keep L unrotated until you know whether the next Z or T needs this adjustment.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 3,
        "y": 14,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 4
    },
    {
      "step": "4a",
      "caption": "Next: Z will fit here beside the adjusted L.",
      "ticks": 96,
      "next": "Z",
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
        "x": 3,
        "y": 14,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "Z",
        "x": 5,
        "y": 14,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 4
    },
    {
      "next": "Z",
      "showNext": true,
      "highlight": false,
      "step": "5",
      "caption": "Place L in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "L",
        "x": 3,
        "y": 14,
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
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "step": "6",
      "caption": "Bring in the next Z. The required space is still open.",
      "ticks": 2,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "14": "...LL..LLL",
        "15": ".LLLL..LLL",
        "16": ".LLLL.LLLL"
      },
      "lessonStage": 6
    },
    {
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "step": "6a",
      "caption": "Turn Z upright and lower it into the space left by L.",
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 5,
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
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "step": "7",
      "caption": "The two adjusted placements form a unit.",
      "ticks": 96,
      "rows": {
        "14": "...LL.ZLLL",
        "15": ".LLLLZZLLL",
        "16": ".LLLLZLLLL"
      },
      "placementHighlights": [
        {
          "type": "L",
          "x": 3,
          "y": 14,
          "rotation": 1
        },
        {
          "type": "Z",
          "x": 5,
          "y": 14,
          "rotation": 1
        }
      ],
      "placementBlink": true,
      "blink": true,
      "lessonStage": 7
    },
    {
      "next": "Z",
      "showNext": false,
      "highlight": false,
      "step": "7a",
      "caption": "Notice the motif again and how it supports the adjusted unit.",
      "ticks": 96,
      "motif": true,
      "blink": true,
      "lessonStage": 7
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-blue-sponge"]=situation;})(globalThis);
