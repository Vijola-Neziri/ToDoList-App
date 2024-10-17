// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// File path for the todos data
const todosFilePath = path.join(__dirname, 'data', 'todos.json');

// Helper functions to read and write todos
const readTodos = () => {
    const data = fs.readFileSync(todosFilePath);
    return JSON.parse(data);
};

const writeTodos = (todos) => {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
};

// GET todos
app.get('/todos', (req, res) => {
    const todos = readTodos();
    res.json(todos);
});

// POST a new todo
app.post('/todos', (req, res) => {
    const todos = readTodos();
    const newTodo = { id: Date.now(), ...req.body }; // Create a new todo with a unique ID
    todos.push(newTodo);
    writeTodos(todos);
    res.status(201).json(newTodo);
});

// PUT to update a todo
app.put('/todos/:id', (req, res) => {
    const todos = readTodos();
    const todoIndex = todos.findIndex(todo => todo.id == req.params.id);
    if (todoIndex !== -1) {
        todos[todoIndex] = { ...todos[todoIndex], ...req.body };
        writeTodos(todos);
        res.json(todos[todoIndex]);
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

// DELETE a todo
app.delete('/todos/:id', (req, res) => {
    const todos = readTodos();
    const newTodos = todos.filter(todo => todo.id != req.params.id);
    writeTodos(newTodos);
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
