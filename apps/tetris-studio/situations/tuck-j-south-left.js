// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "J: South: Left tuck",
  "chapter": "Tucks",
  "description": "A left tuck into a shaped recess. The piece-shaped pocket is empty; its entry side stays open.",
  "stack": [
    "SSS.......",
    "SSS.......",
    "SSS.......",
    "SSS.......",
    "SSs.......",
    "Ss,.......",
    "Ss,,,.....",
    "SSsssSSSS."
  ],
  "tuck": {
    "direction": "Left",
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
      "x": 2,
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
      "caption": "Hold Left while falling. The piece-shaped recess opens beneath the overhang.",
      "ticks": 72,
      "active": {
        "type": "J",
        "x": 3,
        "y": 12,
        "rotation": 2
      },
      "buttons": [
        "Left"
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
      "caption": "Keep holding Left as gravity lowers J until its leading edge clears the overhang.",
      "ticks": 96,
      "active": {
        "type": "J",
        "x": 3,
        "y": 15,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 3,
      "buttons": [
        "Left"
      ],
      "hold": true
    },
    {
      "step": "7",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "The opening is now clear: the held Left input tucks J underneath, without rotating.",
      "ticks": 36,
      "active": {
        "type": "J",
        "x": 2,
        "y": 15,
        "rotation": 2
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
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
        "type": "J",
        "x": 2,
        "y": 15,
        "rotation": 2
      },
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tuck-j-south-left"]=situation;})(globalThis);
