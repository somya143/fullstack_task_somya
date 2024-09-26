import { Router } from 'express';
import { getAllTasks } from '../controllers/taskControllers';

const router = Router();

// Define the API route to fetch tasks
router.get('/fetchAllTasks', getAllTasks);

export default router;
