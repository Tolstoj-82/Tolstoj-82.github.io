(function(root){const situation={
  "title": "Z123: Z-flat (delayed burn)",
  "chapter": "Save stacking",
  "section": "Double-Well",
  "description": "Z-flat is a delayed burn. Drop the horizontal Z across columns 1–3 above the column-1 Tetris well. No spin or immediate clear is needed; a later placement completes the burn.",
  "stack": [
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    "..........",
    ".........S",
    ".........S",
    ".......SSS",
    ".....SSSSS",
    "...SSSSSSS",
    "...SSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "doubleWell": {
    "key": "tactical-burn-3-z",
    "width": 3,
    "role": "delayed",
    "target": {
      "type": "Z",
      "x": 0,
      "y": 11,
      "rotation": 0
    },
    "clears": 0,
    "note": "Z-flat is a delayed burn. Drop the horizontal Z across columns 1–3 above the column-1 Tetris well. No spin or immediate clear is needed; a later placement completes the burn.",
    "tetrisColumn": 1
  },
  "frames": [
    {
      "ticks": 96,
      "highlight": false,
      "caption": "Z-flat: a delayed burn above the Tetris well in column 1.",
      "step": "1",
      "showNext": false
    },
    {
      "ticks": 48,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "caption": "Keep Z flat in its spawning orientation.",
      "step": "2",
      "showNext": false
    },
    {
      "ticks": 60,
      "active": {
        "type": "Z",
        "x": 0,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "buttons": [
        "Left"
      ],
      "caption": "Move over columns 1–3 before descending.",
      "step": "3",
      "showNext": false
    },
    {
      "ticks": 144,
      "active": {
        "type": "Z",
        "x": 0,
        "y": 11,
        "rotation": 0
      },
      "animate": true,
      "caption": "Let Z fall straight into place. No spin is required.",
      "step": "4",
      "showNext": false
    },
    {
      "ticks": 144,
      "rows": {
        "0": "..........",
        "1": "..........",
        "2": "..........",
        "3": "..........",
        "4": "..........",
        "5": "..........",
        "6": "..........",
        "7": "..........",
        "8": ".........L",
        "9": ".........L",
        "10": ".......LLL",
        "11": ".....LLLLL",
        "12": "ZZ.LLLLLLL",
        "13": ".ZZLLLLLLL",
        "14": ".LLLLLLLLL",
        "15": ".LLLLLLLLL",
        "16": ".LLLLLLLLL",
        "17": ".LLLLLLLLL"
      },
      "highlight": false,
      "caption": "The Z-flat is placed. This is a delayed burn: no row clears yet.",
      "step": "5",
      "showNext": false
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["tactical-burn-3-z"]=situation;})(globalThis);
