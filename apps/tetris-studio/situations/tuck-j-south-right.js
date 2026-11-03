// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "J: South: Right tuck",
  "chapter": "Tucks",
  "description": "A double right tuck beneath the overhang. Tap Right twice after the piece clears the wall.",
  "stack": [
    "......SSSS",
    "......SSSS",
    "......SSSS",
    "......SSSS",
    "......SSSS",
    ".....,ssSS",
    ".....,,,sS",
    ".SSSSsssSS"
  ],
  "tuck": {
    "direction": "Right",
    "orientation": 2,
    "setup": {
      "type": "J",
      "x": 3,
      "y": 12,
      "rotation": 2
    },
    "approach": {
      "type": "J",
      "x": 3,
      "y": 15,
      "rotation": 2
    },
    "target": {
      "type": "J",
      "x": 5,
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
      "caption": "The highlighted empty pocket follows J in South orientation. Notice the surrounding stack and overhang.",
      "ticks": 96,
      "active": {
        "type": "J",
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
      "caption": "Press A to set the J orientation before approaching the overhang.",
      "ticks": 36,
      "active": {
        "type": "J",
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
      "caption": "Press A to set the J orientation before approaching the overhang.",
      "ticks": 36,
      "active": {
        "type": "J",
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
      "caption": "Move beside the wall and let gravity bring J toward the opening.",
      "ticks": 144,
      "active": {
        "type": "J",
        "x": 3,
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
      "caption": "Let gravity lower the piece beside the wall. Tap Right twice when it clears the overhang.",
      "ticks": 72,
      "active": {
        "type": "J",
        "x": 3,
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
      "caption": "Let gravity lower the piece beside the wall. Tap Right twice when it clears the overhang.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
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
      "caption": "First tap: press Right once to enter the opening.",
      "ticks": 36,
      "active": {
        "type": "J",
        "x": 4,
        "y": 15,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ]
    },
    {
      "step": "7a",
      "ticks": 24,
      "caption": "Release Right before the second tap.",
      "active": {
        "type": "J",
        "x": 4,
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
      "caption": "Second tap: press Right again to finish the double tuck.",
      "ticks": 36,
      "active": {
        "type": "J",
        "x": 5,
        "y": 15,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
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
        "type": "J",
        "x": 5,
        "y": 15,
        "rotation": 2
      },
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tuck-j-south-right"]=situation;})(globalThis);
