// Mirrored Game Boy adjustment. Default checked with the free-play AI.
(function(root){const situation={
  "title": "Australian tucks",
  "chapter": "Adjustments",
  "description": "Tuck L right beneath the overhang, then tuck O right into the pocket it creates.",
  "stack": [
    "...sSSSSSS",
    "....sSSSSS",
    "....sSSSSS",
    "....sSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "L",
      "x": 1,
      "y": 16,
      "rotation": 2
    },
    "adjusted": {
      "type": "L",
      "x": 2,
      "y": 15,
      "rotation": 1
    },
    "next": {
      "type": "O",
      "x": 0,
      "y": 15,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
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
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 1,
        "y": 16,
        "rotation": 2,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: O is next.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 1,
        "y": 16,
        "rotation": 2,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Tuck L right beneath the overhang, then tuck O right into the pocket it creates.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "L",
        "x": 2,
        "y": 15,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next O fits beside the adjusted L.",
      "ticks": 96,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "L",
        "x": 2,
        "y": 15,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "O",
        "x": 0,
        "y": 15,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Lower L beside the overhang, ready to tuck right.",
      "ticks": 144,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 1,
        "y": 15,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ]
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "caption": "Press Right once to tuck L underneath the overhang.",
      "ticks": 36,
      "next": "O",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 2,
        "y": 15,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ]
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in O.",
      "ticks": 2,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "15": "..LLLLLLLL",
        "16": "...LLLLLLL",
        "17": "...LLLLLLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Lower O along the wall beside L.",
      "ticks": 144,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "O",
        "x": -1,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": []
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "caption": "Press Right once to tuck O into the pocket beside L.",
      "ticks": 36,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "O",
        "x": 0,
        "y": 15,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ]
    },
    {
      "step": "7",
      "lessonStage": 7,
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "placementHighlights": [
        {
          "type": "L",
          "x": 2,
          "y": 15,
          "rotation": 1
        },
        {
          "type": "O",
          "x": 0,
          "y": 15,
          "rotation": 0
        }
      ],
      "placementBlink": true,
      "blink": true,
      "rows": {
        "16": ".OOLLLLLLL",
        "17": ".OOLLLLLLL"
      }
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "caption": "Notice the motif around the completed pair.",
      "ticks": 96,
      "next": "O",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ],
  "section": "Dicey"
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-australian-tucks"]=situation;})(globalThis);
