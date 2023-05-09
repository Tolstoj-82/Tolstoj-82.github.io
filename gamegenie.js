function handleInput() {
      
    // This whole function could be optimized... a lot! It feels (and is) so inefficient 

    var input = document.getElementById("hexInput").value.replace(/[-x\s]/gi, "").toUpperCase();
    
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

      var isSame = true;
      var i = 0;
      if (Gl === G2l) {
        while (isSame && i < Gl) {
          if (i === 0) {
            if (G.charAt(i) === G2.charAt(i)) {
              isSame = false;
            }
          } else {
            if (G.charAt(i) !== G2.charAt(i)) {
              isSame = false;
            }
          }
          i++;
        }
      }

      if (G2 === "" && H === "") {
        isSame = true;
      }

      if (isSame) {
        var hexAddress = (F + C + D + E).toUpperCase();
        var oldValue = HInv.charAt(2) + H.charAt(3) + GInv.charAt(0) + GInv.charAt(1) + GInv.charAt(2) + G.charAt(3) + HInv.charAt(0) + H.charAt(1);
        oldValue = parseInt(oldValue, 2).toString(16).padStart(2, '0').toUpperCase();
        var newValue = (A + B).toUpperCase();

        if (G2 === "" && H === "") {
          oldValue = "-";
        }

        document.getElementById("romAddr").value = hexAddress;
        document.getElementById("oldVal").value = oldValue;
        document.getElementById("newVal").value = newValue;

      } else {
        alert("The Game Genie code failed its checksum test! Check the spelling of your code and try again.");
      }
    } else {
      //alert("This is not a valid Game Genie code!");
    }
  }

  function applyCode(){
    address = document.getElementById("romAddr").value.trim();
    oldVal = document.getElementById("oldVal").value.trim();
    newVal = document.getElementById("newVal").value.trim();
    valueInRomAddress = document.getElementById(address).textContent;
    
    // scroll to the address
    scrollToAddress(address);
    
    // only change the value if the old value was the one from the GG code
    if(oldVal == "-" || oldVal == valueInRomAddress){
      
      //exchange the value in the cell
      document.getElementById(address).textContent = newVal;
      document.getElementById(address).classList.add("edited");
      
      // only enable to save if at least one modification has been made
      if(log != ""){

      }

      alert("the value has been altered successfully!");
      const date = new Date();
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const formattedTime = date.toLocaleTimeString(undefined, options);

      addToLog("* GG code added: Address $" + address + " | " + oldVal + " > " + newVal + " (" + formattedTime + ")");
      
      // clear the fields
      document.getElementById("romAddr").value = "";
      document.getElementById("oldVal").value = "";
      document.getElementById("newVal").value = "";
      document.getElementById("hexInput").value = "";

    }else{
        alert("According to the Game Genie code you provided, the ROM Address $" + address + " should contain the value 0x" + oldVal + ". This was not the case and nothing has been changed!\n Make sure the Game Genie code is correct and belongs to this game.");
    }

}