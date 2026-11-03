// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "T: North: Left tuck",
  "chapter": "Tucks",
  "description": "A left tuck into a shaped recess. The piece-shaped pocket is empty; its entry side stays open.",
  "stack": [
    "SSS.......",
    "SSS.......",
    "SSS.......",
    "SSS.......",
    "SSs.......",
    "Ss,,,.....",
    "SSs,......",
    "SSSsSSSSS."
  ],
  "tuck": {
    "direction": "Left",
    "orientation": 0,
    "setup": {
      "type": "T",
      "x": 3,
      "y": 11,
      "rotation": 0
    },
    "approach": {
      "type": "T",
      "x": 3,
      "y": 14,
      "rotation": 0
    },
    "target": {
      "type": "T",
      "x": 2,
      "y": 14,
      "rotation": 0
    }
  },
  "frames": [
    {
      "step": "1",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "The highlighted empty pocket follows T in North orientation. Notice the surrounding stack and overhang.",
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
      "caption": "Move beside the wall and let gravity bring T toward the opening.",
      "ticks": 144,
      "active": {
        "type": "T",
        "x": 3,
        "y": 11,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": []
    },
    {
      "step": "3",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Hold Left while falling. The piece-shaped recess opens beneath the overhang.",
      "ticks": 72,
      "active": {
        "type": "T",
        "x": 3,
        "y": 11,
        "rotation": 0
      },
      "buttons": [
        "Left"
      ],
      "hold": true,
      "motif": true,
      "counterMotif": true
    },
    {
      "step": "4",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Keep holding Left as gravity lowers T until its leading edge clears the overhang.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 14,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 3,
      "buttons": [
        "Left"
      ],
      "hold": true
    },
    {
      "step": "5",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "The opening is now clear: the held Left input tucks T underneath, without rotating.",
      "ticks": 36,
      "active": {
        "type": "T",
        "x": 2,
        "y": 14,
        "rotation": 0
      },
      "animate": true,
      "fallFirst": 0,
      "buttons": [
        "Left"
      ],
      "hold": true
    },
    {
      "step": "6",
      "next": "T",
      "showNext": false,
      "highlight": false,
      "caption": "Tucked. The orientation stays North.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 2,
        "y": 14,
        "rotation": 0
      },
      "motif": true
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tuck-t-north-left"]=situation;})(globalThis);
