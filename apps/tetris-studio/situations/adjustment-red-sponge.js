// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Red Sponge",
  "chapter": "Adjustments",
  "description": "Keep the J at spawn until the next S or T tells you whether to reverse the hook.",
  "stack": [
    ".SSS...sSS",
    ".SSSs..sSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "J",
      "x": 5,
      "y": 14,
      "rotation": 1
    },
    "adjusted": {
      "type": "J",
      "x": 5,
      "y": 14,
      "rotation": 3
    },
    "next": {
      "type": "S",
      "x": 4,
      "y": 14,
      "rotation": 1
    },
    "alternatives": [
      {
        "type": "S",
        "x": 4,
        "y": 14,
        "rotation": 1
      },
      {
        "type": "T",
        "x": 4,
        "y": 14,
        "rotation": 1
      }
    ]
  },
  "frames": [
    {
      "next": "S",
      "showNext": true,
      "highlight": false,
      "step": "1",
      "caption": "The motif: the stack edge surrounding the two adjusted landing positions.",
      "ticks": 96,
      "motif": true,
      "blink": true,
      "lessonStage": 1,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      }
    },
    {
      "next": "S",
      "showNext": true,
      "highlight": false,
      "step": "2",
      "caption": "Default: J would normally land here, blocking the space wanted by the next piece.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 5,
        "y": 14,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 2
    },
    {
      "next": "S",
      "showNext": true,
      "highlight": false,
      "step": "3",
      "caption": "Look ahead: S is next. Compare the default with the adjustment.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 5,
        "y": 14,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true,
      "lessonStage": 3
    },
    {
      "next": "S",
      "showNext": true,
      "highlight": false,
      "step": "4",
      "caption": "Adjusted: Keep the J at spawn until the next S or T tells you whether to reverse the hook.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 5,
        "y": 14,
        "rotation": 3,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 4
    },
    {
      "step": "4a",
      "caption": "Next: S fits here beside the adjusted J.",
      "ticks": 96,
      "next": "S",
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
        "x": 5,
        "y": 14,
        "rotation": 3,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "S",
        "x": 4,
        "y": 14,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 4
    },
    {
      "next": "S",
      "showNext": true,
      "highlight": false,
      "step": "5",
      "caption": "Place J in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "J",
        "x": 5,
        "y": 14,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 4,
      "buttons": [
        "B"
      ],
      "lessonStage": 5
    },
    {
      "next": "S",
      "showNext": false,
      "highlight": false,
      "step": "6",
      "caption": "Bring in the next S. Its landing space is still available.",
      "ticks": 2,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "14": "......JJ..",
        "15": ".LLL..JLLL",
        "16": ".LLLL.JLLL"
      },
      "lessonStage": 6
    },
    {
      "next": "S",
      "showNext": false,
      "highlight": false,
      "step": "6a",
      "caption": "Place S in the space left by J.",
      "ticks": 144,
      "active": {
        "type": "S",
        "x": 4,
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
      "next": "S",
      "showNext": false,
      "highlight": false,
      "step": "7",
      "caption": "The two placements form the adjusted unit.",
      "ticks": 96,
      "rows": {
        "14": "....S.JJ..",
        "15": ".LLLSSJLLL",
        "16": ".LLLLSJLLL"
      },
      "placementHighlights": [
        {
          "type": "J",
          "x": 5,
          "y": 14,
          "rotation": 3
        },
        {
          "type": "S",
          "x": 4,
          "y": 14,
          "rotation": 1
        }
      ],
      "placementBlink": true,
      "blink": true,
      "lessonStage": 7
    },
    {
      "next": "S",
      "showNext": false,
      "highlight": false,
      "step": "7a",
      "caption": "Notice the motif again and how the two pieces fit around it.",
      "ticks": 96,
      "motif": true,
      "blink": true,
      "lessonStage": 7
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-red-sponge"]=situation;})(globalThis);
