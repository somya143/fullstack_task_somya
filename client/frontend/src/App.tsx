import React, { useState, useEffect } from 'react';
import './App.css';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import NoteHeader from './components/NoteHeader';
import { Task } from './types';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    setSocket(ws);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event === 'taskAdded') {
        setTasks((prevTasks) => [...prevTasks, data.task]);
      }
    };
    fetchTasks();
    return () => {
      ws.close();
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3001/fetchAllTasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleAddTask = (taskText: string) => {
    if (socket) {
      socket.send(JSON.stringify({ event: 'add', text: taskText }));
    }
  };

  return (
    <div className="note-app">
      <div className="note-container">
        <NoteHeader />
        <TaskForm onAddTask={handleAddTask} />
        <h2 className="note-list-title">Notes</h2>
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
};

export default App;
