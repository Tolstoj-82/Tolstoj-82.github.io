// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Center Stack S spin (Ori: Center Stack Z spins)",
  "chapter": "Adjustments",
  "description": "Place T to prepare the final S spin.",
  "stack": [
    "..S.......",
    "..SS......",
    "..SS.....s",
    "..SS....sS",
    "...s..ssSS",
    "..SSssSSSS",
    "..SSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "T",
      "x": 6,
      "y": 11,
      "rotation": 1
    },
    "adjusted": {
      "type": "T",
      "x": 6,
      "y": 11,
      "rotation": 0
    },
    "next": {
      "type": "S",
      "x": 4,
      "y": 12,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
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
      "caption": "Default: the usual landing without this adjustment.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "T",
        "x": 6,
        "y": 11,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: S is next.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "T",
        "x": 6,
        "y": 11,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Place T to prepare the final S spin.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "T",
        "x": 6,
        "y": 11,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The ghost shows the final S placement after the spin.",
      "ticks": 96,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "T",
        "x": 6,
        "y": 11,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "S",
        "x": 4,
        "y": 12,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Place T in the adjusted position.",
      "ticks": 144,
      "next": "S",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 6,
        "y": 11,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": []
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in S.",
      "ticks": 2,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "12": "..LL..TTTL",
        "13": "..LL...TLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Lower S beside the motif, ready for the final inputs.",
      "ticks": 144,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 4,
        "y": 12,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ]
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "caption": "Press A or B to spin S beneath the overhang.",
      "ticks": 36,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "S",
        "x": 4,
        "y": 12,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ],
      "buttonOptions": [
        "B",
        "A"
      ]
    },
    {
      "step": "7",
      "lessonStage": 7,
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "T",
          "x": 6,
          "y": 11,
          "rotation": 0
        },
        {
          "type": "S",
          "x": 4,
          "y": 12,
          "rotation": 0
        }
      ],
      "placementBlink": true,
      "blink": true,
      "rows": {
        "13": "..LL.SSTLL",
        "14": "...LSSLLLL"
      }
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "caption": "Notice the motif around the completed pair.",
      "ticks": 96,
      "next": "S",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ],
  "section": "Good but Situational"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-center-stack-s-spin"]=situation;})(globalThis);
