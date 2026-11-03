// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "T-Spin (CCW)",
  "description": "An overhang, a narrow entry, and a quarter turn. Follow the T into place.",
  "stack": [
    "SSSSs,,$sS",
    "SSSSs,,,sS",
    "SSSSs$,$sS"
  ],
  "piece": "T",
  "frames": [
    {
      "caption": "1: A piece in its starting position.",
      "ticks": 96,
      "active": {
        "x": 3,
        "y": 0
      },
      "highlight": "blink",
      "blink": true,
      "reveal": "piece",
      "step": "1"
    },
    {
      "caption": "1a: A matching motif.",
      "ticks": 144,
      "active": {
        "x": 3,
        "y": 0
      },
      "highlight": false,
      "blink": true,
      "mandatoryAfter": 48,
      "reveal": "match",
      "step": "1a",
      "motif": true
    },
    {
      "caption": "1b: A matching counter-motif.",
      "ticks": 96,
      "active": {
        "x": 3,
        "y": 0
      },
      "highlight": false,
      "blink": true,
      "reveal": "counter",
      "step": "1b",
      "counterMotif": true
    },
    {
      "caption": "2: The orientation before the spin. Fall, turn, move right and descend.",
      "ticks": 144,
      "active": {
        "x": 5,
        "y": 15,
        "rotation": 1
      },
      "buttons": [
        "A"
      ],
      "animate": true,
      "fallFirst": 4,
      "reveal": "rotation",
      "step": "2"
    },
    {
      "caption": "3: The trigger: align the pivot with the single-cell hole on the right.",
      "ticks": 120,
      "active": {
        "x": 5,
        "y": 15,
        "rotation": 1
      },
      "blink": true,
      "reveal": "trigger",
      "step": "3",
      "trigger": {
        "hole": [
          7,
          16
        ],
        "button": "B"
      }
    },
    {
      "caption": "4: The button input: press B.",
      "ticks": 45,
      "active": {
        "x": 5,
        "y": 15,
        "rotation": 1
      },
      "buttons": [
        "B"
      ],
      "reveal": "input",
      "step": "4"
    },
    {
      "caption": "5: The orientation after the spin.",
      "ticks": 70,
      "active": {
        "x": 5,
        "y": 15
      },
      "reveal": "spin",
      "step": "5"
    },
    {
      "caption": "6: Line clear.",
      "clear": true,
      "step": "6"
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["t-spin-ccw"]=situation;})(globalThis);
