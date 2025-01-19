let socket = null;
let addPlayer1Button = document.getElementById('addPlayer1');
let player1Id = document.getElementById('player1Id');

function connectWebSocket() {
    socket = new WebSocket("wss://gameboytetr.is/websocket");

    // WebSocket event handlers
    socket.onopen = () => {
        showToast("WebSocket connection opened.", "green");
        socket.send(JSON.stringify({ action: 'start_host'}));
    };
    
    socket.onmessage = (event) => {
        console.log("Message received:", event.data);
        const data = JSON.parse(event.data);
        if (data.action === 'nope') {
            showToast("Player does not exist.", "red");
        } else if(data.action === 'added') {
            showToast(`Yo ${data.name} joined your game.`);
        } else if (data.action === 'send') {
    
            // draw the nextbox and playfiled
            populatePlayfield(data.field, data.level);
            updateNextBox(data.nextPiece, data.level);
            showGameMetrics(data.playfieldType, data.score, data.level, data.high, "", data.lines);
    
        } else if (data.action === 'started') {
            gameNumberDiv = document.getElementById("gameNumber");
            gameNumberDiv.style.display = "block";
            gameNumberDiv.innerHTML = `<p>Lobby:</p><p class="number">${data.host_id}</p>`;
            showToast(`Your group number is ${data.host_id}`);
        }
    };
    
    socket.onerror = (error) => {
        showToast("WebSocket Error:" + error, "red")
    };
    
    socket.onclose = () => {
        if(debugMode) console.log("WebSocket connection closed.");
    };
    
}

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
    connectWebSocket();
});

disconnectButton.addEventListener('click', () => {
    socket.send(JSON.stringify({ action: 'disconnect', name: 'host' }));
    socket.close();
});

addPlayer1Button.addEventListener('click', () => {
    socket.send(JSON.stringify({ action: 'add_player', player_id: player1Id.value }));
});