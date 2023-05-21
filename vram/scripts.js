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

$(document).ready(function() {
    $("#getBGMap").click(function() {
      $("#BG-myModal").css("display", "flex");
    });
  
    $(".BG-close").click(function() {
      $("#BG-myModal").css("display", "none");
    });
  });
  

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
        document.querySelectorAll(".BG-cell").forEach(function(c) {
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
    let stackCells = document.querySelectorAll(".BG-stack");
    stackCells.forEach(function(cell) {
        let cellImage = cell.querySelector("img").src;
        let startIndex = cellImage.indexOf("green/") + 6;
        let endIndex = cellImage.indexOf(".png");
        let newGarbage = cellImage.substring(startIndex, endIndex).toUpperCase();
        garbage += newGarbage;
    });
    
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
        li.classList.add("BG-stack");
        ol.appendChild(li);
        
        currentCol++;
    }
    updateCurrentConfiguration();
}

// VRAM Grid (right)
for (let i = 0; i < 256; i++) {
    let hexId = i.toString(16).padStart(2, "0").toUpperCase();
    let cell = document.createElement("div");
    cell.classList.add("BG-cell");
    if(i >= 128 && i <= 135){
        cell.classList.add("standard");
    }
    cell.id = hexId;
    cell.style.backgroundImage = 'url("images/grey/' + hexId + '.png")';
    cell.onclick = function() {
        document.querySelectorAll(".BG-cell").forEach(function(c) {
            c.classList.remove("selected");
        });
        this.classList.add("selected");
        currentMino = this.id;
        document.getElementById("BG-vramgrid").style.borderColor = "rgb(158, 210, 144)";
  };
  document.querySelector(".BG-vramgrid").appendChild(cell);
}

// Given the user selection, add minos to the playfield
$( function(){
    $("#selectable").selectable({
        stop: function(){
            var mino = "mino";
            var remove = false;
            $(".ui-selected", this).each(function(i, el){
                if(i === 0 && this.classList.contains("mino")) remove = true;
                
                if(remove){
                    this.classList.remove(mino);    
                    $(el).find('img').attr('src', 'images/green/' + emptyMino + '.png');
                }else{
                    
                    // make sure 2F is not treated as a mino
                    if(currentMino.toUpperCase() == emptyMino) this.classList.remove(mino);
                    else this.classList.add(mino);
                    $(el).find('img').attr('src', 'images/green/' + currentMino.toUpperCase() + '.png');
                }
                
            });

            // update the mino list
            updateCurrentConfiguration();
        }
    });  
});