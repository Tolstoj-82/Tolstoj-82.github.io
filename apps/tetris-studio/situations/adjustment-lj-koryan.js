// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "L-J Koryan Thing",
  "chapter": "Adjustments",
  "description": "Mirrored from the NES reference: J first, L next on Game Boy.",
  "stack": [
    ".SS.......",
    ".SSs..sSSS",
    ".SSs..sSSS"
  ],
  "adjustment": {
    "default": {
      "type": "J",
      "x": 4,
      "y": 15,
      "rotation": 1
    },
    "adjusted": {
      "type": "J",
      "x": 4,
      "y": 15,
      "rotation": 3
    },
    "next": {
      "type": "L",
      "x": 3,
      "y": 15,
      "rotation": 1
    }
  },
  "frames": [
    {
      "next": "L",
      "showNext": true,
      "highlight": false,
      "step": "1",
      "caption": "The adjustment motif: the stack minos the two pieces will wrap around.",
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
      "next": "L",
      "showNext": true,
      "highlight": false,
      "step": "2",
      "caption": "Default: the J would normally go here. Keep the falling piece at its spawn while comparing.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 4,
        "y": 15,
        "rotation": 1,
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
      "caption": "Look ahead: the next piece is L. The default J placement blocks its well.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 4,
        "y": 15,
        "rotation": 1,
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
      "caption": "Adjusted: turn the J the other way to keep the adjacent well open for L.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "J",
        "x": 4,
        "y": 15,
        "rotation": 3,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true,
      "lessonStage": 4
    },
    {
      "step": "4a",
      "caption": "Next: the L will fit here beside the adjusted J. Compare both landing positions.",
      "ticks": 96,
      "next": "L",
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
        "x": 4,
        "y": 15,
        "rotation": 3,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "L",
        "x": 3,
        "y": 15,
        "rotation": 1,
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
      "caption": "Place J in the adjusted position, leaving the neighbouring column open.",
      "ticks": 144,
      "active": {
        "type": "J",
        "x": 4,
        "y": 15,
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
      "next": "L",
      "showNext": false,
      "highlight": false,
      "step": "6",
      "caption": "Now bring in the next L. Its long side fits the open well beside J.",
      "ticks": 2,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "15": ".LL..JJ...",
        "16": ".LLL.JLLLL",
        "17": ".LLL.JLLLL"
      },
      "lessonStage": 6
    },
    {
      "next": "L",
      "showNext": false,
      "highlight": false,
      "step": "6a",
      "caption": "Turn L upright and lower it beside J.",
      "ticks": 144,
      "active": {
        "type": "L",
        "x": 3,
        "y": 15,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 4,
      "buttons": [
        "A"
      ],
      "lessonStage": 6
    },
    {
      "next": "L",
      "showNext": false,
      "highlight": false,
      "step": "7",
      "caption": "The adjusted J and the next L fit together. Compare the pair.",
      "ticks": 96,
      "rows": {
        "15": ".LLLLJJ...",
        "16": ".LLLLJLLLL",
        "17": ".LLLLJLLLL"
      },
      "placementHighlights": [
        {
          "type": "J",
          "x": 4,
          "y": 15,
          "rotation": 3
        },
        {
          "type": "L",
          "x": 3,
          "y": 15,
          "rotation": 1
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
      "caption": "Notice the motif again: both little pillars are capped and enclosed by the two pieces.",
      "ticks": 96,
      "motif": true,
      "blink": true,
      "lessonStage": 7
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-lj-koryan"]=situation;})(globalThis);
