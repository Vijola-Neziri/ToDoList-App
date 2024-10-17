const express = require('express'); // Import express
const fs = require('fs'); // Import file system module
const path = require('path'); // Import path module
const app = express(); // Create an express application

const projectsFilePath = path.join(__dirname, 'projects.json'); // Path to projects JSON file
const todosFilePath = path.join(__dirname, 'todos.json'); // Path to todos JSON file

app.use(express.json()); // Middleware to parse JSON requests

// ---- Create a New Project ----
app.post('/api/projects', (req, res) => {
    const newProject = req.body; // Get new project from request body
    fs.readFile(projectsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send(err); // Handle read error
        const projects = JSON.parse(data); // Parse existing projects
        projects.push(newProject); // Add new project
        fs.writeFile(projectsFilePath, JSON.stringify(projects), err => { // Write back to file
            if (err) return res.status(500).send(err); // Handle write error
            res.status(201).send(newProject); // Respond with created project
        });
    });
});

// ---- Read All Projects ----
app.get('/api/projects', (req, res) => {
    fs.readFile(projectsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send(err); // Handle read error
        res.json(JSON.parse(data)); // Send projects as JSON response
    });
});

// ---- Update a Project ----
app.put('/api/projects/:id', (req, res) => {
    const projectId = req.params.id; // Get project ID from URL
    const updatedProject = req.body; // Get updated project data from request body
    fs.readFile(projectsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send(err); // Handle read error
        const projects = JSON.parse(data); // Parse existing projects
        const index = projects.findIndex(p => p.id === projectId); // Find project by ID
        if (index === -1) return res.status(404).send('Project not found'); // Handle not found
        projects[index] = updatedProject; // Update project
        fs.writeFile(projectsFilePath, JSON.stringify(projects), err => { // Write back to file
            if (err) return res.status(500).send(err); // Handle write error
            res.send(updatedProject); // Respond with updated project
        });
    });
});

// ---- Delete a Project ----
app.delete('/api/projects/:id', (req, res) => {
    const projectId = req.params.id; // Get project ID from URL
    fs.readFile(projectsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send(err); // Handle read error
        let projects = JSON.parse(data); // Parse existing projects
        projects = projects.filter(p => p.id !== projectId); // Remove project
        fs.writeFile(projectsFilePath, JSON.stringify(projects), err => { // Write back to file
            if (err) return res.status(500).send(err); // Handle write error
            res.status(204).send(); // Respond with no content
        });
    });
});

// ---- Additional CRUD Operations for Todos ----

// ---- Create a New Todo ----
app.post('/api/todos', (req, res) => {
    const newTodo = req.body; // Get new todo from request body
    fs.readFile(todosFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send(err); // Handle read error
        const todos = JSON.parse(data); // Parse existing todos
        todos.push(newTodo); // Add new todo
        fs.writeFile(todosFilePath, JSON.stringify(todos), err => { // Write back to file
            if (err) return res.status(500).send(err); // Handle write error
            res.status(201).send(newTodo); // Respond with created todo
        });
    });
});

// ---- Read All Todos ----
app.get('/api/todos', (req, res) => {
    fs.readFile(todosFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send(err); // Handle read error
        res.json(JSON.parse(data)); // Send todos as JSON response
    });
});

// ---- Update a Todo ----
app.put('/api/todos/:id', (req, res) => {
    const todoId = req.params.id; // Get todo ID from URL
    const updatedTodo = req.body; // Get updated todo data from request body
    fs.readFile(todosFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send(err); // Handle read error
        const todos = JSON.parse(data); // Parse existing todos
        const index = todos.findIndex(t => t.id === todoId); // Find todo by ID
        if (index === -1) return res.status(404).send('Todo not found'); // Handle not found
        todos[index] = updatedTodo; // Update todo
        fs.writeFile(todosFilePath, JSON.stringify(todos), err => { // Write back to file
            if (err) return res.status(500).send(err); // Handle write error
            res.send(updatedTodo); // Respond with updated todo
        });
    });
});

// ---- Delete a Todo ----
app.delete('/api/todos/:id', (req, res) => {
    const todoId = req.params.id; // Get todo ID from URL
    fs.readFile(todosFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send(err); // Handle read error
        let todos = JSON.parse(data); // Parse existing todos
        todos = todos.filter(t => t.id !== todoId); // Remove todo
        fs.writeFile(todosFilePath, JSON.stringify(todos), err => { // Write back to file
            if (err) return res.status(500).send(err); // Handle write error
            res.status(204).send(); // Respond with no content
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000; // Define the port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log server start
});
