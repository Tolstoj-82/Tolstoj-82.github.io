// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Pullback L (Richard L)",
  "chapter": "Adjustments",
  "description": "Often useful with a double well. Avoid this pullback when already tetris-ready; it is a next-piece adjustment, not an automatic placement.",
  "stack": [
    "...sSSSSSS",
    "...sSSSSSS",
    "..sSSSSSSS",
    "..SSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "J",
      "x": 0,
      "y": 15,
      "rotation": 3
    },
    "adjusted": {
      "type": "J",
      "x": 1,
      "y": 13,
      "rotation": 3
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
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "1",
      "caption": "The motif: the stack edge that supports the adjustment.",
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
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "2",
      "caption": "Default: J would normally go here. Compare the space it leaves for the next piece.",
      "ticks": 96,
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
      "caption": "Look ahead: I is next. The default placement blocks its intended landing space.",
      "ticks": 96,
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
      "caption": "With this double well, pull J inward. Do not pull back automatically when the board is already tetris-ready.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 1,
        "y": 13,
        "rotation": 3,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 4
    },
    {
      "step": "4a",
      "caption": "Next: I will fit here beside the adjusted J.",
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
        "y": 13,
        "rotation": 3,
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
      "blink": true,
      "lessonStage": 4
    },
    {
      "next": "I",
      "showNext": true,
      "highlight": false,
      "step": "5",
      "caption": "Place J in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "J",
        "x": 1,
        "y": 13,
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
      "next": "I",
      "showNext": false,
      "highlight": false,
      "step": "6",
      "caption": "Bring in the next I. The required space is still open.",
      "ticks": 2,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "rows": {
        "13": "..JJ......",
        "14": "..JLLLLLLL",
        "15": "..JLLLLLLL"
      },
      "lessonStage": 6
    },
    {
      "next": "I",
      "showNext": false,
      "highlight": false,
      "step": "6a",
      "caption": "Turn I upright and lower it into the space left by J.",
      "ticks": 144,
      "active": {
        "type": "I",
        "x": 0,
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
      "caption": "The two adjusted placements form a unit.",
      "ticks": 96,
      "rows": {
        "14": ".IJLLLLLLL",
        "15": ".IJLLLLLLL",
        "16": ".ILLLLLLLL",
        "17": ".ILLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "J",
          "x": 1,
          "y": 13,
          "rotation": 3
        },
        {
          "type": "I",
          "x": 0,
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
      "caption": "Notice the motif again and how it supports the adjusted unit.",
      "ticks": 96,
      "motif": true,
      "blink": true,
      "lessonStage": 7
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-pullback-l-richard"]=situation;})(globalThis);
