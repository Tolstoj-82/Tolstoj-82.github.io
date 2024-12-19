let div = new Array(4);
let c = "";
let e = "";
let nextnext = new Array(4);
let reject = new Array(3);
let pieces = new Array(3); // [current, next, next-next]
pieces.fill("");
let lastRowNum = 0;
let pieceCount = new Array(7);
pieceCount.fill(0);

const tbody = document.querySelector("tbody");

function getDiv() {
    return Math.floor(Math.random() * 256);
}

function divToPieceNumber(div) {
    return (div % 7) + 1;
}

function pieceNumberToPiece(number) {
    const pieces = ["L", "J", "I", "O", "Z", "S", "T"];
    return pieces[number - 1] || "?";
}

function pieceToPieceNumber(letter) {
    const pieceMap = {
        "L": 0,
        "J": 4,
        "I": 8,
        "O": 12,
        "Z": 16,
        "S": 20,
        "T": 22
    };

    return pieceMap[letter] || "";
}

function emptyArrays() {
    div.fill("");
    c = "";
    e = "";
    nextnext.fill("");
    reject.fill("");
}

function fillRows(nRows){
    for (let i = 0; i < nRows; i++) {
        addRow(i + lastRowNum);
    }
    lastRowNum += nRows;
    document.getElementById("totalRows").textContent = "(Total Pieces = " + lastRowNum + ")";
}

function bitcheck(c, e, d){
    return(parseInt(c, 16) === ((parseInt(c, 16) | parseInt(e, 16)) | parseInt(d, 16)));
}

function addRow(rowNum) {
    emptyArrays();
    const newRow = document.createElement("tr");

    // Generate divHex and corresponding values
    div[0] = getDiv();
    pieceNumber = divToPieceNumber(div[0]);
    piece = pieceNumberToPiece(pieceNumber);

    // Update pieces and calculate related values
    pieces.unshift(piece);
    pieces.length = 3; // Keep only the latest three pieces
    let [c, e, d] = pieces.map(pieceToPieceNumber).map(num => num.toString(16).padStart(2, "0"));
    nextnext[0] = (4*(div[0]%7)).toString(16).padStart(2, "0");
    div[0] = div[0].toString(16).padStart(2, "0");

    if (rowNum > 2){
        check = bitcheck(c, e, nextnext[0]); // Reject if c == (c|e|d)
        if(check) reject[0] = piece;
        else reject[0] = "";
    }


    for (let i = 0; i < 3; i++) {
        if (reject[i-1]) {
            div[i] = getDiv();
            pieceNumber = divToPieceNumber(div[i]);
            piece = pieceNumberToPiece(pieceNumber);
            nextnext[i] = (4*(div[i]%7)).toString(16).padStart(2, "0");
            div[i] = div[i].toString(16).padStart(2, "0");
            check = bitcheck(c, e, nextnext[i]);
            if(check) reject[i] = piece;
            else reject[i] = "";
        }
    }

    // take the last piece regardless
    if(reject[2] != ""){
        div[3] = getDiv();
        nextnext[3] = (4*(div[3]%7)).toString(16).padStart(2, "0");
        pieceNumber = divToPieceNumber(div[3]);
        div[3] = div[3].toString(16).padStart(2, "0");
        piece = pieceNumberToPiece(pieceNumber);
    }

    // Build row content
    newRow.innerHTML = `
        <td class="id">${rowNum + 1}</td>
        <td class="piece">${c}</td>
        <td class="piece">${rowNum >= 1 ? e : ""}</td>
        <td class="group1">${div[0]}</td>
        <td class="group1">${rowNum >= 2 ? nextnext[0] : ""}</td>
        <td class="group1">${reject[0]}</td>
        <td class="group2">${div[1]}</td>
        <td class="group2">${nextnext[1]}</td>
        <td class="group2">${reject[1]}</td>
        <td class="group3">${div[2]}</td>
        <td class="group3">${nextnext[2]}</td>
        <td class="group3">${reject[2]}</td>
        <td class="group4">${div[3]}</td>
        <td class="group4">${nextnext[3]}</td>
        <td class="piece"><b>${piece}</b></td>
    `;

    tbody.appendChild(newRow);
}

// Set up button click event
document.getElementById('fillButton').addEventListener('click', function() {
    const nRows = parseInt(document.getElementById('rowCount').value, 10);
    if (nRows >= 1 && nRows <= 10000) {
        fillRows(nRows);
    } else {
        alert("Please enter a number between 1 and 10000.");
    }
});