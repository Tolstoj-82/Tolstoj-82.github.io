// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "S-Z Koryan Thing",
  "chapter": "Adjustments",
  "description": "Mirrored from the NES reference: Z first, S next on Game Boy. Adjust for the pair rather than the default flat placement.",
  "stack": [
    "......SSSS",
    ".S....SSSS",
    ".Ss..sSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 2,
      "y": 15,
      "rotation": 0
    },
    "adjusted": {
      "type": "Z",
      "x": 4,
      "y": 15,
      "rotation": 1
    },
    "next": {
      "type": "S",
      "x": 2,
      "y": 15,
      "rotation": 1
    }
  },
  "frames": [
    {
      "next": "S",
      "showNext": true,
      "highlight": false,
      "step": "1",
      "caption": "The motif: the two stack corners that the Z and S will enclose.",
      "ticks": 96,
      "motif": true,
      "blink": true,
      "lessonStage": 1,
      "active": {
        "type": "Z",
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
      "caption": "Default: Z would normally lie flat here. Compare this with the next-piece adjustment.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 2,
        "y": 15,
        "rotation": 0,
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
      "caption": "Look ahead: S is next. The flat default Z would block its landing position.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 2,
        "y": 15,
        "rotation": 0,
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
      "caption": "Adjusted: stand Z upright farther right, leaving room for S alongside it.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 4,
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
      "caption": "Next: the upright S will fit here beside the adjusted Z. Compare the two ghosts.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "Z",
        "x": 4,
        "y": 15,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "S",
        "x": 2,
        "y": 15,
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
      "caption": "Turn Z upright and place it in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 4,
        "y": 15,
        "rotation": 1
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
      "caption": "Bring in the next S. The adjacent landing space is still open.",
      "ticks": 2,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "15": ".....ZLLLL",
        "16": ".L..ZZLLLL",
        "17": ".LL.ZLLLLL"
      },
      "lessonStage": 6
    },
    {
      "next": "S",
      "showNext": false,
      "highlight": false,
      "step": "6a",
      "caption": "Turn S upright and lower it beside Z.",
      "ticks": 144,
      "active": {
        "type": "S",
        "x": 2,
        "y": 15,
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
      "caption": "The adjusted Z and next S form a unit around the stack corners.",
      "ticks": 96,
      "rows": {
        "15": "..S..ZLLLL",
        "16": ".LSSZZLLLL",
        "17": ".LLSZLLLLL"
      },
      "placementHighlights": [
        {
          "type": "Z",
          "x": 4,
          "y": 15,
          "rotation": 1
        },
        {
          "type": "S",
          "x": 2,
          "y": 15,
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
      "caption": "Notice the motif again: each corner is wrapped by one of the two pieces.",
      "ticks": 96,
      "motif": true,
      "blink": true,
      "lessonStage": 7
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-sz-koryan"]=situation;})(globalThis);
