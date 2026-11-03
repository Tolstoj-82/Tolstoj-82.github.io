// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Gun",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "T",
      "x": 2,
      "y": 13,
      "rotation": 3
    },
    "adjusted": {
      "type": "T",
      "x": 2,
      "y": 13,
      "rotation": 0
    },
    "next": {
      "type": "J",
      "x": 0,
      "y": 15,
      "rotation": 3
    }
  },
  "description": "Lay T flat to form the overhang, then tuck J right underneath it to flatten the surface.",
  "stack": [
    "....sSSSSS",
    "..ssSSSSSS",
    "..sSSSSSSS"
  ],
  "frames": [
    {
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "active": {
        "type": "T",
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
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "T",
        "x": 2,
        "y": 13,
        "rotation": 3,
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
        "type": "T",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "T",
        "x": 2,
        "y": 13,
        "rotation": 3,
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
      "caption": "Lay T flat to form the overhang, then tuck J right underneath it to flatten the surface.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "T",
        "x": 2,
        "y": 13,
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
      "caption": "Next: J fits beside the adjusted T.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "referenceGhost": {
        "type": "T",
        "x": 2,
        "y": 13,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "J",
        "x": 0,
        "y": 15,
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
      "caption": "Place T in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "T",
        "x": 2,
        "y": 13
      },
      "showNext": true,
      "lessonStage": 5,
      "next": "J",
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "Bring in J.",
      "ticks": 2,
      "rows": {
        "14": "..TTT.....",
        "15": "...TLLLLLL"
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
      "caption": "Lower J along the wall, below the overhang.",
      "ticks": 144,
      "active": {
        "type": "J",
        "x": -1,
        "y": 15,
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
      "caption": "Press Right once to tuck J beneath the overhang.",
      "ticks": 36,
      "active": {
        "type": "J",
        "x": 0,
        "y": 15,
        "rotation": 3
      },
      "showNext": false,
      "lessonStage": 6,
      "next": "J",
      "buttons": [
        "Right"
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
        "15": ".JJTLLLLLL",
        "16": ".JLLLLLLLL",
        "17": ".JLLLLLLLL"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "T",
          "x": 2,
          "y": 13,
          "rotation": 0
        },
        {
          "type": "J",
          "x": 0,
          "y": 15,
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-gun"]=situation;})(globalThis);
