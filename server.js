// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mern_todo_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  try {
    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndRemove(req.params.id);
    res.json(deletedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// filepath: d:\Web Development\Projects\mern-todo-app\client\src\App.js
const BASE_URL = 'http://localhost:5000';

useEffect(() => {
  axios.get(`${BASE_URL}/api/tasks`).then((response) => setTasks(response.data));
}, []);

const addTask = () => {
  axios.post(`${BASE_URL}/api/tasks`, { title: newTask, completed: false }).then((response) => {
    setTasks([...tasks, response.data]);
    setNewTask('');
  });
};

const toggleTask = (id) => {
  axios.put(`${BASE_URL}/api/tasks/${id}`, { completed: !tasks.find(task => task._id === id).completed })
    .then((response) => {
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    });
};

const deleteTask = (id) => {
  axios.delete(`${BASE_URL}/api/tasks/${id}`).then(() => {
    setTasks(tasks.filter((task) => task._id !== id));
  });
};