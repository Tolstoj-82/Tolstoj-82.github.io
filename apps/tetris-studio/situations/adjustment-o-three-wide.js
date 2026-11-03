// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "O for L/J: 3-wide hole",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "O",
      "x": 6,
      "y": 14,
      "rotation": 0
    },
    "adjusted": {
      "type": "O",
      "x": 7,
      "y": 14,
      "rotation": 0
    },
    "next": {
      "type": "J",
      "x": 6,
      "y": 14,
      "rotation": 3
    },
    "alternatives": [
      {
        "type": "J",
        "x": 6,
        "y": 14,
        "rotation": 3
      },
      {
        "type": "L",
        "x": 8,
        "y": 14,
        "rotation": 1,
        "adjusted": {
          "type": "O",
          "x": 6,
          "y": 14,
          "rotation": 0
        }
      }
    ]
  },
  "description": "In a three-wide hole, shift O toward the wall to leave a useful landing for the next hook.",
  "stack": [
    "......S...",
    "....SSs...",
    "..SSSSs...",
    ".SSSSSSsss"
  ],
  "frames": [
    {
      "caption": "The motif: the stack edge surrounding the two adjusted landing positions.",
      "ticks": 96,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0
      },
      "showNext": true,
      "lessonStage": 1,
      "next": "J",
      "highlight": false,
      "blink": true,
      "step": "1",
      "motif": true
    },
    {
      "caption": "Default: O would normally land here, blocking the space wanted by the next piece.",
      "ticks": 96,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "O",
        "x": 6,
        "y": 14,
        "rotation": 0,
        "label": "Default"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 2,
      "next": "J",
      "highlight": false,
      "blink": true,
      "step": "2"
    },
    {
      "caption": "Look ahead: J is next. Compare the default with the adjustment.",
      "ticks": 96,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "O",
        "x": 6,
        "y": 14,
        "rotation": 0,
        "label": "Default"
      },
      "nextBlink": true,
      "showNext": true,
      "lessonStage": 3,
      "next": "J",
      "highlight": false,
      "blink": true,
      "step": "3"
    },
    {
      "caption": "Adjusted: In a three-wide hole, shift O toward the wall to leave a useful landing for the next hook.",
      "ticks": 96,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "O",
        "x": 7,
        "y": 14,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "J",
      "highlight": false,
      "blink": true,
      "step": "4"
    },
    {
      "caption": "Next: J fits here beside the adjusted O.",
      "ticks": 96,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0
      },
      "referenceGhost": {
        "type": "O",
        "x": 7,
        "y": 14,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "J",
        "x": 6,
        "y": 14,
        "rotation": 3,
        "label": "Next"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "J",
      "highlight": false,
      "blink": true,
      "step": "4a"
    },
    {
      "caption": "Place O in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "O",
        "x": 7,
        "y": 14
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "J",
      "animate": true,
      "fallFirst": 4,
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "Bring in the next J. Its landing space is still available.",
      "ticks": 2,
      "rows": {
        "15": "....LLL.OO",
        "16": "..LLLLL.OO"
      },
      "active": {
        "type": "J",
        "x": 3,
        "y": 0
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "J",
      "highlight": false,
      "step": "6"
    },
    {
      "caption": "Place J in the space left by O.",
      "ticks": 144,
      "active": {
        "type": "J",
        "x": 6,
        "y": 14,
        "rotation": 3
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "J",
      "buttons": [
        "B"
      ],
      "animate": true,
      "fallFirst": 4,
      "highlight": false,
      "step": "6a"
    },
    {
      "caption": "The two placements form the adjusted unit.",
      "ticks": 96,
      "rows": {
        "14": "......LJJ.",
        "15": "....LLLJOO",
        "16": "..LLLLLJOO"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "O",
          "x": 7,
          "y": 14,
          "rotation": 0
        },
        {
          "type": "J",
          "x": 6,
          "y": 14,
          "rotation": 3
        }
      ],
      "placementBlink": true,
      "lessonStage": 7,
      "next": "J",
      "highlight": false,
      "blink": true,
      "step": "7"
    },
    {
      "caption": "Notice the motif again and how the two pieces fit around it.",
      "ticks": 96,
      "showNext": false,
      "lessonStage": 7,
      "next": "J",
      "highlight": false,
      "blink": true,
      "step": "7a",
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-o-three-wide"]=situation;})(globalThis);
