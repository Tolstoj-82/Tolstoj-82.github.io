// The pixels of each 8x8 
// tile are looked up

// 00 01 02 03 04 05 06 07
// 08 09 10 11 12 13 14 15
// 16 17 18 19 20 21 22 23
// 24 25 26 27 28 29 30 31
// 32 33 34 35 36 37 38 39
// 40 41 42 43 44 45 46 47
// 48 49 50 51 52 53 54 55

const lookUpPixels = [1, 8, 15, 57, 11, 19, 27, 35];

// the value a pixle can have is 0,1,2 or 3

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
    "32131111": "5", // middle
    "32331112": "6", // right
};

function determineTileType(pixelValues) {
    return minoMap[String(pixelValues)] || '0';
}