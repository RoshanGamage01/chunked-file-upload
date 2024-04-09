// Define web server and routes here. then add these codes to the file
const WebSocket = require('ws'); // - npm install ws
const handleUpload = require('./handleUpload');

// Create a WebSocket server on port 8080
const fileUploadServer = new WebSocket.Server({ port: 8080 }); 

// When a client connects, listen for messages
fileUploadServer.on('connection', clientSocket => { 
  clientSocket.on('message', message => {
    handleUpload.uploadChunk(JSON.parse(message), clientSocket);
  });
});