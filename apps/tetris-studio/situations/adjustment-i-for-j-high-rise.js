// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "I for J: High Rise (Ori: I for L)",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "I",
      "x": 5,
      "y": 10,
      "rotation": 1
    },
    "adjusted": {
      "type": "I",
      "x": 0,
      "y": 13,
      "rotation": 1
    },
    "next": {
      "type": "J",
      "x": 1,
      "y": 13,
      "rotation": 3
    }
  },
  "description": "Cross I to the far side and keep the wall well open, then settle J beside the raised column.",
  "stack": [
    ".......SSS",
    ".......SSS",
    "...sS.SSSS",
    "...sSSSSSS",
    "..sSSSSSSS",
    ".sSSSSSSSS"
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
      "next": "J",
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
        "y": 10,
        "rotation": 1,
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
      "caption": "Look ahead: J is next.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "ghost": {
        "type": "I",
        "x": 5,
        "y": 10,
        "rotation": 1,
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
      "caption": "Cross I to the far side and keep the wall well open, then settle J beside the raised column.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "ghost": {
        "type": "I",
        "x": 0,
        "y": 13,
        "rotation": 1,
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
      "caption": "Next: J fits beside the adjusted I.",
      "ticks": 96,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1
      },
      "referenceGhost": {
        "type": "I",
        "x": 0,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "J",
        "x": 1,
        "y": 13,
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
      "caption": "Place I in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "I",
        "x": 0,
        "y": 13,
        "rotation": 1
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "J",
      "buttons": [
        "B"
      ],
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "Bring in J.",
      "ticks": 2,
      "rows": {
        "13": ".I.....LLL",
        "14": ".I.LL.LLLL",
        "15": ".I.LLLLLLL",
        "16": ".ILLLLLLLL"
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
      "caption": "Place J in the space left for it.",
      "ticks": 144,
      "active": {
        "type": "J",
        "x": 1,
        "y": 13,
        "rotation": 3
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "J",
      "buttons": [
        "B"
      ],
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "6a"
    },
    {
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "rows": {
        "13": ".IJJ...LLL",
        "14": ".IJLL.LLLL",
        "15": ".IJLLLLLLL"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "I",
          "x": 0,
          "y": 13,
          "rotation": 1
        },
        {
          "type": "J",
          "x": 1,
          "y": 13,
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
      "caption": "Notice the motif again around the completed pair.",
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-i-for-j-high-rise"]=situation;})(globalThis);
