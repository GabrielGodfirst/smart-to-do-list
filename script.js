document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from localStorage
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', deleteTask);

    function addTask() {
        const taskValue = taskInput.value.trim();
        if (taskValue) {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <span>${taskValue}</span>
                <button class="deleteBtn">Delete</button>
            `;

            taskList.appendChild(li);
            saveTask(taskValue);
            taskInput.value = '';
        }
    }

    function deleteTask(e) {
        if (e.target.classList.contains('deleteBtn')) {
            const taskItem = e.target.parentElement;
            removeTask(taskItem.textContent.replace('Delete', '').trim());
            taskItem.remove();
        }
    }

    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        // Integrate with Google Calendar
        // integrateGoogleCalendar(task);
        // Send SMS reminder with Twilio
        // sendSMSReminder(task);
    }

    function removeTask(task) {
        let tasks = getTasks();
        tasks = tasks.filter(t => t !== task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <span>${task}</span>
                <button class="deleteBtn">Delete</button>
            `;
            taskList.appendChild(li);
        });
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    // Function to integrate Google Calendar (placeholder)
    function integrateGoogleCalendar(task) {
        // Google Calendar API integration logic here
    }

    // Function to send SMS reminder with Twilio (placeholder)
    function sendSMSReminder(task) {
        // Twilio API integration logic here
    }
});
