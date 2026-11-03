// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "I-Spin (well)",
  "stack": [
    "..SSSSSSSS",
    ".,SSSSSSSS",
    ".,$sSSSSSS",
    ",,,,$SSSSS",
    ".,$sSSSSSS"
  ],
  "piece": "I",
  "frames": [
    {
      "step": "1",
      "caption": "1: The I piece in its starting orientation.",
      "ticks": 96,
      "active": {
        "x": 3,
        "y": -1
      },
      "highlight": "blink",
      "blink": true,
      "reveal": "piece"
    },
    {
      "step": "1a",
      "caption": "1a: The supporting stack around the slot. Brighter cells mark the provisional required corners.",
      "ticks": 144,
      "active": {
        "x": 3,
        "y": -1
      },
      "motif": true,
      "highlight": false,
      "blink": true,
      "reveal": "match",
      "mandatoryAfter": 48
    },
    {
      "step": "1b",
      "caption": "1b: The empty cross-shaped space is the counter-motif: room for the upright I and its horizontal turn.",
      "ticks": 96,
      "active": {
        "x": 3,
        "y": -1
      },
      "counterMotif": true,
      "highlight": false,
      "blink": true,
      "reveal": "counter"
    },
    {
      "step": "2",
      "caption": "2: Turn the I upright, move into the left channel, then descend to the slot.",
      "ticks": 144,
      "active": {
        "x": 0,
        "y": 14,
        "rotation": 1
      },
      "buttons": [
        "B"
      ],
      "animate": true,
      "fallFirst": 4,
      "reveal": "rotation"
    },
    {
      "step": "3",
      "caption": "3: Align four squares across the slot: one left of the pivot, the pivot itself, and two to its right.",
      "ticks": 120,
      "active": {
        "x": 0,
        "y": 14,
        "rotation": 1
      },
      "trigger": {
        "hole": [
          2,
          16
        ],
        "button": "B"
      },
      "blink": true,
      "reveal": "trigger"
    },
    {
      "step": "4",
      "caption": "4: Press B or A. Either button toggles the I between its two orientation states.",
      "ticks": 120,
      "active": {
        "x": 0,
        "y": 14,
        "rotation": 1
      },
      "buttons": [
        "B"
      ],
      "reveal": "input",
      "buttonOptions": [
        "B",
        "A"
      ],
      "blink": true
    },
    {
      "step": "5",
      "caption": "5: The I turns horizontally into the slot and completes the row.",
      "ticks": 90,
      "active": {
        "x": 0,
        "y": 14,
        "rotation": 2
      },
      "reveal": "spin"
    },
    {
      "step": "6",
      "caption": "6: The completed row clears.",
      "clear": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["i-spin-well"]=situation;})(globalThis);
