import React from 'react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="note-list">
      {tasks.map((task) => (
        <div key={task.id} className="note-item">
          {task.text}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
