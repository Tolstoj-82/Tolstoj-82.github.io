const { greyValues, greyToValue } = setGreyValues(greyValuesArray);

function setGreyValues(values) {
    const sortedValues = Array.from(new Set(values)).sort((a, b) => a - b);
    const greyToValue = {};
    sortedValues.forEach((value, index) => {
        greyToValue[value] = sortedValues.length - 1 - index;
    });
    return {
        greyValues: sortedValues,
        greyToValue: greyToValue
    };
}

function mapToNearestGrey(value) {
    return greyValues.reduce((prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
}

// The pixels of each 8x8 
// tile are looked up

const minoLookUpPixels      = [1,  8, 15, 57, 11, 19, 27, 35];
const numberLookUpPixels    = [9, 10, 13, 17, 18, 20, 21, 22, 30, 49];

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
    "32131111": "5", // middle
    "32331112": "6", // right
};

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
    // not a number. this is important to determine whether it is a
    // 6 or 7 digit display
    "0000000000" : "Empty"
}


function determineTileType(pixelValues, tileClass) {
    const pixelValuesStr = String(pixelValues);

    // Determine and return the tile type based on tileClass
    if (tileClass === "score") {
        return numbersMap[pixelValuesStr] || '0';
    } else {
        return minoMap[pixelValuesStr] || '0';
    }
}
