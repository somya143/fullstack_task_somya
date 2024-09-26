import { Request, Response } from 'express';
import Task from '../model/taskModel';  // MongoDB model
import redisClient from '../config/redisClient';  // Redis client

const REDIS_KEY = 'FULLSTACK_TASK_Somya';

// Add tasks to MongoDB
export const addTaskToDB = async (tasks: Array<{ id: string; text: string }>) => {
  try {
    await Task.insertMany(tasks);
  } catch (error) {
    throw new Error('Failed to add tasks to MongoDB');
  }
};

// Get all tasks (Redis first, fallback to MongoDB)
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    // Try fetching tasks from Redis
    let cachedTasks = await redisClient.get(REDIS_KEY);
    
    if (cachedTasks) {
      return res.json(JSON.parse(cachedTasks));
    }

    // If not in Redis, fetch from MongoDB
    const tasks = await Task.find();
    
    // Cache the tasks in Redis for future requests
    await redisClient.set(REDIS_KEY, JSON.stringify(tasks), 'EX', 3600); // Cache for 1 hour
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error });
  }
};
