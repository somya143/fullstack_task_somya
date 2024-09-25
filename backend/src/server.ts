import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import Redis from 'ioredis';
import { MongoClient } from 'mongodb';

// Redis configuration
const redisClient = new Redis({
  host: 'redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com',
  port: 12675,
  username: 'default',
  password: 'dssYpBnYQrl01GbCGVhVq2e4dYvUrKJB'
});

// MongoDB configuration
const mongoUrl = 'mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@test-cluster.6f94f5o.mongodb.net/';
const dbName = 'assignment';
const collectionName = 'assignment_somya';

let mongoClient: MongoClient;

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const CACHE_KEY = 'FULLSTACK_TASK_CLAUDE';

interface Task {
  id: string;
  text: string;
}

async function getTasks(): Promise<Task[]> {
  const cachedTasks = await redisClient.get(CACHE_KEY);
  return cachedTasks ? JSON.parse(cachedTasks) : [];
}

async function setTasks(tasks: Task[]): Promise<void> {
  await redisClient.set(CACHE_KEY, JSON.stringify(tasks));
}

async function moveTasksToMongoDB(tasks: Task[]): Promise<void> {
  if (!mongoClient) {
    mongoClient = await MongoClient.connect(mongoUrl);
  }
  const db = mongoClient.db(dbName);
  const collection = db.collection(collectionName);
  await collection.insertMany(tasks);
}

wss.on('connection', (ws) => {
  ws.on('message', async (message: string) => {
    const data = JSON.parse(message);
    if (data.event === 'add') {
      const tasks = await getTasks();
      const newTask: Task = { id: Date.now().toString(), text: data.text };
      tasks.push(newTask);

      if (tasks.length > 50) {
        await moveTasksToMongoDB(tasks.slice(0, 50));
        tasks.splice(0, 50);
      }

      await setTasks(tasks);
      ws.send(JSON.stringify({ event: 'taskAdded', task: newTask }));
    }
  });
});

app.get('/fetchAllTasks', async (req, res) => {
  try {
    const tasks = await getTasks();
    if (!mongoClient) {
      mongoClient = await MongoClient.connect(mongoUrl);
    }
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);
    const mongoTasks = await collection.find({}).toArray();
    res.json([...mongoTasks, ...tasks]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});