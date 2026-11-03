// File-authored situation. Shared ROM spawn and rotation rules apply.
(function(root){const situation={
  "title": "ZT Tristop thing: secondary (Ori: ST Tristop thing)",
  "chapter": "Adjustments",
  "description": "Place Z to prepare the final T spin and tuck.",
  "stack": [
    ".....sSSSS",
    "....sSSSSS",
    ".sssSSSSSS",
    ".SSSSSSSSS",
    ".SSSSSSSSS"
  ],
  "adjustment": {
    "default": {
      "type": "Z",
      "x": 3,
      "y": 12,
      "rotation": 1
    },
    "adjusted": {
      "type": "Z",
      "x": 2,
      "y": 11,
      "rotation": 0
    },
    "next": {
      "type": "T",
      "x": 1,
      "y": 13,
      "rotation": 2
    }
  },
  "frames": [
    {
      "step": "1",
      "lessonStage": 1,
      "caption": "Notice the motif around the two placements.",
      "ticks": 96,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
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
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 3,
        "y": 12,
        "rotation": 1,
        "label": "Default"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "3",
      "lessonStage": 3,
      "caption": "Look ahead: T is next.",
      "ticks": 96,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 3,
        "y": 12,
        "rotation": 1,
        "label": "Default"
      },
      "nextBlink": true,
      "blink": true
    },
    {
      "step": "4",
      "lessonStage": 4,
      "caption": "Place Z to prepare the final T spin and tuck.",
      "ticks": 96,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "ghost": {
        "type": "Z",
        "x": 2,
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
      "caption": "The ghost shows the final T placement after the Spuck.",
      "ticks": 96,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "referenceGhost": {
        "type": "Z",
        "x": 2,
        "y": 11,
        "rotation": 0,
        "label": "Adjusted"
      },
      "ghost": {
        "type": "T",
        "x": 1,
        "y": 13,
        "rotation": 2,
        "label": "Next"
      },
      "ghostBlink": true,
      "blink": true
    },
    {
      "step": "5",
      "lessonStage": 5,
      "ticks": 2,
      "next": "T",
      "showNext": true,
      "highlight": false,
      "active": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {},
      "caption": "Bring in Z."
    },
    {
      "step": "5a",
      "lessonStage": 5,
      "active": {
        "type": "Z",
        "x": 2,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "Z",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": true,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move Z into place."
    },
    {
      "step": "5b",
      "lessonStage": 5,
      "active": {
        "type": "Z",
        "x": 2,
        "y": 11,
        "rotation": 0
      },
      "animationFrom": {
        "type": "Z",
        "x": 2,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 66,
      "highlight": false,
      "next": "T",
      "showNext": true,
      "buttons": [],
      "caption": "Let gravity lower Z."
    },
    {
      "step": "6",
      "lessonStage": 6,
      "ticks": 2,
      "next": "T",
      "showNext": false,
      "highlight": false,
      "active": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "rows": {
        "12": "..ZZ......",
        "13": "...ZZLLLLL"
      },
      "caption": "Bring in T."
    },
    {
      "step": "6a",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 0,
        "y": 0,
        "rotation": 0
      },
      "animationFrom": {
        "type": "T",
        "x": 3,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [
        "Left"
      ],
      "caption": "Press left to move T into place."
    },
    {
      "step": "6b",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 0,
        "y": 0,
        "rotation": 1
      },
      "animationFrom": {
        "type": "T",
        "x": 0,
        "y": 0,
        "rotation": 0
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate T."
    },
    {
      "step": "6c",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 0,
        "y": 12,
        "rotation": 1
      },
      "animationFrom": {
        "type": "T",
        "x": 0,
        "y": 0,
        "rotation": 1
      },
      "animate": true,
      "ticks": 72,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower T."
    },
    {
      "step": "6d",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 0,
        "y": 12,
        "rotation": 2
      },
      "animationFrom": {
        "type": "T",
        "x": 0,
        "y": 12,
        "rotation": 1
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [
        "A"
      ],
      "caption": "Press A to rotate T."
    },
    {
      "step": "6e",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 0,
        "y": 13,
        "rotation": 2
      },
      "animationFrom": {
        "type": "T",
        "x": 0,
        "y": 12,
        "rotation": 2
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [],
      "caption": "Let gravity lower T."
    },
    {
      "step": "6f",
      "lessonStage": 6,
      "active": {
        "type": "T",
        "x": 1,
        "y": 13,
        "rotation": 2
      },
      "animationFrom": {
        "type": "T",
        "x": 0,
        "y": 13,
        "rotation": 2
      },
      "animate": true,
      "ticks": 24,
      "highlight": false,
      "next": "T",
      "showNext": false,
      "buttons": [
        "Right"
      ],
      "caption": "Press right to move T into place."
    },
    {
      "step": "7",
      "lessonStage": 7,
      "ticks": 96,
      "rows": {
        "12": "..ZZ......",
        "13": "..TZZLLLLL",
        "14": ".TTTLLLLLL"
      },
      "highlight": false,
      "placementHighlights": [
        {
          "type": "Z",
          "x": 2,
          "y": 11,
          "rotation": 0
        },
        {
          "type": "T",
          "x": 1,
          "y": 13,
          "rotation": 2
        }
      ],
      "caption": "Notice the resulting stack.",
      "placementBlink": true
    },
    {
      "step": "7a",
      "lessonStage": 7,
      "ticks": 96,
      "motif": {
        "cells": [
          [
            5,
            13
          ],
          [
            4,
            14
          ],
          [
            1,
            15
          ],
          [
            2,
            15
          ],
          [
            3,
            15
          ]
        ],
        "color": "#e7a52b"
      },
      "blink": true,
      "caption": "Notice the motif around the completed pair."
    }
  ],
  "section": "Good but Situational",
  "motionVerified": true
};if(typeof module!=="undefined")module.exports=situation;else(root.TetrisSituationFiles??={})["adjustment-zt-tristop"]=situation;})(globalThis);
