const projectInput = document.querySelector(".project-input");
const projectButton = document.querySelector(".project-button");
const projectDropdown = document.querySelector(".project-dropdown");
const todoInput = document.querySelector(".todo-input");
const todoDueDate = document.querySelector(".todo-duedate");
const todoPriority = document.querySelector(".todo-priority");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const priorityButtons = document.querySelectorAll(".filter-priority-btn");

document.addEventListener("DOMContentLoaded", () => {
    getLocalProjects();
    getLocalTodos();
});

projectButton.addEventListener("click", addProject);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", handleTodoAction);
filterOption.addEventListener("change", filterTodo);
priorityButtons.forEach(button => button.addEventListener("click", filterByPriority));

function addProject(event) {
    event.preventDefault();
    if (projectInput.value.trim() === "") return; // Prevent adding empty projects

    const projectName = projectInput.value.trim();
    const projectOption = document.createElement("option");
    projectOption.value = projectName;
    projectOption.innerText = projectName;
    projectDropdown.appendChild(projectOption);

    saveLocalProjects(projectName);

    // Clear input value
    projectInput.value = "";
}

function addTodo(event) {
    event.preventDefault();
    if (todoInput.value.trim() === "") return; // Prevent adding empty todos

    const selectedProject = projectDropdown.value;
    if (selectedProject === "default") {
        alert("Please select a project first.");
        return;
    }

    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput.value;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    const dueDate = document.createElement("span");
    dueDate.innerText = todoDueDate.value ? `Due: ${todoDueDate.value}` : "No Due Date";
    dueDate.classList.add("due-date");
    todoDiv.appendChild(dueDate);

    const priority = document.createElement("span");
    priority.innerText = `Priority: ${todoPriority.value}`;
    priority.classList.add("priority");
    todoDiv.appendChild(priority);

    // Save to Local Storage
    saveLocalTodos(todoInput.value, todoDueDate.value, todoPriority.value, selectedProject);

    // Completed Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.classList.add("delete-btn");
    todoDiv.appendChild(deleteButton);

    // Append to List
    todoList.appendChild(todoDiv);

    // Clear input values
    todoInput.value = "";
    todoDueDate.value = "";
    todoPriority.value = "Low";
}

function handleTodoAction(event) {
    const item = event.target;
    const todo = item.closest(".todo");

    if (item.classList.contains("delete-btn")) {
        todo.remove();
        removeLocalTodos(todo);
    }

    if (item.classList.contains("complete-btn")) {
        todo.classList.toggle("completed");
    }
}

function filterTodo(event) {
    const todos = todoList.childNodes;
    todos.forEach(todo => {
        switch (event.target.value) {
            case "completed":
                if (todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if (!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            default:
                todo.style.display = "flex";
        }
    });
}

function filterByPriority(event) {
    const selectedPriority = event.target.value;
    const todos = todoList.childNodes;

    todos.forEach(todo => {
        const priorityText = todo.querySelector(".priority").innerText;
        if (selectedPriority === "Low" && priorityText.includes("Low") ||
            selectedPriority === "Medium" && priorityText.includes("Medium") ||
            selectedPriority === "High" && priorityText.includes("High")) {
            todo.style.display = "flex";
        } else {
            todo.style.display = "none";
        }
    });

    // Mark the selected button
    priorityButtons.forEach(button => {
        button.classList.remove("active");
    });
    event.target.classList.add("active");
}

// Local Storage functions
function saveLocalProjects(project) {
    let projects;
    if (localStorage.getItem("projects") === null) {
        projects = [];
    } else {
        projects = JSON.parse(localStorage.getItem("projects"));
    }
    projects.push(project);
    localStorage.setItem("projects", JSON.stringify(projects));
}

function getLocalProjects() {
    let projects;
    if (localStorage.getItem("projects") === null) {
        projects = [];
    } else {
        projects = JSON.parse(localStorage.getItem("projects"));
    }
    projects.forEach(project => {
        const projectOption = document.createElement("option");
        projectOption.value = project;
        projectOption.innerText = project;
        projectDropdown.appendChild(projectOption);
    });
}

function saveLocalTodos(todo, dueDate, priority, project) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push({ todo, dueDate, priority, project });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.forEach(todoData => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");

        const newTodo = document.createElement("li");
        newTodo.innerText = todoData.todo;
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);

        const dueDate = document.createElement("span");
        dueDate.innerText = todoData.dueDate ? `Due: ${todoData.dueDate}` : "No Due Date";
        dueDate.classList.add("due-date");
        todoDiv.appendChild(dueDate);

        const priority = document.createElement("span");
        priority.innerText = `Priority: ${todoData.priority}`;
        priority.classList.add("priority");
        todoDiv.appendChild(priority);

        // Completed Button
        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
        completedButton.classList.add("complete-btn");
        todoDiv.appendChild(completedButton);

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add("delete-btn");
        todoDiv.appendChild(deleteButton);

        // Append to List
        todoList.appendChild(todoDiv);

        // Restore completed state
        if (todoData.completed) {
            todoDiv.classList.add("completed");
        }
    });
}

function removeLocalTodos(todo) {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    const todoText = todo.children[0].innerText;
    todos.splice(todos.indexOf(todoText), 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}
