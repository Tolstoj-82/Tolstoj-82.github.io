// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Z-Spin (well)",
  "stack": [
    "..SSSSSSSS",
    "..SSSSSSSS",
    "..SSSSSSSS",
    ",,$sSSSSSS",
    ",,,$SSSSSS"
  ],
  "piece": "Z",
  "frames": [
    {
      "step": "1",
      "caption": "1: The Z piece in its starting orientation.",
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
      "caption": "1a: The marked motif. Brighter cells are mandatory.",
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
      "caption": "1b: The comma-marked counter-motif beside the stack.",
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
      "caption": "2: Turn the Z upright, move to the two-column well on the left, then descend.",
      "ticks": 144,
      "active": {
        "x": 0,
        "y": 15,
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
      "caption": "3: The trigger: align the pivot with the mandatory motif corner on its right.",
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
        "button": "B",
        "target": "stack"
      },
      "blink": true,
      "reveal": "trigger"
    },
    {
      "step": "4",
      "caption": "4: Press B or A. Either button toggles the Z between its two orientation states.",
      "ticks": 120,
      "active": {
        "x": 0,
        "y": 15,
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
      "caption": "5: The horizontal Z fits beneath the overhang. Its pivot stays on the same row.",
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
      "caption": "6: One completed row clears.",
      "clear": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["z-spin-well"]=situation;})(globalThis);
