// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "J-Spin (suboptimal, well)",
  "stack": [
    "..SSSSSSSS",
    "..SSSSSSSS",
    ",,$sSSSSSS",
    ",,,$SSSSSS",
    ",,$sSSSSSS"
  ],
  "piece": "J",
  "frames": [
    {
      "step": "1",
      "caption": "1: The J piece in its starting orientation.",
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
      "caption": "1a: The supporting stack around the slot. Brighter cells mark the provisional required corners.",
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
      "caption": "1b: The empty pocket is the counter-motif: room for the upright J and the turn beneath the overhang.",
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
      "step": "2",
      "caption": "2: Turn the J upright, move into the channel, then descend to the pocket.",
      "ticks": 144,
      "active": {
        "x": 0,
        "y": 15,
        "rotation": 1
      },
      "buttons": [
        "A"
      ],
      "animate": true,
      "fallFirst": 4,
      "reveal": "rotation"
    },
    {
      "step": "3",
      "caption": "3: Align the pivot with the adjacent empty square on its right.",
      "ticks": 120,
      "active": {
        "x": 0,
        "y": 15,
        "rotation": 1
      },
      "trigger": {
        "hole": [
          2,
          16
        ],
        "button": "A"
      },
      "blink": true,
      "reveal": "trigger"
    },
    {
      "step": "4",
      "caption": "4: Press A to rotate J clockwise into the pocket.",
      "ticks": 120,
      "active": {
        "x": 0,
        "y": 15,
        "rotation": 1
      },
      "buttons": [
        "A"
      ],
      "reveal": "input",
      "blink": true
    },
    {
      "step": "5",
      "caption": "5: The J fits into the shorter pocket and completes the row.",
      "ticks": 90,
      "active": {
        "x": 0,
        "y": 15,
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
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["j-spin-suboptimal-well"]=situation;})(globalThis);
