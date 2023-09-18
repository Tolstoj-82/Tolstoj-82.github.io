
// global variables defines initial mino and empty mino
var currentMino = "87";

//------------------------------------------------------------------------------------------
// Define the event listener function
function trackKeyPress(event) {
    let cell = null;
    if (event.code >= "KeyA" && event.code <= "KeyZ") {
      // letters
      cell = document.getElementById((event.key.toUpperCase().charCodeAt(0) - "A".charCodeAt(0) + 10).toString(16).padStart(2, "0"));
    } else if ((event.code >= "Digit0" && event.code <= "Digit9")) {
      // numpad
      cell = document.getElementById((event.key.charCodeAt(0) - 48).toString(16).padStart(2, "0"));
    } else if (event.code == "Period" || event.code == "NumpadDecimal") {
      // the dot
      cell = document.getElementById("24");
    } else if (event.code == "Minus" || event.code == "NumpadSubtract") {
      // the dash
      cell = document.getElementById("25");
    }
  
    if (cell != null) {
      document.querySelectorAll(".BG-cell").forEach(function (c) {
        c.classList.remove("selected");
      });
      cell.classList.add("selected");
      currentMino = cell.id;
    }
  }
  
  // Function to enable key press tracking
  function enableKeyPressTracking() {
    document.addEventListener("keydown", trackKeyPress);
  }
  
  // Function to disable key press tracking
  function disableKeyPressTracking() {
    document.removeEventListener("keydown", trackKeyPress);
  }

//------------------------------------------------------------------------------------------
// create the background map
function addMatrix(cols, rows) {

    // Deconstruct the existing matrix
    const ol = document.getElementById("selectable");
    while (ol.firstChild) ol.removeChild(ol.firstChild);

    // Set the width and height dynamically
    const width = cols * 32;
    const height = rows * 32;
    ol.style.width = `${width}px`;
    ol.style.height = `${height}px`;

    for (let i = 1; i <= rows * cols; i++) {
        const li = document.createElement("li");
        const img = document.createElement("img");
        li.appendChild(img);
        li.classList.add("BG-stack");
        ol.appendChild(li);

    }
}

//------------------------------------------------------------------------------------------
// Given the user selection, add tiles to the playfield
$( function(){
    $("#selectable").selectable({
        stop: function(){
            var mino = "mino";
            //var remove = false;
            $(".ui-selected", this).each(function(i, el){
                $(el).find('img')
                .attr('src', localStorage.getItem("tileImage-" + currentMino.toUpperCase()))
                .attr('data-tile-id', currentMino.toUpperCase());

                // Also update the text "behind" the image
                $(el).find('.BGtileID').text(currentMino.toUpperCase());
            });

        }
    });  
});

//------------------------------------------------------------------------------------------
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
        
        var imageSrc = localStorage.getItem("tileImage-" + hexId);
        if (imageSrc) {
            cell.classList.add("BG-cell");
            cell.id = hexId;
            var img = document.createElement("img");
            img.src = imageSrc;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.imageRendering = "pixelated";
            cell.appendChild(img);
            cell.onclick = function() {
                document.querySelectorAll(".BG-cell").forEach(function(c) {
                    c.classList.remove("selected");
                });
                this.classList.add("selected");
                currentMino = this.id;

                document.getElementById("BG-vramgrid").style.borderColor = "rgb(158, 210, 144)";
            };
        }else{
            cell.classList.add("not-clickable-div");
        }

        vramGrid.appendChild(cell);

        // Check if it is the first entry and click it
        if (i === 0) {
            cell.click();
        }
    }

}

//------------------------------------------------------------------------------------------
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

            // add the tile to the local storage
            saveTileToLocalStorage(vramValue);
        }        

        currentId += incrementValue;
      }
      vramIndex += nTiles;
    });
}

//------------------------------------------------------------------------------------------
// saves a tile to the local storage
// a tile div is made into an 8x8 px image
function saveTileToLocalStorage(vramAddress) {
  var canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 8;
  var context = canvas.getContext("2d");

  //var div = document.getElementById("tileaddr-" + tileAddress);
  var div = document.querySelector('.tile[data-vram="' + vramAddress + '"]');
  
  var pixels = div.getElementsByClassName("pixel");

  var pixelStyles = window.getComputedStyle(pixels[0]); // Get computed styles for the first pixel

  for (var i = 0; i < pixels.length; i++) {
    var pixel = pixels[i];
    var pixelStyles = window.getComputedStyle(pixel);
    var color = pixelStyles.backgroundColor;

    var x = i % 8;
    var y = Math.floor(i / 8);
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  }

  var imageDataURL = canvas.toDataURL();
  var localStorageKey = "tileImage-" + vramAddress;
  localStorage.setItem(localStorageKey, imageDataURL);
}

//------------------------------------------------------------------------------------------
// exchanges src of images (BG Map) also adds the address in a DIV. This can be toggled.
function displayTileImageFromLocalStorage(tileAddress, imgId) {
  var localStorageKey = "tileImage-" + tileAddress;
  var imageDataURL = localStorage.getItem(localStorageKey);

  if (imageDataURL) {
    var img = document.getElementById(imgId);
    if (img) {
      img.src = imageDataURL;
      img.setAttribute("data-tile-ID", tileAddress);

      // Get the parent <li> element of the img
      var liElement = img.parentNode;
      if (liElement) {
          // Clear existing content of the <li> element
          liElement.innerHTML = '';

          // Create a <div> element for the tileAddress and make it invisible
          var divElement = document.createElement('div');
          divElement.textContent = tileAddress;
          divElement.classList.add('BGtileID');
          divElement.style.display = 'none';

          // Append the img and the div to the <li> element
          liElement.appendChild(img);
          liElement.appendChild(divElement);
      }
    }
  }
}

//------------------------------------------------------------------------------------------
// wipes images from local storage
// tiles 00 to FF
function wipeTilesFromLocalStorage() {
    for (let i = 0; i < 256; i++) {
      const imageID = i.toString(16).padStart(2, '0').toUpperCase();
      const key = 'tileImage-' + imageID;
      if (localStorage.getItem(key)) localStorage.removeItem(key);
    }
}

//------------------------------------------------------------------------------------------
// Toggles the visibility in the BG Map (image or address)
function toggleBGImages() {
  var olElement = document.getElementById("selectable");
  if (!olElement) return;

  var liElements = olElement.getElementsByTagName("li");
  for (var i = 0; i < liElements.length; i++) {
      var imgElement = liElements[i].querySelector("img");
      var bgDiv = liElements[i].querySelector(".BGtileID");
      if (imgElement && bgDiv) {
          if (imgElement.style.display === "none") {
              imgElement.style.display = "block";
              bgDiv.style.display = "none";
          } else {
              imgElement.style.display = "none";
              bgDiv.style.display = "block";
          }
      }
  }
}