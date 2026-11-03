// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "T-Spuck (suboptimal, left tuck)",
  "piece": "T",
  "stack": [
    "SSSSSSSS..",
    "SSSSSSSS..",
    "SSSSSSSs,.",
    "SSSSSss,,,",
    "SSSSSs,,,,"
  ],
  "frames": [
    {
      "step": "1",
      "caption": "1: The T piece in its starting orientation.",
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
      "caption": "1a: The staircase minos shown in white in the reference are the motif.",
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
      "caption": "1b: The counter-motif leaves space for the rotation and the sideways tuck.",
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
      "caption": "2: Descend against the wall, with the spike pointing toward the motif.",
      "ticks": 144,
      "active": {
        "x": 8,
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
      "step": "2a",
      "caption": "2a: Press left once to move away from the wall into the rotation pocket.",
      "ticks": 48,
      "active": {
        "x": 7,
        "y": 15,
        "rotation": 1
      },
      "buttons": [
        "Left"
      ],
      "animate": true
    },
    {
      "step": "3",
      "caption": "3: Align the pivot with the empty square toward the staircase.",
      "ticks": 96,
      "active": {
        "x": 7,
        "y": 15,
        "rotation": 1
      },
      "trigger": {
        "hole": [
          7,
          16
        ],
        "button": "A"
      },
      "blink": true,
      "reveal": "trigger"
    },
    {
      "step": "4",
      "caption": "4: Press A to turn the T with its spike pointing up.",
      "ticks": 45,
      "active": {
        "x": 7,
        "y": 15,
        "rotation": 1
      },
      "buttons": [
        "A"
      ],
      "reveal": "input"
    },
    {
      "step": "5",
      "caption": "5: The T has turned. It still needs a sideways input to tuck underneath.",
      "ticks": 70,
      "active": {
        "x": 7,
        "y": 15,
        "rotation": 2
      },
      "reveal": "spin"
    },
    {
      "step": "6",
      "caption": "6: Press left as the T falls one row, then tuck under the motif.",
      "ticks": 48,
      "active": {
        "x": 7,
        "y": 15,
        "rotation": 2
      },
      "buttons": []
    },
    {
      "step": "7",
      "caption": "7: Gravity lowers the T one row, then it moves left underneath the staircase motif. No line clears here.",
      "ticks": 84,
      "active": {
        "x": 6,
        "y": 16,
        "rotation": 2
      },
      "buttons": [
        "Left"
      ],
      "animate": true,
      "fallFirst": 1
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["t-spuck-suboptimal-left"]=situation;})(globalThis);
