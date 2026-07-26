let socket = null;
let connectionEstablished = false;
const connectButton = document.getElementById('connectButton');

// Function to establish WebSocket connection
function connectWebSocket() {
    socket = new WebSocket("wss://gameboytetr.is/websocket");

    // WebSocket event handlers
    socket.onopen = () => {
        showToast("WebSocket connection opened.", "green");
        const playerName = document.getElementById('username').value.trim();
        socket.send(JSON.stringify({ action: 'connect_player', name: playerName }));
        webSocketConnected = true;
    };

    socket.onmessage = (event) => {
        if (debugMode) console.log("Message received:", event.data);
        
        let data;
        try {
            data = JSON.parse(event.data);
        } catch {
            showToast("The server returned an unreadable message.", "red");
            return;
        }
        if (data.action === 'connected') {
            showToast(`Your Player ID is ${data.player_id}`);
            document.getElementById('playerId').innerHTML = data.player_id;
            connectionEstablished = true;
        }
    };

    socket.onerror = (error) => {
        showToast("WebSocket Error: " + error, "red");
        webSocketConnected = false;
    };

    socket.onclose = () => {
        if (debugMode) console.log("WebSocket connection closed.");
        webSocketConnected = false;
    };
}

// Event listener for the connect button
connectButton?.addEventListener('click', () => {
    const userName = document.getElementById('username').value.trim();
    if(userName === ""){
        showToast("Please enter a player name.", "orange");
        return;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
        showToast("WebSocket is already connected.", "green");
        return;
    }

    connectWebSocket();
});

// Modified submitString function
function submitString(tileArray, score, level, high, lines, nextPiece, playfieldType) {
    if (!connectionEstablished) {
        showToast("Connection not established. Please connect first.", "red");
        return;
    }
    
    const playerId = document.getElementById('playerId').textContent;

    const sendJson = { 
        field: tileArray, 
        score: score,
        level: level,
        high: high,
        lines: lines,
        nextPiece: nextPiece,
        playfieldType: playfieldType,
        player_id: playerId,
        action: "send"
    };

    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(sendJson));
    } else {
        showToast("WebSocket is not open. Try again later.", "red");
    }
}
