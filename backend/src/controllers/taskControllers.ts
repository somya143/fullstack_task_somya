// src/controllers/tasksController.ts

import { Request, Response } from 'express';

// Dummy data for tasks
let tasks = [
  { id: '1', text: 'First Task' },
  { id: '2', text: 'Second Task' }
];

export const getAllTasks = (req: Request, res: Response) => {
  res.json(tasks);
};

export const addTask = (task: { id: string; text: string }) => {
  tasks.push(task);
};
