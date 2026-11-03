// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Z for S spin: High Chair (Ori: S for Z spin)",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 6,
      "y": 15,
      "rotation": 1
    },
    "adjusted": {
      "type": "Z",
      "x": 7,
      "y": 13,
      "rotation": 1
    },
    "next": {
      "type": "S",
      "x": 5,
      "y": 15,
      "rotation": 0
    }
  },
  "description": "Raise Z on the side of the tower, leaving the lower notch for a vertical S that spins flat.",
  "stack": [
    ".........s",
    ".........s",
    "........sS",
    "........sS",
    ".SSSs..sSS"
  ],
  "frames": [
    {
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "showNext": true,
      "lessonStage": 1,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "1",
      "motif": true
    },
    {
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 6,
        "y": 15,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 2,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "2"
    },
    {
      "caption": "Look ahead: S is next.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 6,
        "y": 15,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "showNext": true,
      "lessonStage": 3,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "3"
    },
    {
      "caption": "Raise Z on the side of the tower, leaving the lower notch for a vertical S that spins flat.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 7,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "4"
    },
    {
      "caption": "Next: S fits beside the adjusted Z.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "referenceGhost": {
        "type": "Z",
        "x": 7,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "S",
        "x": 5,
        "y": 15,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "4a"
    },
    {
      "caption": "Place Z in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 7,
        "y": 13,
        "rotation": 1
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "S",
      "buttons": [
        "B"
      ],
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "Bring in S.",
      "ticks": 2,
      "rows": {
        "13": "........ZL",
        "14": ".......ZZL",
        "15": ".......ZLL"
      },
      "active": {
        "type": "S",
        "x": 3,
        "y": 0
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "S",
      "highlight": false,
      "step": "6"
    },
    {
      "caption": "Turn S upright and lower it into the notch.",
      "ticks": 144,
      "active": {
        "type": "S",
        "x": 5,
        "y": 15,
        "rotation": 1
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "S",
      "buttons": [
        "B"
      ],
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "6a"
    },
    {
      "caption": "Press either B or A to spin S flat.",
      "ticks": 120,
      "active": {
        "type": "S",
        "x": 5,
        "y": 15
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "S",
      "buttons": [
        "B"
      ],
      "buttonOptions": [
        "B",
        "A"
      ],
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "6b"
    },
    {
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "rows": {
        "16": "......SSLL",
        "17": ".LLLLSSLLL"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "Z",
          "x": 7,
          "y": 13,
          "rotation": 1
        },
        {
          "type": "S",
          "x": 5,
          "y": 15,
          "rotation": 0
        }
      ],
      "placementBlink": true,
      "lessonStage": 7,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "7"
    },
    {
      "caption": "Notice the motif again around the completed pair.",
      "ticks": 96,
      "showNext": false,
      "lessonStage": 7,
      "next": "S",
      "highlight": false,
      "blink": true,
      "step": "7a",
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-high-chair"]=situation;})(globalThis);
