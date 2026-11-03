// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "Bar Vits",
  "chapter": "Adjustments",
  "description": "Lay the first I flat above the pocket, then lower the second I at the wall and tuck it right underneath.",
  "stack": [
    "..sssSS...",
    "..SSSSSSSS",
    "..SSSSSSSS",
    "..SSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "I",
      "x": 0,
      "y": 14,
      "rotation": 1
    },
    "adjusted": {
      "type": "I",
      "x": 1,
      "y": 11,
      "rotation": 0
    },
    "next": {
      "type": "I",
      "x": 0,
      "y": 14,
      "rotation": 1
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "motif": true,
      "blink": true
    },
    {
      "step": "2",
      "lessonStage": 2,
      "caption": "Default: the usual landing without this adjustment.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "ghost": {
        "type": "I",
        "x": 0,
        "y": 14,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: I is next.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "ghost": {
        "type": "I",
        "x": 0,
        "y": 14,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Lay the first I flat above the pocket, then lower the second I at the wall and tuck it right underneath.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "ghost": {
        "type": "I",
        "x": 1,
        "y": 11,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "4a",
      "lessonStage": 4,
      "caption": "The next I fits beside the adjusted I.",
      "ticks": 96,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "I",
        "x": 1,
        "y": 11,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "I",
        "x": 0,
        "y": 14,
        "rotation": 1,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "ticks": 2,
      "next": "I",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "rows": {},
      "caption": "Bring in I."
    },
    {
      "step": "5a",
      "lessonStage": 5,
      "active": {
        "type": "I",
        "x": 1,
        "y": -1,
        "rotation": 0
      },
      "animationFrom": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "I",
      "showNext": true,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move I into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "I",
        "x": 1,
        "y": 11,
        "rotation": 0
      },
      "animationFrom": {
        "type": "I",
        "x": 1,
        "y": -1,
        "rotation": 0
      },
      "animate": true,
      "ticks": 66,
      "highlight": false,
      "next": "I",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower I."
    },
    {
      "step": "6",
      "lessonStage": 6,
      "ticks": 2,
      "next": "I",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "rows": {
        "13": ".IIII....."
      },
      "caption": "Bring in I.",
      "tileOverrides": [
        {
          "x": 1,
          "y": 13,
          "tile": 138
        },
        {
          "x": 2,
          "y": 13,
          "tile": 139
        },
        {
          "x": 3,
          "y": 13,
          "tile": 139
        },
        {
          "x": 4,
          "y": 13,
          "tile": 143
        }
      ]
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 0
      },
      "animationFrom": {
        "type": "I",
        "x": 3,
        "y": -1,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "I",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move I into place.",
      "tileOverrides": [
        {
          "x": 1,
          "y": 13,
          "tile": 138
        },
        {
          "x": 2,
          "y": 13,
          "tile": 139
        },
        {
          "x": 3,
          "y": 13,
          "tile": 139
        },
        {
          "x": 4,
          "y": 13,
          "tile": 143
        }
      ]
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "I",
      "showNext": false,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate I.",
      "tileOverrides": [
        {
          "x": 1,
          "y": 13,
          "tile": 138
        },
        {
          "x": 2,
          "y": 13,
          "tile": 139
        },
        {
          "x": 3,
          "y": 13,
          "tile": 139
        },
        {
          "x": 4,
          "y": 13,
          "tile": 143
        }
      ]
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": -1,
        "y": -1,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": 0,
        "y": -1,
        "rotation": 3
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "I",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move I into place.",
      "tileOverrides": [
        {
          "x": 1,
          "y": 13,
          "tile": 138
        },
        {
          "x": 2,
          "y": 13,
          "tile": 139
        },
        {
          "x": 3,
          "y": 13,
          "tile": 139
        },
        {
          "x": 4,
          "y": 13,
          "tile": 143
        }
      ]
    },
    {
      "step": "6d",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": -1,
        "y": 14,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": -1,
        "y": -1,
        "rotation": 3
      },
      "animate": true,
      "ticks": 84,
      "highlight": false,
      "next": "I",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower I.",
      "tileOverrides": [
        {
          "x": 1,
          "y": 13,
          "tile": 138
        },
        {
          "x": 2,
          "y": 13,
          "tile": 139
        },
        {
          "x": 3,
          "y": 13,
          "tile": 139
        },
        {
          "x": 4,
          "y": 13,
          "tile": 143
        }
      ]
    },
    {
      "step": "6e",
      "lessonStage": 6,
      "active": {
        "type": "I",
        "x": 0,
        "y": 14,
        "rotation": 3
      },
      "animationFrom": {
        "type": "I",
        "x": -1,
        "y": 14,
        "rotation": 3
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "I",
      "showNext": false,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move I into place.",
      "tileOverrides": [
        {
          "x": 1,
          "y": 13,
          "tile": 138
        },
        {
          "x": 2,
          "y": 13,
          "tile": 139
        },
        {
          "x": 3,
          "y": 13,
          "tile": 139
        },
        {
          "x": 4,
          "y": 13,
          "tile": 143
        }
      ]
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "13": ".IIII.....",
        "14": ".ILLLLL...",
        "15": ".ILLLLLLLL",
        "16": ".ILLLLLLLL",
        "17": ".ILLLLLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "I",
          "x": 1,
          "y": 11,
          "rotation": 0
        },
        {
          "type": "I",
          "x": 0,
          "y": 14,
          "rotation": 1
        }
      ],
      "caption": "Notice the resulting stack.",
      "tileOverrides": [
        {
          "x": 1,
          "y": 13,
          "tile": 138
        },
        {
          "x": 2,
          "y": 13,
          "tile": 139
        },
        {
          "x": 3,
          "y": 13,
          "tile": 139
        },
        {
          "x": 4,
          "y": 13,
          "tile": 143
        },
        {
          "x": 1,
          "y": 14,
          "tile": 128
        },
        {
          "x": 1,
          "y": 15,
          "tile": 136
        },
        {
          "x": 1,
          "y": 16,
          "tile": 136
        },
        {
          "x": 1,
          "y": 17,
          "tile": 137
        }
      ],
      "placementBlink": true
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "ticks": 96,
      "motif": {
        "cells": [
          [
            2,
            14
          ],
          [
            3,
            14
          ],
          [
            4,
            14
          ]
        ],
        "color": "#e7a52b"
      },
      "blink": true,
      "caption": "Notice the motif around the completed pair."
    }
  ],
  "section": "Memes/Anti-Adjustments",
  "motionVerified": true
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-bar-vits"]=situation;})(globalThis);
