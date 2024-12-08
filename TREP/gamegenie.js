//-------------------------------------------------------------------------------------------

// Transforms a game genie code to (1) address (2) old value (3) newvalue and displays it
function handleInput() {
      
  const disabledButtonText = "nothing to apply - add a code first";
  let input;

  input = e_ggCode.value.replace(/[-x\s]/gi, "").toUpperCase();
    
  // color the input with the game genie code depending on the validity of the code
  formatInputs(input);
  
  // transform game genie code to: address, (old value), new value
  ggCodeToAddr(input);
}

//------------------------------------------------------------------------------------------

// No adding a code if invalid
function clearFields(elem, cleanGG = false){
  elem.style.backgroundColor = 'white';
  if(cleanGG) elem.value = "";
  e_romAddr.value = "";
  e_oldVal.value = "";
  e_newVal.value = "";
  e_applyCode.disabled = true;
  e_applyCode.setAttribute("title", disabledButtonText);
}

//-------------------------------------------------------------------------------------------

// Transforms a game genie code to (1) address (2) old value (3) newvalue
function ggCodeToAddr(input){
  // This whole function could be optimized... a lot! It feels (and is) so inefficient     
  
  // Only allow 6 or 9 digit hexadecimal values
  if (/^[0-9A-F]{6}$/.test(input) || /^[0-9A-F]{9}$/.test(input)) {
    var A = parseInt(input.charAt(0), 16).toString(16);
    var B = parseInt(input.charAt(1), 16).toString(16);
    var C = parseInt(input.charAt(2), 16).toString(16);
    var D = parseInt(input.charAt(3), 16).toString(16);
    var E = parseInt(input.charAt(4), 16).toString(16);
    var F = (0xF - parseInt(input.charAt(5), 16)).toString(16);
    var G = parseInt(input.charAt(6), 16).toString(2).padStart(4, '0');
    var G2 = "";
    var H = "";
    var HInv = "";
    var GInv = "";

    if (input.length === 9) {
      G2 = parseInt(input.charAt(7), 16).toString(2).padStart(4, '0');
      H = parseInt(input.charAt(8), 16).toString(2).padStart(4, '0');
    }

    var Gl = G.length;
    var G2l = G2.length;
    var Hl = H.length;

    for (i = 0; i < Gl; i++) {
      var add = 1;
      if (G.charAt(i) === "1") add = 0;
      GInv += add;
    }

    for (i = 0; i < Hl; i++) {
      var add = 1;
      if (H.charAt(i) === "1") add = 0;
      HInv += add;
    }

    // check if a 9 digit code is valid
    var isSame = Gl === G2l && G.charAt(0) !== G2.charAt(0);
    for (var i = 1; isSame && i < Gl; i++) isSame = G.charAt(i) === G2.charAt(i);
    if (G2 === "" && H === "") isSame = true;

    if (isSame) {
      var hexAddress = (F + C + D + E).toUpperCase();
      var oldValue = HInv.charAt(2) + H.charAt(3) + GInv.charAt(0) + GInv.charAt(1) + GInv.charAt(2) + G.charAt(3) + HInv.charAt(0) + H.charAt(1);
      oldValue = parseInt(oldValue, 2).toString(16).padStart(2, '0').toUpperCase();
      var newValue = (A + B).toUpperCase();

      if (G2 === "" && H === "") oldValue = "-";

      e_romAddr.value = hexAddress;
      e_oldVal.value = oldValue;
      e_newVal.value = newValue;

      e_ggCode.style.backgroundColor = '#baf3ba';
      e_applyCode.removeAttribute("disabled");
      e_applyCode.removeAttribute("title");

    } else {
      alert("The Game Genie code failed its checksum test! Check the spelling of your code and try again.");
    }
  }
}

//-------------------------------------------------------------------------------------------

// Overwrites a ROM value
function applyCode(force = false) {
  
  if (!autoApply && !force) {
    displayToast("manuallySet");
    return false;
  }

  address = e_romAddr.value.trim();
  oldVal = e_oldVal.value.trim();
  newVal = e_newVal.value.trim();
  var returnValue = false;

  var element = document.getElementById(address);

  if (element) {
    var valueInRomAddress = element.textContent;

    // scroll to the address
    scrollToAddress(address);
    
    // only change the value if the old value was the one from the GG code
    if(oldVal == "-" || oldVal == valueInRomAddress){
      
      //exchange the value in the cell
      document.getElementById(address).textContent = newVal;
      document.getElementById(address).classList.add("edited");

      displayToast("hexValueChanged");

      addToLog("Address $" + address + " | " + oldVal + " > " + newVal);
      
      // clear the fields
      clearFields(e_ggCode, true);
      returnValue = true;

    }else{
        alert("According to the Game Genie code you provided, the ROM Address $" + address + " should contain the value 0x" + oldVal + ". This was not the case and nothing has been changed!\nMake sure that the Game Genie code is correct and belongs to this game.\nIf you still want that code, you can force it by leaving the last 3 digits away. The code is in the Game Genie Code field.\nnote that forcing this is only reliable applicable for games up to 32KB.");
        returnValue = false;
    }

  }

  return returnValue;
}

function formattedTime(){
  const date = new Date();
  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const returnValue = date.toLocaleTimeString(undefined, options);
  return returnValue;
}

//-------------------------------------------------------------------------------------------

// Change the color of the code field depending on the validity of the input
function formatInputs(input){
  
  var c_red = '#f3baba';
  var c_orange = "'#ffe6b7'";
  
  if(input.length < 6 || !/^[0-9A-Fa-f]+$/.test(input)) {
    clearFields(e_ggCode);
  }else if(input.length > 6 && input.length < 9){
    e_ggCode.style.backgroundColor = c_orange;
    e_oldVal.value = "-";
  } else if (input.length > 9) {
    e_ggCode.style.backgroundColor = c_red;
  }

}