const todoInput = document.querySelector(".todo-input");
const todoDueDate = document.querySelector(".todo-duedate");
const todoPriority = document.querySelector(".todo-priority");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");
const priorityButtons = document.querySelectorAll(".filter-priority-btn");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", handleTodoAction); 
filterOption.addEventListener("change", filterTodo);
priorityButtons.forEach(button => button.addEventListener("click", filterByPriority));

function addTodo(event) {
    event.preventDefault();
    if (todoInput.value.trim() === "") return; // Prevent adding empty todos

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
    saveLocalTodos(todoInput.value, todoDueDate.value, todoPriority.value);
    
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

function handleTodoAction(e) {
    const item = e.target;

    // Check if the clicked element is a delete button
    if (item.classList.contains("delete-btn") || item.parentElement.classList.contains("delete-btn")) {
        const todo = item.closest('.todo'); // Find the closest .todo element
        if (todo) {
            todo.remove(); // Remove todo from the DOM
            removeLocalTodos(todo); // Remove from local storage
        }
    } else if (item.classList.contains("complete-btn")) {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}

function filterTodo(e) {
    const todos = Array.from(todoList.childNodes);
    
    todos.forEach(todo => {
        switch(e.target.value) {
            case "all": 
                todo.style.display = "flex";
                break;
            case "completed": 
                todo.style.display = todo.classList.contains("completed") ? "flex" : "none";
                break;
            case "incomplete":
                todo.style.display = !todo.classList.contains("completed") ? "flex" : "none";
                break;
        }
    });
}

function filterByPriority(e) {
    const priority = e.target.dataset.priority;
    const todos = Array.from(todoList.childNodes);

    todos.forEach(todo => {
        const todoPriority = todo.querySelector(".priority").innerText.split(": ")[1];
        todo.style.display = (todoPriority === priority) ? "flex" : "none";
    });
}

function saveLocalTodos(todo, dueDate, priority) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    todos.push({task: todo, due: dueDate, priority: priority});
    localStorage.setItem("todos", JSON.stringify(todos));
}

function removeLocalTodos(todo) {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    const todoIndex = todos.findIndex(t => t.task === todo.querySelector(".todo-item").innerText);
    if (todoIndex > -1) {
        todos.splice(todoIndex, 1);
    }
    
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }

    todos.forEach(todo => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");

        const newTodo = document.createElement("li");
        newTodo.innerText = todo.task; 
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);

        const dueDate = document.createElement("span");
        dueDate.innerText = todo.due ? `Due: ${todo.due}` : "No Due Date";
        dueDate.classList.add("due-date");
        todoDiv.appendChild(dueDate);

        const priority = document.createElement("span");
        priority.innerText = `Priority: ${todo.priority}`;
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
    });
}
