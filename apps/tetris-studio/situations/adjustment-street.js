// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Z for T tuck: Street (Ori: S for T tuck)",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 1,
      "y": 15,
      "rotation": 1
    },
    "adjusted": {
      "type": "Z",
      "x": 2,
      "y": 14,
      "rotation": 0
    },
    "next": {
      "type": "T",
      "x": 0,
      "y": 15,
      "rotation": 3
    }
  },
  "description": "Lay Z flat on the shelf, lower T at the wall, then tuck T right beneath the overhang.",
  "stack": [
    ".....sSSSS",
    "..sssSSSSS"
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
        "x": 1,
        "y": 15,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 2,
      "highlight": false,
      "blink": true,
      "step": "2"
    },
    {
      "caption": "Look ahead: T is next.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 1,
        "y": 15,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "showNext": true,
      "lessonStage": 3,
      "highlight": false,
      "blink": true,
      "step": "3"
    },
    {
      "caption": "Lay Z flat on the shelf, lower T at the wall, then tuck T right beneath the overhang.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "Z",
        "x": 2,
        "y": 14,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "highlight": false,
      "blink": true,
      "step": "4"
    },
    {
      "caption": "Next: T fits beside the adjusted Z.",
      "ticks": 96,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0
      },
      "referenceGhost": {
        "type": "Z",
        "x": 2,
        "y": 14,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "T",
        "x": 0,
        "y": 15,
        "rotation": 3,
        "label": "Next"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "highlight": false,
      "blink": true,
      "step": "4a"
    },
    {
      "caption": "Place Z in the adjusted position.",
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 2,
        "y": 14
      },
      "showNext": true,
      "lessonStage": 5,
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "Bring in T.",
      "ticks": 2,
      "rows": {
        "15": "..ZZ......",
        "16": "...ZZLLLLL"
      },
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "showNext": false,
      "lessonStage": 6,
      "highlight": false,
      "step": "6"
    },
    {
      "caption": "Lower T along the wall, stopping below Z.",
      "ticks": 144,
      "active": {
        "type": "T",
        "x": -1,
        "y": 15,
        "rotation": 3
      },
      "showNext": false,
      "lessonStage": 6,
      "buttons": [
        "B"
      ],
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "6a"
    },
    {
      "caption": "Press Right once to tuck T underneath Z.",
      "ticks": 36,
      "active": {
        "type": "T",
        "x": 0,
        "y": 15,
        "rotation": 3
      },
      "showNext": false,
      "lessonStage": 6,
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
        "15": ".TZZ......",
        "16": ".TTZZLLLLL",
        "17": ".TLLLLLLLL"
      },
      "showNext": false,
      "placementHighlights": [
        {
          "type": "Z",
          "x": 2,
          "y": 14,
          "rotation": 0
        },
        {
          "type": "T",
          "x": 0,
          "y": 15,
          "rotation": 3
        }
      ],
      "placementBlink": true,
      "lessonStage": 7,
      "highlight": false,
      "blink": true,
      "step": "7"
    },
    {
      "caption": "Notice the motif again around the completed pair.",
      "ticks": 96,
      "showNext": false,
      "lessonStage": 7,
      "highlight": false,
      "blink": true,
      "step": "7a",
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-street"]=situation;})(globalThis);
