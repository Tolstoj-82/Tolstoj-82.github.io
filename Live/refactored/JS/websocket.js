const socket = new WebSocket("wss://gameboytetr.is/websocket");

// WebSocket event handlers
socket.onopen = () => {
    showToast("WebSocket connection opened.", "green");
};

socket.onmessage = (event) => {
    if(debugMode) console.log("Message received:", event.data);
    receivedJson = event.data;
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
    const jsonString = JSON.stringify(tileArray, null, 2);

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(jsonString);
    } else {
        showToast("WebSocket is not open. Try again later.", "red")
    }
}
