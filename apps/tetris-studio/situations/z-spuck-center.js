// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Z-Spuck (center)",
  "piece": "Z",
  "stack": [
    "SSSS..SSSS",
    "SSSS..SSSS",
    "SSSS.,sSSS",
    "SSSS,,,ssS",
    "SSSS,,,,sS"
  ],
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
      "caption": "1a: The staircase minos shown in white in the reference form the motif.",
      "ticks": 144,
      "active": {
        "x": 3,
        "y": 0
      },
      "motif": true,
      "highlight": false,
      "blink": true,
      "reveal": "match"
    },
    {
      "step": "1b",
      "caption": "1b: The empty pocket is the counter-motif: room for the rotation and one step right.",
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
      "caption": "2: Turn the Z upright and descend beside the wide motif.",
      "ticks": 144,
      "active": {
        "x": 4,
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
      "caption": "3: Align the pivot with the empty square toward the staircase.",
      "ticks": 96,
      "active": {
        "x": 4,
        "y": 15,
        "rotation": 1
      },
      "trigger": {
        "hole": [
          6,
          16
        ],
        "button": "B"
      },
      "blink": true,
      "reveal": "trigger"
    },
    {
      "step": "4",
      "caption": "4: Press B or A to turn the Z horizontally.",
      "ticks": 120,
      "active": {
        "x": 4,
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
      "caption": "5: The Z is horizontal. Move it one square right to tuck under the motif.",
      "ticks": 70,
      "active": {
        "x": 4,
        "y": 15,
        "rotation": 0
      },
      "reveal": "spin"
    },
    {
      "step": "6",
      "caption": "6: Press right once to tuck the Z into the pocket.",
      "ticks": 48,
      "active": {
        "x": 4,
        "y": 15,
        "rotation": 0
      },
      "buttons": []
    },
    {
      "step": "7",
      "caption": "7: One step right seats the Z beneath the motif. No line clears here.",
      "ticks": 48,
      "active": {
        "x": 5,
        "y": 15,
        "rotation": 0
      },
      "buttons": [
        "Right"
      ],
      "animate": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["z-spuck-center"]=situation;})(globalThis);
