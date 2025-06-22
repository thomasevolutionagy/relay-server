const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.get('/', (req, res) => res.send("WebSocket relay server running."));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('✅ Client connected');

  ws.on('message', message => {
    console.log('💬 Received:', message);
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
  console.log(`🚀 Server running on port ${PORT}`);
});
