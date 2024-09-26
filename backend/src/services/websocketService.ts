import WebSocket, { Server } from 'ws';
import redisClient from '../config/redisClient';
import { addTaskToDB } from '../controllers/taskControllers'; // MongoDB handling

const REDIS_KEY = 'FULLSTACK_TASK_Somya';

export const handleWebSocket = (wss: Server) => {
  wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', async (message: string) => {
      const data = JSON.parse(message);

      if (data.event === 'add') {
        try {
          // Fetch current tasks from Redis
          let tasks: Array<{ id: string; text: string }> = [];
          const cachedTasks = await redisClient.get(REDIS_KEY);

          // Parse tasks from Redis if they exist, otherwise initialize as an empty array
          if (cachedTasks) {
            tasks = JSON.parse(cachedTasks);
          }

          // Add new task to the list
          const newTask = { id: new Date().toISOString(), text: data.text };
          tasks.push(newTask);

          // Store updated task list back to Redis
          await redisClient.set(REDIS_KEY, JSON.stringify(tasks));

          // Broadcast the new task to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ event: 'taskAdded', task: newTask }));
            }
          });

          // Check if Redis has more than 50 tasks
          if (tasks.length > 50) {
            console.log('Flushing tasks to MongoDB and clearing Redis cache...');

            // Move tasks to MongoDB
            await addTaskToDB(tasks);

            // Clear Redis cache
            await redisClient.del(REDIS_KEY);
          }
        } catch (error) {
          console.error('Error adding task:', error);
        }
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
};
