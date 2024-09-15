// DOM Elements
const device_selector   = document.getElementById('device_selector');
const camera_feed       = document.getElementById('camera_feed');
const color_container   = document.getElementById('color-container');
const themeSelect       = document.getElementById('themeSelect');

// Variables
let currentStream       = null;
let tileArray           = []; // tileArray[tileNr][pixelNr] (2D array)
let calibrated          = false;
let playfieldVisible    = false;
let scheme              = 'GB';
let playfieldType       = ""; // A-Type, B-Type, 2-Player

const tileWidth         = 8;
const tileHeight        = 8;
const canvasWidth       = 160;
const canvasHeight      = 144;
const tilesX            = canvasWidth / tileWidth; // 20 x 18 tiles
const tilesY            = canvasHeight / tileHeight;

const greyGBShades     = [0, 0, 0, 0];

//---------------------------------------------------------------------------

const minoLookUpPixels      = [1,  8, 15, 57, 11, 19, 27, 35];
const numberLookUpPixels    = [9, 10, 13, 17, 18, 20, 21, 22, 30, 49];
const wallLookupPixels      = [9, 10, 16, 17, 18, 19];
const heightLookUpPixels    = [11, 12];

// 00 01 02 03 04 05 06 07
// 08 09 10 11 12 13 14 15
// 16 17 18 19 20 21 22 23
// 24 25 26 27 28 29 30 31
// 32 33 34 35 36 37 38 39
// 40 41 42 43 44 45 46 47
// 48 49 50 51 52 53 54 55

// the lookup pixels in each tile are evaluated and
// assigned a mino type if the values were correct 
const minoMap = {
    // regular minos
    "33332222": "L",
    "33331300": "J",
    "33330333": "O",
    "33331133": "Z",
    "33332300": "S",
    "33331011": "T",

    // vertical I
    "33311111": "1", // top
    "13311111": "2", // middle
    "13332121": "3", // bottom

    // horizontal I
    "33131111": "4", // left
    "32131111": "5", // center
    "32331112": "6", // right

    // line clear G = grey
    "11111111": "G",

    // curtain
    "33330111": "C",
};

const wallMap = {
    "313333" : "1P",
    "103101" : "2P"
}

const numbersMap = {
    "0333303330" : "0",
    "0000330000" : "1",
    "0333033333" : "2",
    "3330033303" : "3",
    "0333333000" : "4",
    "3333300000" : "5",
    "0333300000" : "6",
    "3330003300" : "7",
    "0333033300" : "8",
    "0333033330" : "9",
    "0000000000" : "", // ignore white
    "3333333333" : "B-Type" // if black 
}

const heightMap = {
    "00" : 0,
    "22" : 1 // filled height
}