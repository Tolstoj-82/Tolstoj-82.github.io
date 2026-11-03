// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "L: South: Right tuck",
  "chapter": "Tucks",
  "description": "A right tuck into a shaped recess. The piece-shaped pocket is empty; its entry side stays open.",
  "stack": [
    ".......SSS",
    ".......SSS",
    ".......SSS",
    ".......SSS",
    ".......sSS",
    ".......,sS",
    ".....,,,sS",
    ".SSSSsssSS"
  ],
  "tuck": {
    "direction": "Right",
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
      "x": 5,
      "y": 15,
      "rotation": 2
    }
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
      "caption": "Hold Right while falling. The piece-shaped recess opens beneath the overhang.",
      "ticks": 72,
      "active": {
        "type": "L",
        "x": 4,
        "y": 12,
        "rotation": 2
      },
      "buttons": [
        "Right"
      ],
      "hold": true,
      "motif": true,
      "counterMotif": true
    },
    {
      "step": "6",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Keep holding Right as gravity lowers L until its leading edge clears the overhang.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 4,
        "y": 15,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 3,
      "buttons": [
        "Right"
      ],
      "hold": true
    },
    {
      "step": "7",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "The opening is now clear: the held Right input tucks L underneath, without rotating.",
      "ticks": 36,
      "active": {
        "type": "L",
        "x": 5,
        "y": 15,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Right"
      ],
      "hold": true
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
        "x": 5,
        "y": 15,
        "rotation": 2
      },
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tuck-l-south-right"]=situation;})(globalThis);
