const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Create an Express app (just to have an HTTP handler)
const app = express();
app.get('/', (req, res) => res.send("WebSocket relay is running."));

// Create a raw HTTP server that Express and WebSocket will share
const server = http.createServer(app);

// Attach the WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('✅ Client connected');

  ws.on('message', message => {
    console.log('💬 Received:', message);

    // Broadcast to all other connected clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => console.log('❌ Client disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
