const socket = new WebSocket("wss://gameboytetr.is/websocket");
let connectionEstablished = false;

// WebSocket event handlers
socket.onopen = () => {
    showToast("WebSocket connection opened.", "green");
};

socket.onmessage = (event) => {
    if(debugMode) console.log("Message received:", event.data);
    
    const data = JSON.parse(event.data);
    if (data.action == "name") {
        showToast(`Your Player id is ${data.player_id}`);
        connectionEstablished = true;
    }
};

socket.onerror = (error) => {
    showToast("WebSocket Error:" + error, "red")
};

socket.onclose = () => {
    if(debugMode) console.log("WebSocket connection closed.");
};

function jsonToArray(jsonString) {
    try {
      const array = JSON.parse(jsonString);
      if (Array.isArray(array)) {
        return array;
      } else {
        throw new Error("Parsed object is not an array.");
      }
    } catch (error) {
      showToast("Invalid JSON string or not an array:" + error.message, "red");
      return null;
    }
}
  
function submitString(tileArray, score, level, high, lines, nextPiece, playfieldType){
    
    if(!connectionEstablished) return;

    const sendJson = { 
        field : tileArray, 
        score : score,
        level : level,
        high : high,
        lines : lines,
        nextPiece : nextPiece,
        playfieldType : playfieldType,
        action : "send"
    }

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(sendJson));
    } else {
        // PUT BACK IN!!!
        // showToast("WebSocket is not open. Try again later.", "red")
    }
}

connectButton.addEventListener('click', () => {
    groupNr = prompt('Enter group number:');
    socket.send(JSON.stringify({ action: 'connect', group_nr: groupNr }));
});