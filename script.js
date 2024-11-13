document.addEventListener("DOMContentLoaded", loadTasks);

const maxChars = 50;

function updateCharCounter() {
    const taskInput = document.getElementById("new-task");
    const remainingChars = maxChars - taskInput.value.length;
    document.getElementById("char-counter").textContent = `Pozostało ${remainingChars} znaków`;
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskToDOM(task.text, task.id));
}

function addTask() {
    const taskInput = document.getElementById("new-task");
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        const taskId = Date.now().toString();
        addTaskToDOM(taskText, taskId);
        saveTask(taskText, taskId);
        taskInput.value = "";
        updateCharCounter();
    }
}

function addTaskToDOM(taskText, taskId) {
    const taskList = document.getElementById("task-list");
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.setAttribute("data-id", taskId);

    const taskSpan = document.createElement("span");
    taskSpan.className = "task-text";
    taskSpan.textContent = taskText;

    const editButton = document.createElement("button");
    editButton.textContent = "Edytuj";
    editButton.onclick = () => editTask(taskId, taskSpan, editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Usuń";
    deleteButton.onclick = () => removeTask(taskId);

    taskItem.appendChild(taskSpan);
    taskItem.appendChild(editButton);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);
}

function saveTask(taskText, taskId) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, id: taskId });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTask(taskId, newText) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, text: newText } : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function removeTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    const taskList = document.getElementById("task-list");
    const taskItem = document.querySelector(`li[data-id="${taskId}"]`);
    if (taskItem) {
        taskList.removeChild(taskItem);
    }
}

function editTask(taskId, taskSpan, editButton) {
    if (editButton.textContent === "Edytuj") {
        const input = document.createElement("input");
        input.type = "text";
        input.value = taskSpan.textContent;
        input.maxLength = maxChars;

        input.addEventListener("input", () => {
            const remainingChars = maxChars - input.value.length;
            document.getElementById("char-counter").textContent = `Pozostało ${remainingChars} znaków`;
        });

        taskSpan.replaceWith(input);
        editButton.textContent = "Zapisz";
        input.setAttribute("data-task-id", taskId);
    } else {
        const input = document.querySelector(`input[data-task-id="${taskId}"]`);
        const newText = input.value.trim();

        if (newText) {
            taskSpan.textContent = newText;
            input.replaceWith(taskSpan);
            editButton.textContent = "Edytuj";
            updateTask(taskId, newText);
        }

        updateCharCounter();
    }
}
