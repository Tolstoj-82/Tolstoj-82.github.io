// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "JD spin (left)",
  "piece": "T",
  "stack": [
    "sss,,.....",
    "ss,,,,....",
    "sss,SSSSSS"
  ],
  "frames": [
    {
      "step": "1",
      "caption": "1: The T starts with its spike pointing down.",
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
      "caption": "1a: The stack wraps around the vertical T-shaped pocket.",
      "ticks": 96,
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
      "caption": "1b: Leave room beside the pocket to tuck before the final rotation.",
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
      "step": "2a",
      "caption": "2a: Press A for the first quarter turn.",
      "ticks": 36,
      "active": {
        "x": 3,
        "y": 0,
        "rotation": 1
      },
      "buttons": [
        "A"
      ]
    },
    {
      "step": "2b",
      "caption": "2b: Press A again. The spike now points up.",
      "ticks": 36,
      "active": {
        "x": 3,
        "y": 0,
        "rotation": 2
      },
      "buttons": [
        "A"
      ]
    },
    {
      "step": "2",
      "caption": "2: Descend beside the pocket with the spike pointing up.",
      "ticks": 144,
      "active": {
        "x": 3,
        "y": 15,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 4,
      "buttons": [],
      "reveal": "rotation"
    },
    {
      "step": "3",
      "caption": "3: Align the pivot with the empty square toward the pocket.",
      "ticks": 96,
      "active": {
        "x": 3,
        "y": 15,
        "rotation": 2
      },
      "trigger": {
        "hole": [
          3,
          16
        ],
        "button": "B"
      },
      "blink": true,
      "reveal": "trigger"
    },
    {
      "step": "3a",
      "caption": "3a: Press left once to tuck into the pocket before rotating.",
      "ticks": 48,
      "active": {
        "x": 2,
        "y": 15,
        "rotation": 2
      },
      "buttons": [
        "Left"
      ],
      "animate": true
    },
    {
      "step": "4",
      "caption": "4: Press B to rotate the tucked T into the vertical pocket.",
      "ticks": 45,
      "active": {
        "x": 2,
        "y": 15,
        "rotation": 2
      },
      "buttons": [
        "B"
      ],
      "reveal": "input"
    },
    {
      "step": "5",
      "caption": "5: The T fits neatly into the pocket.",
      "ticks": 70,
      "active": {
        "x": 2,
        "y": 15,
        "rotation": 1
      },
      "reveal": "spin"
    },
    {
      "step": "6",
      "caption": "6: The completed bottom row clears.",
      "clear": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["jd-spin-left"]=situation;})(globalThis);
