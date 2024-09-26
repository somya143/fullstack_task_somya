import React, { useState } from 'react';

interface TaskFormProps {
  onAddTask: (taskText: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask);
      setNewTask('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        type="text"
        className="note-input"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New Note..."
      />
      <button type="submit" className="note-button">
        <span>+</span> Add
      </button>
    </form>
  );
};

export default TaskForm;
