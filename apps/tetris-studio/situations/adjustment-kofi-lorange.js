// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Kofi 1.37: level 25 adjustment (Lorange juice)",
  "chapter": "Adjustments",
  "description": "Bring J across the board and lay it flat, leaving the wall-side landing for L. This is a long crossing at high gravity.",
  "stack": [
    ".....sSSSS",
    "...ssSSSSS",
    ".ssSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "J",
      "x": 8,
      "y": 12,
      "rotation": 1
    },
    "adjusted": {
      "type": "J",
      "x": 2,
      "y": 14,
      "rotation": 2
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
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
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
      "motif": true,
      "blink": true
    },
    {
      "step": "2",
      "lessonStage": 2,
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
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
      "ghost": {
        "type": "J",
        "x": 8,
        "y": 12,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: L is next.",
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
      "ghost": {
        "type": "J",
        "x": 8,
        "y": 12,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Bring J across the board and lay it flat, leaving the wall-side landing for L. This is a long crossing at high gravity.",
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
      "ghost": {
        "type": "J",
        "x": 2,
        "y": 14,
        "rotation": 2,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "Next: L fits beside the adjusted J.",
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
        "x": 2,
        "y": 14,
        "rotation": 2,
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
      "blink": true
    },
    {
      "step": "5a",
      "lessonStage": 5,
      "caption": "Start the crossing with the first quarter-turn of J.",
      "ticks": 24,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 3,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ]
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Turn J once more and cross left before the stack gets too high.",
      "ticks": 144,
      "next": "L",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "J",
        "x": 2,
        "y": 14,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ]
    },
    {
      "step": "6",
      "lessonStage": 6,
      "caption": "Bring in L.",
      "ticks": 2,
      "next": "L",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
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
        "14": "..J.......",
        "15": "..JJJLLLLL",
        "16": "...LLLLLLL",
        "17": ".LLLLLLLLL"
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Lower L along the wall, below the hook.",
      "ticks": 144,
      "next": "L",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "L",
        "x": -1,
        "y": 14,
        "rotation": 3
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
      "caption": "Press Right once to tuck L under J.",
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
      ]
    },
    {
      "step": "7",
      "lessonStage": 7,
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "next": "L",
      "showNext": false,
      "highlight": false,
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
        "14": ".LJ.......",
        "15": ".LJJJLLLLL",
        "16": ".LLLLLLLLL",
        "17": ".LLLLLLLLL"
      },
      "placementHighlights": [
        {
          "type": "J",
          "x": 2,
          "y": 14,
          "rotation": 2
        },
        {
          "type": "L",
          "x": 0,
          "y": 14,
          "rotation": 3
        }
      ],
      "placementBlink": true,
      "blink": true
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "caption": "Notice the motif again around the completed pair.",
      "ticks": 96,
      "next": "L",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-kofi-lorange"]=situation;})(globalThis);
