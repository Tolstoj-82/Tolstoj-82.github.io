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
  // Only allow 6 or 9 digit hexadecimal values
  if (/^[0-9A-F]{6}$/.test(input) || /^[0-9A-F]{9}$/.test(input)) {
    const newValueNumber = parseInt(input.slice(0, 2), 16);
    const addressMiddle = parseInt(input.slice(2, 5), 16);
    const addressHigh = parseInt(input.charAt(5), 16) ^ 0xF;
    const hexAddress = ((addressHigh << 12) | addressMiddle)
      .toString(16).padStart(4, '0').toUpperCase();
    const newValue = newValueNumber.toString(16).padStart(2, '0').toUpperCase();

    let oldValue = "-";
    let isSame = true;

    if (input.length === 9) {
      const g = parseInt(input.charAt(6), 16);
      const g2 = parseInt(input.charAt(7), 16);
      const h = parseInt(input.charAt(8), 16);

      // The checksum nibble is G with its most-significant bit flipped.
      isSame = g2 === (g ^ 0x8);

      const oldValueNumber = ((~h & 0x2) << 6)
        | ((h & 0x1) << 6)
        | ((~g & 0xE) << 2)
        | ((g & 0x1) << 2)
        | ((~h & 0x8) >> 2)
        | ((h & 0x4) >> 2);
      oldValue = oldValueNumber.toString(16).padStart(2, '0').toUpperCase();
    }

    if (isSame) {
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

// Transforms an address, new value and optional old value into a Game Genie code.
function addrToGgCode(address, newValue, oldValue = "") {
  const normalizedAddress = address.toUpperCase();
  const normalizedNewValue = newValue.toUpperCase();
  const normalizedOldValue = oldValue.toUpperCase();

  if (!/^[0-9A-F]{4}$/.test(normalizedAddress)
      || !/^[0-9A-F]{2}$/.test(normalizedNewValue)
      || (normalizedOldValue && !/^[0-9A-F]{2}$/.test(normalizedOldValue))) {
    return "";
  }

  const addressNumber = parseInt(normalizedAddress, 16);
  const encodedAddress = (addressNumber & 0x0FFF).toString(16).padStart(3, "0").toUpperCase()
    + ((addressNumber >>> 12) ^ 0xF).toString(16).toUpperCase();
  let rawCode = normalizedNewValue + encodedAddress;

  if (normalizedOldValue) {
    const oldValueNumber = parseInt(normalizedOldValue, 16);
    const g = (((~oldValueNumber & 0x38) | (oldValueNumber & 0x04)) >>> 2) & 0xF;
    const h = ((~oldValueNumber & 0x02) << 2)
      | ((oldValueNumber & 0x01) << 2)
      | ((~oldValueNumber & 0x80) >>> 6)
      | ((oldValueNumber & 0x40) >>> 6);
    rawCode += g.toString(16) + (g ^ 0x8).toString(16) + h.toString(16);
  }

  rawCode = rawCode.toUpperCase();
  return rawCode.length === 9
    ? `${rawCode.slice(0, 3)}-${rawCode.slice(3, 6)}-${rawCode.slice(6)}`
    : `${rawCode.slice(0, 3)}-${rawCode.slice(3)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("reverseGGModal");
  const addressInput = document.getElementById("reverseGGAddress");
  const newValueInput = document.getElementById("reverseGGNewValue");
  const oldValueInput = document.getElementById("reverseGGOldValue");
  const resultInput = document.getElementById("reverseGGResult");
  const useButton = document.getElementById("useReverseGGCode");

  function updateReverseCode() {
    for (const input of [addressInput, newValueInput, oldValueInput]) {
      input.value = input.value.replace(/[^0-9A-F]/gi, "").toUpperCase();
    }
    resultInput.value = addrToGgCode(addressInput.value, newValueInput.value, oldValueInput.value);
    useButton.disabled = !resultInput.value;
  }

  document.getElementById("openReverseGGButton").addEventListener("click", () => {
    modal.style.display = "block";
    addressInput.focus();
  });
  document.getElementById("closeReverseGGButton").addEventListener("click", () => {
    modal.style.display = "none";
  });
  modal.addEventListener("click", event => {
    if (event.target === modal) modal.style.display = "none";
  });

  for (const input of [addressInput, newValueInput, oldValueInput]) {
    input.addEventListener("input", updateReverseCode);
  }

  useButton.addEventListener("click", () => {
    e_ggCode.value = resultInput.value;
    e_ggCode.dispatchEvent(new Event("input", { bubbles: true }));
    modal.style.display = "none";
  });
});

//-------------------------------------------------------------------------------------------

// Overwrites a ROM value
function applyCode(force = false) {
  
  if (!autoApply && !force) {
    displayToast("manuallySet");
    return false;
  }

  const address = e_romAddr.value.trim();
  const oldVal = e_oldVal.value.trim();
  const newVal = e_newVal.value.trim();
  let returnValue = false;

  let element = document.getElementById(address);

  if (element) {
    let valueInRomAddress = element.textContent;

    // scroll to the address
    scrollToAddress(address);
    
    // only change the value if the old value was the one from the GG code
    if(oldVal === "-" || oldVal === valueInRomAddress){
      
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
  
  let c_red = '#f3baba';
  let c_orange = "'#ffe6b7'";
  
  if(input.length < 6 || !/^[0-9A-Fa-f]+$/.test(input)) {
    clearFields(e_ggCode);
  }else if(input.length > 6 && input.length < 9){
    e_ggCode.style.backgroundColor = c_orange;
    e_oldVal.value = "-";
  } else if (input.length > 9) {
    e_ggCode.style.backgroundColor = c_red;
  }

}
