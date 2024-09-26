// src/services/websocketService.ts

import WebSocket, { Server } from 'ws';
import { addTask } from '../controllers/taskControllers';

export const handleWebSocket = (wss: Server) => {
  wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', (message: string) => {
      const data = JSON.parse(message);

      if (data.event === 'add') {
        const newTask = { id: new Date().toISOString(), text: data.text };
        addTask(newTask);
        // Broadcast the new task to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ event: 'taskAdded', task: newTask }));
          }
        });
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
};
