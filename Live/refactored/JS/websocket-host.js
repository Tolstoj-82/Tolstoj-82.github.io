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
        score = data.score; 
        level = data.level;
        high = data.high;
        lines = data.lines; 
        nextPiece = data.nextPiece;
        playfieldType = data.playfieldType;

        // drae the nextbox and playfiled
        populatePlayfield(data.field, level);
        updateNextBox(nextPiece, level);

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
  
function submitString(tileArray){
    //const jsonString = JSON.stringify(tileArray, null, 2);
    const sendJson = { field : tileArray, action : "send"}

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(sendJson));
    } else {
        showToast("WebSocket is not open. Try again later.", "red")
    }
}

startButton.addEventListener('click', () => {
    socket.send(JSON.stringify({ action: 'start', name: 'host' }));
});

disconnectButton.addEventListener('click', () => {
    socket.send(JSON.stringify({ action: 'disconnect', name: 'host' }));
    socket.close();
});