const socket = new WebSocket("wss://gameboytetr.is/websocket");

// WebSocket event handlers
socket.onopen = () => {
    showToast("WebSocket connection opened.", "green");
};

socket.onmessage = (event) => {
    if(debugMode) console.log("Message received:", event.data);
    
    const data = JSON.parse(event.data);
    if (data.action === 'join') {
        showToast(`Player ${data.player_id} joined your game.`);
    } else if (data.action === 'send') {
        showToast(`Message from Player ${data.player_id}: ${data.message}`);
        receivedJson = data.field; // field
    } else if (data.group_nr) {
        showToast(`Your group number is ${data.group_nr}`);
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
        showToast("WebSocket is not open. Try again later.", "red")
    }
}

connectButton.addEventListener('click', () => {
    groupNr = prompt('Enter group number:');
    socket.send(JSON.stringify({ action: 'connect', group_nr: groupNr }));
});