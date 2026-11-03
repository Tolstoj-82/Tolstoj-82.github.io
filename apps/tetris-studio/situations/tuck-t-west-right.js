// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "T: West: Right tuck",
  "chapter": "Tucks",
  "description": "A right tuck into a shaped recess. The piece-shaped pocket is empty; its entry side stays open.",
  "stack": [
    ".......SSS",
    ".......SSS",
    ".......SSS",
    ".......SSS",
    "......,sSS",
    "......,,sS",
    "......,sSS",
    ".SSSSSsSSS"
  ],
  "tuck": {
    "direction": "Right",
    "orientation": 3,
    "setup": {
      "type": "T",
      "x": 4,
      "y": 11,
      "rotation": 3
    },
    "approach": {
      "type": "T",
      "x": 4,
      "y": 14,
      "rotation": 3
    },
    "target": {
      "type": "T",
      "x": 5,
      "y": 14,
      "rotation": 3
    }
  },
  "frames": [
    {
      "step": "1",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "The highlighted empty pocket follows T in West orientation. Notice the surrounding stack and overhang.",
      "ticks": 96,
      "active": {
        "type": "T",
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
      "caption": "Press B to set the T orientation before approaching the overhang.",
      "ticks": 36,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "B"
      ]
    },
    {
      "step": "3",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Move beside the wall and let gravity bring T toward the opening.",
      "ticks": 144,
      "active": {
        "type": "T",
        "x": 4,
        "y": 11,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": []
    },
    {
      "step": "4",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Hold Right while falling. The piece-shaped recess opens beneath the overhang.",
      "ticks": 72,
      "active": {
        "type": "T",
        "x": 4,
        "y": 11,
        "rotation": 3
      },
      "buttons": [
        "Right"
      ],
      "hold": true,
      "motif": true,
      "counterMotif": true
    },
    {
      "step": "5",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Keep holding Right as gravity lowers T until its leading edge clears the overhang.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 4,
        "y": 14,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 3,
      "buttons": [
        "Right"
      ],
      "hold": true
    },
    {
      "step": "6",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "The opening is now clear: the held Right input tucks T underneath, without rotating.",
      "ticks": 36,
      "active": {
        "type": "T",
        "x": 5,
        "y": 14,
        "rotation": 3
      },
      "animate": true,
      "fallFirst": 0,
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
      "caption": "Tucked. The orientation stays West.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 5,
        "y": 14,
        "rotation": 3
      },
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tuck-t-west-right"]=situation;})(globalThis);
