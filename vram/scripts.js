///////////////////////////////////////////////////////////////////////////////
//
// TOLSTOJ 2023 (with the help of ChatGPT)
//
///////////////////////////////////////////////////////////////////////////////

/*******************************************************************************
 (1) GLOBAL VARIABLES AND INITIAL SET-UP
*******************************************************************************/

// global variables defines initial mino and empty mino
var currentMino = "87";
let emptyMino = "2F";
let currentJSON; // stores the current configuration in the JSON format
let importJSON; // stores the JSON to be imported

// do this, once all DOM elements have been loaded 
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById(currentMino).click();
    addMatrix();
});

/*******************************************************************************
 (2) EVENT LISTENERS
*******************************************************************************/

// Track Key presses
document.addEventListener("keydown", function(event) {
    
    let cell = null;
    if(event.code >= "Numpad1" && event.code <= "Numpad8"){
        // numbers 1-8 select the standard minos
        cell = document.getElementById((event.key.charCodeAt(0)-49+128).toString(16).padStart(2, "0"));
    }else if(event.code >= "KeyA" && event.code <= "KeyZ"){
        // letters
        cell = document.getElementById((event.key.toUpperCase().charCodeAt(0) - "A".charCodeAt(0) + 10).toString(16).padStart(2, "0"));
    }else if((event.code >= "Digit0" && event.code <= "Digit9")){
        // numpad 
        cell = document.getElementById((event.key.charCodeAt(0)-48).toString(16).padStart(2, "0"));
    }else if(event.code == "Period" || event.code == "NumpadDecimal"){
        // the dot
        cell = document.getElementById("24");
    }else if(event.code == "Minus" || event.code == "NumpadSubtract"){
        // the dash
        cell = document.getElementById("25");
    }
    
    if(cell != null){
        document.querySelectorAll(".cell").forEach(function(c) {
            c.classList.remove("selected");          
        });
        cell.classList.add("selected");
        currentMino = cell.id;
    }
});

/*******************************************************************************
 (2) FUNCTIONS
*******************************************************************************/


// add the mino list to the textarea
function updateCurrentConfiguration() {
    let garbage = "";
    
    // get the garbage
    let stackCells = document.querySelectorAll(".stack");
    stackCells.forEach(function(cell) {
        let cellImage = cell.querySelector("img").src;
        let startIndex = cellImage.indexOf("green/") + 6;
        let endIndex = cellImage.indexOf(".png");
        let newGarbage = cellImage.substring(startIndex, endIndex).toUpperCase();
        garbage += newGarbage;
    });
    
    let data = {};

    currentJSON = JSON.stringify(data);
}


// copy the textarea to the clipboard
function copyText() {
    navigator.clipboard.writeText(currentJSON);
}

// create the playfield
function addMatrix(){
    ol = document.getElementById("selectable");
    rows = 18;
    cols = 20;
    currentRow = 1;
    currentCol = 0;
 
    for(i=1; i<=(rows*cols); i++){
        li = document.createElement("li");
        let img = document.createElement("img");
        img.src = "images/green/" + emptyMino.toUpperCase() + ".png";
        li.appendChild(img);
        li.classList.add("stack");
        ol.appendChild(li);
        
        currentCol++;
    }
    updateCurrentConfiguration();
}

// import JSON file (1 of 2)
function actualImport(values, pieces, garbageWell){

    // set the garbage well selector to ""
    document.querySelector("#garbage-well").selectedIndex = 0;
        
    // remove all classes except stack, ui-selectee and row-{#}
    $('.stack').removeClass(function(index, className) {
        return (className.match(/(^|\s)(?!ui-selectee|stack|row-)\S+/g) || []).join(' ');
    });

    // Loop through the stack and add the image
    var stackDivs = document.getElementsByClassName("stack");    
    for (var i = 0; i < stackDivs.length; i++) {
        var div = stackDivs[i];
        var img = div.getElementsByTagName("img")[0];
        img.src = "images/green/" + values[i].toUpperCase() + ".png";

        if(values[i].toUpperCase() != emptyMino) div.classList.add("mino");
    }

    displayToast("successImport");
    updateCurrentConfiguration();
    checkAllRows();
    
    // removes the pieces to be generated
    removePieces();
    if(pieces != "") loadInPieceSequence(pieces);

    // if there was a garbage well, select it
    var select = document.querySelector("#garbage-well");

    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === garbageWell) {
            select.selectedIndex = i;
            break;
        }
    } 

}

// import a JSON file (2 of 2)
function jsonToPlayfield() {

    // Parse the content as JSON
    var data = JSON.parse(importJSON);

    // Extract the values and pieces from the data
    var values = [];
    var pieces = data.hasOwnProperty("pieces") ? data.pieces : "";
    var garbage = data.hasOwnProperty("garbage") ? data.garbage : "";
    var garbageWell = data.hasOwnProperty("well_column") ? data.well_column : "";

    // Split the garbage string into 100 2-digit values
    for (var i = 0; i < garbage.length; i += 2) {
        values.push(garbage.substr(i, 2));
    }

    // Check if the number of values is 100
    if (values.length !== 100) {
        displayToast("errorImport");
        return;
    }

    // Check if each value is a 2-digit hexadecimal number
    if (!values.every(val => /^[0-9A-F]{2}$/i.test(val.trim()))) {
        displayToast("errorImport");
        return;
    }

    // Check if the piece sequence makes sense
    var minoDivs = document.getElementsByClassName("mino");
    var gridRows = document.querySelectorAll("#piecesGrid tr");
    if (minoDivs.length > 0 || gridRows.length > 1){
        var confirm = window.confirm("Your current playfield and piece sequence will be overwritten. Continue?");
        if (confirm == true){
            actualImport(values, pieces, garbageWell);
        }
    }else{
        actualImport(values, pieces, garbageWell);
    }
    updateCurrentConfiguration();
}

// Should that be inside a function?
// Create the VRAM Grid (right)
for (let i = 0; i < 256; i++) {
    let hexId = i.toString(16).padStart(2, "0").toUpperCase();
    let cell = document.createElement("div");
    cell.classList.add("cell");
    if(i >= 128 && i <= 135){
        cell.classList.add("standard");
    }
    cell.id = hexId;
    cell.style.backgroundImage = 'url("images/grey/' + hexId + '.png")';
    cell.onclick = function() {
        document.querySelectorAll(".cell").forEach(function(c) {
            c.classList.remove("selected");
        });
        this.classList.add("selected");
        currentMino = this.id;
        document.getElementById("vramgrid").style.borderColor = "rgb(158, 210, 144)";
  };
  document.querySelector(".vramgrid").appendChild(cell);
}

// Given the user selection, add minos to the playfield
// TODO: Ctrl-key inverses remove <-> add (green and red border)
$( function(){
    $("#selectable").selectable({
        stop: function(){
            var mino = "mino";
            var remove = false;
            $(".ui-selected", this).each(function(i, el){
                if(i === 0 && this.classList.contains("mino")) remove = true;
                if(!this.classList.contains("noStack")){
                    if(remove){
                        this.classList.remove(mino);    
                        $(el).find('img').attr('src', 'images/green/' + emptyMino + '.png');
                    }else{
                        
                        // make sure 2F is not treated as a mino
                        if(currentMino.toUpperCase() == emptyMino) this.classList.remove(mino);
                        else this.classList.add(mino);
                        $(el).find('img').attr('src', 'images/green/' + currentMino.toUpperCase() + '.png');
                    }
                }
            });

            // update the mino list
            updateCurrentConfiguration();
        }
    });  
});