// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Noro PC burn: Sodium Big Brain",
  "chapter": "Adjustments",
  "adjustment": {
    "default": {
      "type": "L",
      "x": 0,
      "y": 12,
      "rotation": 2
    },
    "adjusted": {
      "type": "L",
      "x": 0,
      "y": 12,
      "rotation": 0
    },
    "next": {
      "type": "T",
      "x": 0,
      "y": 12,
      "rotation": 0
    }
  },
  "description": "Keep L in its spawning orientation: it burns one row, then T fits the new gap and burns two more.",
  "stack": [
    "....SSSS..",
    "...SSSSSSS",
    "...sSSSSSS",
    "..sSSSSSSS",
    "....SSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "frames": [
    {
      "caption": "Notice the motif beside the three upper rows.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0
      },
      "showNext": true,
      "lessonStage": 1,
      "highlight": false,
      "blink": true,
      "step": "1",
      "motif": true
    },
    {
      "caption": "The default reversed L would leave a different dependency.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "L",
        "x": 0,
        "y": 12,
        "rotation": 2,
        "label": "Default"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 2,
      "highlight": false,
      "blink": true,
      "step": "2"
    },
    {
      "caption": "Look ahead: T is next.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "L",
        "x": 0,
        "y": 12,
        "rotation": 2,
        "label": "Default"
      },
      "nextBlink": true,
      "showNext": true,
      "lessonStage": 3,
      "highlight": false,
      "blink": true,
      "step": "3"
    },
    {
      "caption": "Keep L in its spawning orientation so the clear leaves a T-shaped gap.",
      "ticks": 96,
      "active": {
        "type": "L",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "L",
        "x": 0,
        "y": 12,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "showNext": true,
      "lessonStage": 4,
      "highlight": false,
      "blink": true,
      "step": "4"
    },
    {
      "caption": "Place L across the upper gap.",
      "ticks": 144,
      "active": {
        "type": "L",
        "x": 0,
        "y": 12
      },
      "showNext": true,
      "lessonStage": 5,
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "5"
    },
    {
      "caption": "L clears one row. The stack above it drops before T enters.",
      "clear": true,
      "showNext": true,
      "lessonStage": 5,
      "highlight": false,
      "step": "5b"
    },
    {
      "caption": "Bring in T after the single-line clear.",
      "ticks": 2,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "showNext": false,
      "lessonStage": 6,
      "highlight": false,
      "step": "6"
    },
    {
      "caption": "T fits this gap on the lowered stack.",
      "ticks": 96,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0
      },
      "ghost": {
        "type": "T",
        "x": 0,
        "y": 12,
        "rotation": 0,
        "label": "Next"
      },
      "ghostBlink": true,
      "showNext": false,
      "lessonStage": 6,
      "highlight": false,
      "blink": true,
      "step": "6a"
    },
    {
      "caption": "Place T flat in the new gap.",
      "ticks": 144,
      "active": {
        "type": "T",
        "x": 0,
        "y": 12
      },
      "showNext": false,
      "lessonStage": 6,
      "animate": true,
      "fallFirst": 0,
      "highlight": false,
      "step": "6b"
    },
    {
      "caption": "T clears two rows: three rows burned in total.",
      "clear": true,
      "showNext": false,
      "lessonStage": 6,
      "highlight": false,
      "step": "6c"
    },
    {
      "caption": "One row with L, then two with T. The upper garbage has dropped three rows.",
      "ticks": 96,
      "showNext": false,
      "lessonStage": 7,
      "highlight": false,
      "step": "7"
    }
  ]
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-noro-pc-burn"]=situation;})(globalThis);
