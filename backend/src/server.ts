// src/server.ts

import http from 'http';
import WebSocket from 'ws';
import app from './app';
import { handleWebSocket } from './services/websocketService';

// Create the HTTP server and wrap it with WebSocket
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });
handleWebSocket(wss);

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
