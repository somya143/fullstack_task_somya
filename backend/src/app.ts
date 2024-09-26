// src/app.ts

import express from 'express';
import tasksRoutes from './routes/taskRoutes';

const app = express();

app.use(express.json()); // Middleware to parse JSON

// Use the tasks routes
app.use(tasksRoutes);

export default app;
