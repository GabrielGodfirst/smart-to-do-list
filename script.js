document.addEventListener('DOMContentLoaded', function () {
    const calendarBtn = document.getElementById('calendarBtn');
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from localStorage
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);

    // Load the Google API client library
    gapi.load('client:auth2', initClient);

    calendarBtn.addEventListener('click', () => {
        window.open('https://calendar.google.com/', '_blank'); // Opens Google Calendar in a new tab
    });

    function initClient() {
        gapi.client.init({
            apiKey: 'AIzaSyA4dBf3J3OkYzbMfy-GxbZ119lm9twRhr8',
            clientId: '270408601335-bcr4kkc91b1d0cpmpnt92pi3qrg0o0hp.apps.googleusercontent.com',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: 'https://www.googleapis.com/auth/calendar'
        }).then(() => {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            // User is signed in, you can make API calls here
        } else {
            gapi.auth2.getAuthInstance().signIn();
        }
    }

    function addTask() {
        const taskValue = taskInput.value.trim();
        if (taskValue) {
            const taskDate = prompt("Enter the task date and time (YYYY-MM-DD):"); // Example: 2024-09-10
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox">
                <span>${taskValue}</span>
                <button class="deleteBtn">Delete</button>
            `;

            taskList.appendChild(li);
            saveTask(taskValue, false);

            // Create a calendar event if a date is provided
            if (taskDate) {
                createCalendarEvent(taskValue, taskDate);
            }

            taskInput.value = '';  // Clear the input after adding the task
        }
    }

    function handleTaskActions(e) {
        const taskItem = e.target.closest('.task-item');

        if (e.target.classList.contains('deleteBtn')) {
            removeTask(taskItem);
        }

        if (e.target.classList.contains('task-checkbox')) {
            toggleTaskCompletion(taskItem, e.target.checked);
        }
    }

    function toggleTaskCompletion(taskItem, isCompleted) {
        if (isCompleted) {
            taskItem.classList.add('completed');
            taskItem.querySelector('.deleteBtn').style.display = 'none';
        } else {
            taskItem.classList.remove('completed');
            taskItem.querySelector('.deleteBtn').style.display = 'block';
        }

        updateTask(taskItem.querySelector('span').textContent, isCompleted);
    }

    function saveTask(task, isCompleted) {
        const tasks = getTasks();
        tasks.push({ text: task, completed: isCompleted });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTask(taskItem) {
        const taskText = taskItem.querySelector('span').textContent;
        let tasks = getTasks();
        tasks = tasks.filter(t => t.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        taskItem.remove();
        // If no tasks remain, clear localStorage and ensure UI reflects this
        if (tasks.length === 0) {
            localStorage.removeItem('tasks');
        }
    }

    function loadTasks() {
        const tasks = getTasks();
        taskList.innerHTML = '';  // Clear existing tasks to avoid duplicates
        tasks.forEach(task => {
            if (task.text) {  // Ensure task.text is not undefined or null
                const li = document.createElement('li');
                li.className = 'task-item';
                if (task.completed) {
                    li.classList.add('completed');
                }
                li.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span>${task.text}</span>
                    <button class="deleteBtn" ${task.completed ? 'style="display:none;"' : ''}>Delete</button>
                `;
                taskList.appendChild(li);
            }
        });
    }

    function updateTask(taskText, isCompleted) {
        const tasks = getTasks();
        const task = tasks.find(t => t.text === taskText);
        if (task) {
            task.completed = isCompleted;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    function getTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        // Return an empty array if tasks is null or undefined
        return tasks ? tasks : [];
    }

    function createCalendarEvent(task, dateTime) {
        const event = {
            'summary': task,
            'start': {
                'dateTime': dateTime,
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime': dateTime,
                'timeZone': 'America/Los_Angeles'
            }
        };

        gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        }).then(response => {
            console.log('Event created: ' + response.result.htmlLink);
        });
    }
});
