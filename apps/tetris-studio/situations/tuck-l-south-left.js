// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "L: South: Left tuck",
  "chapter": "Tucks",
  "description": "A double left tuck beneath the overhang. Tap Left twice after the piece clears the wall.",
  "stack": [
    "SSSS......",
    "SSSS......",
    "SSSS......",
    "SSSS......",
    "SSSS......",
    "SSss,.....",
    "Ss,,,.....",
    "SSsssSSSS."
  ],
  "tuck": {
    "direction": "Left",
    "orientation": 2,
    "setup": {
      "type": "L",
      "x": 4,
      "y": 12,
      "rotation": 2
    },
    "approach": {
      "type": "L",
      "x": 4,
      "y": 15,
      "rotation": 2
    },
    "target": {
      "type": "L",
      "x": 2,
      "y": 15,
      "rotation": 2
    },
    "distance": 2
  },
  "frames": [
    {
      "step": "1",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "The highlighted empty pocket follows L in South orientation. Notice the surrounding stack and overhang.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "motif": true,
      "counterMotif": true
    },
    {
      "step": "2",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Press A to set the L orientation before approaching the overhang.",
      "ticks": 36,
      "active": {
        "type": "L",
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
      "step": "3",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Press A to set the L orientation before approaching the overhang.",
      "ticks": 36,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "A"
      ]
    },
    {
      "step": "4",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Move beside the wall and let gravity bring L toward the opening.",
      "ticks": 144,
      "active": {
        "type": "L",
        "x": 4,
        "y": 12,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": []
    },
    {
      "step": "5",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Let gravity lower the piece beside the wall. Tap Left twice when it clears the overhang.",
      "ticks": 72,
      "active": {
        "type": "L",
        "x": 4,
        "y": 12,
        "rotation": 2
      },
      "buttons": [],
      "motif": true,
      "counterMotif": true
    },
    {
      "step": "6",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Let gravity lower the piece beside the wall. Tap Left twice when it clears the overhang.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 4,
        "y": 15,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 3,
      "buttons": []
    },
    {
      "step": "7",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "First tap: press Left once to enter the opening.",
      "ticks": 36,
      "active": {
        "type": "L",
        "x": 3,
        "y": 15,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
      ]
    },
    {
      "step": "7a",
      "ticks": 24,
      "caption": "Release Left before the second tap.",
      "active": {
        "type": "L",
        "x": 3,
        "y": 15,
        "rotation": 2
      },
      "buttons": [],
      "highlight": false,
      "next": "T",
      "showNext": false
    },
    {
      "step": "7b",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Second tap: press Left again to finish the double tuck.",
      "ticks": 36,
      "active": {
        "type": "L",
        "x": 2,
        "y": 15,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
      ]
    },
    {
      "step": "8",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Tucked. The orientation stays South.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 2,
        "y": 15,
        "rotation": 2
      },
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tuck-l-south-left"]=situation;})(globalThis);
