// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    // Fetch tasks from the server
    axios.get('/api/tasks').then((response) => setTasks(response.data));
  }, []);

  const addTask = () => {
    // Add a new task to the server
    axios.post('/api/tasks', { title: newTask, completed: false }).then((response) => {
      setTasks([...tasks, response.data]);
      setNewTask('');
    });
  };

  const toggleTask = (id) => {
    // Toggle task completion on the server
    axios.put(`/api/tasks/${id}`, { completed: !tasks.find(task => task._id === id).completed })
      .then((response) => {
        setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      });
  };

  const deleteTask = (id) => {
    // Delete a task on the server
    axios.delete(`/api/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task._id !== id));
    });
  };

  return (
    <div>
      <h1>MERN Todo App</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task._id)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;