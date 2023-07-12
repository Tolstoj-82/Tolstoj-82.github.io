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
function addMatrix(cols, rows) {
    // Deconstruct the existing matrix
    const ol = document.getElementById("selectable");
    while (ol.firstChild) {
        ol.removeChild(ol.firstChild);
    }

    // Set the width and height dynamically
    const width = cols * 32;
    const height = rows * 32;
    ol.style.width = `${width}px`;
    ol.style.height = `${height}px`;

    // Create the new matrix
    //let currentRow = 1;
    //let currentCol = 0;

    for (let i = 1; i <= rows * cols; i++) {
        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = "images/green/" + emptyMino.toUpperCase() + ".png";
        li.appendChild(img);
        li.classList.add("BG-stack");
        ol.appendChild(li);

        //currentCol++;
    }
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

// Collects the tiles, that go to the VRAM Grid
// These were assigned the data attribute "data-vram"
// containing the index 0-255 in the vram tile set
function loadTileContentToVRAMGrid() {
    // Clear existing cells in the VRAM grid
    const vramGrid = document.querySelector(".BG-vramgrid");
    vramGrid.innerHTML = "";

    // VRAM Grid (right)
    for (let i = 0; i < 256; i++) {
        let hexId = i.toString(16).padStart(2, "0").toUpperCase();
        let cell = document.createElement("div");
        cell.classList.add("BG-cell");
        if (i >= 128 && i <= 135) {
            cell.classList.add("standard");
        }
        cell.id = hexId;
        cell.textContent = hexId; // Set the text content to hexId

        // Load content from tile divs with data-vram
        let tileDiv = document.querySelector(`.tile[data-vram="${hexId}"]`);
        if (tileDiv) {
            cell.innerHTML = tileDiv.innerHTML;
        } else {
            cell.classList.add("no-tile"); // Add the "no-tile" class to cells without tile content
        }

        cell.onclick = function() {
            document.querySelectorAll(".BG-cell").forEach(function(c) {
                c.classList.remove("selected");
            });
            this.classList.add("selected");
            currentMino = this.id;
            //alert(currentMino);
            document.getElementById("BG-vramgrid").style.borderColor = "rgb(158, 210, 144)";
        };
        vramGrid.appendChild(cell);
    }
}

// loads a VRAM Tile Set
// assigns data-vram attribute to the tile divs starting at 1 (max 256 tiles!)
// setToLoad is an array of arrays and can be found as "vRamTileSets" in the lookup tables
// these are "Start-Set", "Game Play-Set" or "Celebration-Set"
function assignVramTileSet(setToLoad) {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
      tile.removeAttribute('data-vram');
    });
  
    let vramIndex = 0;
  
    setToLoad.forEach(set => {
      const [start, nTiles, bitsPerPixel] = set;
    
      let currentId = parseInt(start, 16);
      const incrementValue = bitsPerPixel === 1 ? 8 : 16;
  
      for (let i = 0; i < nTiles; i++) {
        const currentIdHex = currentId.toString(16).toUpperCase();
        const tile = document.getElementById("tileaddr-" + currentIdHex);
        
        if (tile) {
            let vramValue = (i + vramIndex).toString(16).padStart(2, "0").toUpperCase();
            tile.setAttribute('data-vram', vramValue);
        }        

        currentId += incrementValue;
      }
      vramIndex += nTiles;
    });
}