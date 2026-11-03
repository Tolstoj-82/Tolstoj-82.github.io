// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "L pullback for I dependency (Ori: J pullback)",
  "chapter": "Adjustments",
  "description": "Pull L back one column and higher on the slope, keeping the wall open for I.",
  "stack": [
    "......s...",
    ".....SSs..",
    "...SSSSs..",
    "..SSSSSSs.",
    ".SSSSSSSs."
  ],
  "adjustment": {
    "default": {
      "type": "L",
      "x": 8,
      "y": 15,
      "rotation": 1
    },
    "adjusted": {
      "type": "L",
      "x": 7,
      "y": 13,
      "rotation": 1
    },
    "next": {
      "type": "I",
      "x": 8,
      "y": 14,
      "rotation": 1
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the stack motif around the two landing positions.",
      "ticks": 96,
      "next": "I",
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
      "caption": "Default: this is the usual landing without the next-piece adjustment.",
      "ticks": 96,
      "next": "I",
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
        "x": 8,
        "y": 15,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: I is next.",
      "ticks": 96,
      "next": "I",
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
        "x": 8,
        "y": 15,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Pull L back one column and higher on the slope, keeping the wall open for I.",
      "ticks": 96,
      "next": "I",
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
        "x": 7,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "Next: I fits beside the adjusted L.",
      "ticks": 96,
      "next": "I",
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
        "x": 7,
        "y": 13,
        "rotation": 1,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "I",
        "x": 8,
        "y": 14,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "caption": "Place L in the adjusted position.",
      "ticks": 144,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "L",
        "x": 7,
        "y": 13,
        "rotation": 1
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
      "caption": "Bring in I.",
      "ticks": 2,
      "next": "I",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
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
        "13": "......LLL.",
        "14": ".....LLLL.",
        "15": "...LLLLLL.",
        "16": "..LLLLLLL.",
        "17": ".LLLLLLLL."
      }
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "caption": "Place I in the space left for it.",
      "ticks": 144,
      "next": "I",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 8,
        "y": 14,
        "rotation": 1
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ]
    },
    {
      "step": "7",
      "lessonStage": 7,
      "caption": "Notice how the two placements work together.",
      "ticks": 96,
      "next": "I",
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
        "13": "......LLL.",
        "14": ".....LLLLI",
        "15": "...LLLLLLI",
        "16": "..LLLLLLLI",
        "17": ".LLLLLLLLI"
      },
      "placementHighlights": [
        {
          "type": "L",
          "x": 7,
          "y": 13,
          "rotation": 1
        },
        {
          "type": "I",
          "x": 8,
          "y": 14,
          "rotation": 1
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
      "next": "I",
      "showNext": false,
      "highlight": false,
      "motif": true,
      "blink": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-l-pullback-i"]=situation;})(globalThis);
