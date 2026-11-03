// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "T-Spin (CW)",
  "description": "A C on the left, a J on the right, and a clockwise turn. Follow the mirrored motif.",
  "stack": [
    "Ss$,,sSSSS",
    "Ss,,,sSSSS",
    "Ss$,$sSSSS"
  ],
  "piece": "T",
  "frames": [
    {
      "step": "1",
      "caption": "1: A piece in its starting position.",
      "ticks": 96,
      "active": {
        "x": 3,
        "y": 0
      },
      "highlight": "blink",
      "blink": true,
      "reveal": "piece"
    },
    {
      "step": "1a",
      "caption": "1a: A matching motif.",
      "ticks": 144,
      "active": {
        "x": 3,
        "y": 0
      },
      "motif": true,
      "highlight": false,
      "blink": true,
      "reveal": "match",
      "mandatoryAfter": 48
    },
    {
      "step": "1b",
      "caption": "1b: A matching counter-motif.",
      "ticks": 96,
      "active": {
        "x": 3,
        "y": 0
      },
      "counterMotif": true,
      "highlight": false,
      "blink": true,
      "reveal": "counter"
    },
    {
      "caption": "2: The orientation before the spin. Fall, turn, move left and descend.",
      "ticks": 144,
      "active": {
        "x": 2,
        "y": 15,
        "rotation": 3
      },
      "buttons": [
        "B"
      ],
      "animate": true,
      "fallFirst": 4,
      "reveal": "rotation",
      "step": "2"
    },
    {
      "caption": "3: The trigger: align the pivot with the single-cell hole on the left.",
      "ticks": 120,
      "active": {
        "x": 2,
        "y": 15,
        "rotation": 3
      },
      "trigger": {
        "hole": [
          2,
          16
        ],
        "button": "A"
      },
      "blink": true,
      "reveal": "trigger",
      "step": "3"
    },
    {
      "caption": "4: The button input: press A.",
      "active": {
        "x": 2,
        "y": 15,
        "rotation": 3
      },
      "buttons": [
        "A"
      ],
      "reveal": "input",
      "step": "4",
      "ticks": 45
    },
    {
      "step": "5",
      "caption": "5: The orientation after the spin.",
      "ticks": 70,
      "active": {
        "x": 2,
        "y": 15,
        "rotation": 0
      },
      "reveal": "spin"
    },
    {
      "caption": "6: Line clear.",
      "clear": true,
      "step": "6"
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["t-spin-cw"]=situation;})(globalThis);
