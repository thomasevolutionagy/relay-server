const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const path = require('path');

// Create a basic HTTPS server
const server = https.createServer({
  // Railway will use its own SSL certificate automatically,
  // so we don’t need to provide cert/key files in production.
  // But locally you would need to do that (this is a placeholder).
}, (req, res) => {
  res.writeHead(200);
  res.end("WebSocket server running");
});

// Create WebSocket server using that HTTPS server
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  console.log('Client connected');
  ws.on('message', message => {
    console.log('Received:', message);

    // Broadcast to all other clients
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
