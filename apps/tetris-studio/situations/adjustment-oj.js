// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "OL adjustment (Ori: Oj)",
  "chapter": "Adjustments",
  "description": "Move O inward so L can descend along the left wall, then tuck right underneath O.",
  "stack": [
    "....SSSSSS",
    "....SSSSSS",
    "...sSSSSSS",
    ".sSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "O",
      "x": 0,
      "y": 14,
      "rotation": 0
    },
    "adjusted": {
      "type": "O",
      "x": 1,
      "y": 13,
      "rotation": 0
    },
    "next": {
      "type": "L",
      "x": 0,
      "y": 14,
      "rotation": 3
    }
  },
  "frames": [
    {
      "next": "L",
      "showNext": true,
      "highlight": false,
      "step": "1",
      "caption": "The motif: the stack edge surrounding the two adjusted landing positions.",
      "ticks": 96,
      "motif": true,
      "blink": true,
      "lessonStage": 1,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      }
    },
    {
      "next": "L",
      "showNext": true,
      "highlight": false,
      "step": "2",
      "caption": "Default: O would normally land here, blocking the space wanted by the next piece.",
      "ticks": 96,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "O",
        "x": 0,
        "y": 14,
        "rotation": 0,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 2
    },
    {
      "next": "L",
      "showNext": true,
      "highlight": false,
      "step": "3",
      "caption": "Look ahead: L is next. Compare the default with the adjustment.",
      "ticks": 96,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "O",
        "x": 0,
        "y": 14,
        "rotation": 0,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true,
      "lessonStage": 3
    },
    {
      "next": "L",
      "showNext": true,
      "highlight": false,
      "step": "4",
      "caption": "Adjusted: Move O inward and one row higher so the next L can use the wall-side pocket. This pattern has many variants.",
      "ticks": 96,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "O",
        "x": 1,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 4
    },
    {
      "step": "4a",
      "caption": "Next: L fits here beside the adjusted O.",
      "ticks": 96,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "O",
        "x": 1,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "L",
        "x": 0,
        "y": 14,
        "rotation": 3,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 4
    },
    {
      "next": "L",
      "showNext": true,
      "highlight": false,
      "step": "5",
      "caption": "Place O in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "O",
        "x": 1,
        "y": 13,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 4,
      "buttons": [],
      "lessonStage": 5
    },
    {
      "next": "L",
      "showNext": false,
      "highlight": false,
      "step": "6",
      "caption": "Bring in the next L. Its landing space is still available.",
      "ticks": 2,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "14": "..OOLLLLLL",
        "15": "..OOLLLLLL"
      },
      "lessonStage": 6
    },
    {
      "next": "L",
      "showNext": false,
      "highlight": false,
      "step": "6a",
      "caption": "Lower L along the left wall until its foot is below O.",
      "ticks": 144,
      "active": {
        "type": "L",
        "x": -1,
        "y": 14,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 4,
      "buttons": [
        "B"
      ],
      "lessonStage": 6
    },
    {
      "step": "6b",
      "caption": "Press Right once to tuck L neatly underneath O.",
      "ticks": 36,
      "next": "L",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 0,
        "y": 14,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "lessonStage": 6
    },
    {
      "next": "L",
      "showNext": false,
      "highlight": false,
      "step": "7",
      "caption": "The two placements form the adjusted unit.",
      "ticks": 96,
      "rows": {
        "0": "..........",
        "1": "..........",
        "2": "..........",
        "3": "..........",
        "4": "..........",
        "5": "..........",
        "6": "..........",
        "7": "..........",
        "8": "..........",
        "9": "..........",
        "10": "..........",
        "11": "..........",
        "12": "..........",
        "13": "..........",
        "14": ".LOOLLLLLL",
        "15": ".LOOLLLLLL",
        "16": ".LLLLLLLLL",
        "17": ".LLLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "O",
          "x": 1,
          "y": 13,
          "rotation": 0
        },
        {
          "type": "L",
          "x": 0,
          "y": 14,
          "rotation": 3
        }
      ],
      "placementBlink": true,
      "blink": true,
      "lessonStage": 7
    },
    {
      "next": "L",
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-oj"]=situation;})(globalThis);
