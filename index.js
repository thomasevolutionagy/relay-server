const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

wss.on('connection', ws => {
  console.log('Client connected');
  ws.on('message', message => {
    console.log('Received:', message);
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
