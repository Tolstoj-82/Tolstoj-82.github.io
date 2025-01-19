let socket = null;
let connectionEstablished = false;

// Function to establish WebSocket connection
function connectWebSocket(groupNr) {
    socket = new WebSocket("wss://gameboytetr.is/websocket");

    // WebSocket event handlers
    socket.onopen = () => {
        showToast("WebSocket connection opened.", "green");
        socket.send(JSON.stringify({ action: 'connect', group_nr: groupNr }));
    };

    socket.onmessage = (event) => {
        if (debugMode) console.log("Message received:", event.data);
        
        const data = JSON.parse(event.data);
        if (data.action == "name") {
            showToast(`Your Player ID is ${data.player_id}`);
            connectionEstablished = true;
        }
    };

    socket.onerror = (error) => {
        showToast("WebSocket Error: " + error, "red");
    };

    socket.onclose = () => {
        if (debugMode) console.log("WebSocket connection closed.");
    };
}

// Event listener for the connect button
connectButton.addEventListener('click', () => {
    userName = document.getElementById('username').value;
    if(userName === ""){
        showToast("Please enter a player name.", "orange");
        return;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
        showToast("WebSocket is already connected.", "green");
        return;
    }

    const groupNr = prompt('Enter group number:');
    if (groupNr) {
        connectWebSocket(groupNr);
    } else {
        showToast("Connection canceled: Group number is required.", "red");
    }
});

// Modified submitString function
function submitString(tileArray, score, level, high, lines, nextPiece, playfieldType) {
    if (!connectionEstablished) {
        showToast("Connection not established. Please connect first.", "red");
        return;
    }

    const sendJson = { 
        field: tileArray, 
        score: score,
        level: level,
        high: high,
        lines: lines,
        nextPiece: nextPiece,
        playfieldType: playfieldType,
        action: "send"
    };

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(sendJson));
        webSocketConnected = true;
    } else {
        showToast("WebSocket is not open. Try again later.", "red");
        webSocketConnected = false;
    }
}
