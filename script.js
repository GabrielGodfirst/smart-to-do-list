document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const saveBtn = document.getElementById('saveBtn');
    const viewBtn = document.getElementById('viewBtn');

    // Load tasks from localStorage
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);
    saveBtn.addEventListener('click', saveCompletedTasks);
    viewBtn.addEventListener('click', viewTasks);

    function addTask() {
        const taskValue = taskInput.value.trim();
        const taskDateValue = taskDate.value;

        if (taskValue && taskDateValue) {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox">
                <span class="date">${taskDateValue}</span>
                <span class="task-text">${taskValue}</span>
                <button class="actionBtn removeBtn">Remove</button>
            `;

            taskList.appendChild(li);
            saveTask(taskValue, taskDateValue);

            taskInput.value = '';  // Clear the input after adding the task
            taskDate.value = '';   // Clear the date after adding the task
        } else {
            alert('Please enter a task and select a date.');
        }
    }

    function handleTaskActions(e) {
        const taskItem = e.target.closest('.task-item');

        if (e.target.classList.contains('removeBtn')) {
            removeTask(taskItem);
        }

        if (e.target.classList.contains('task-checkbox')) {
            toggleTaskCompletion(taskItem, e.target.checked);
        }
    }

    function toggleTaskCompletion(taskItem, isChecked) {
        if (isChecked) {
            taskItem.classList.add('completed');
            const removeBtn = taskItem.querySelector('.removeBtn');
            if (removeBtn) {
                removeBtn.remove(); // Remove the remove button when completed
            }
        } else {
            taskItem.classList.remove('completed');
            const removeBtn = document.createElement('button');
            removeBtn.className = 'actionBtn removeBtn';
            removeBtn.textContent = 'Remove';
            taskItem.appendChild(removeBtn); // Re-add the remove button when unchecked
        }

        const taskText = taskItem.querySelector('.task-text').textContent;
        updateTask(taskText, isChecked);
    }

    function removeTask(taskItem) {
        const taskText = taskItem.querySelector('.task-text').textContent;
        const taskDate = taskItem.querySelector('.date').textContent;
        const taskDescription = `${taskText} - ${taskDate}`;
        let tasks = getTasks();
        tasks = tasks.filter(t => `${t.text} - ${t.date}` !== taskDescription);
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
            if (task.text && task.date) {  // Ensure task.text and task.date are not undefined or null
                const li = document.createElement('li');
                li.className = 'task-item';
                li.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="date">${task.date}</span>
                    <span class="task-text">${task.text}</span>
                    <button class="actionBtn removeBtn">Remove</button>
                `;
                if (task.completed) {
                    li.classList.add('completed');
                    li.querySelector('.removeBtn').remove(); // Remove remove button for completed tasks
                }
                taskList.appendChild(li);
            }
        });
    }

    function saveCompletedTasks() {
        const completedTasks = Array.from(document.querySelectorAll('.task-item.completed')).map(taskItem => {
            const taskTextElem = taskItem.querySelector('.task-text');
            const taskDateElem = taskItem.querySelector('.date');

            if (taskTextElem && taskDateElem) {
                return {
                    task: taskTextElem.textContent,
                    date: taskDateElem.textContent,
                    completed: true
                };
            } else {
                console.error('Task elements not found:', taskItem);
                return null; // Skip this task if elements are missing
            }
        }).filter(task => task !== null); // Filter out null values

        if (completedTasks.length > 0) {
            fetch('http://localhost/smart-to-do-list/save_task.php',  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(completedTasks),
            })
            .then(response => response.text())
            .then(data => {
                console.log('Tasks saved:', data);
                //Remove saved tasks from UI
                completedTasks.forEach(task => {
                    const taskItems = document.querySelectorAll('.task-item');
                    taskItems.forEach(taskItem => {
                        const taskTextElem = taskItem.querySelector('.task-text');
                        const taskDateElem = taskItem.querySelector('.date');

                        if (taskTextElem && taskDateElem) {
                            const taskText = taskTextElem.textContent;
                            const taskDate = taskDateElem.textContent;

                            if (taskText === task.task && taskDate === task.date) {
                                taskItem.remove();
                            }
                        }
                    });
                });
            })
            .catch(error => console.error('Error:', error));
        } else {
            console.log('No tasks to save.');
        }
    }

    function saveTask(task, date) {
        const tasks = getTasks();
        tasks.push({ text: task, date: date, completed: false });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTask(taskText, isCompleted) {
        const tasks = getTasks();
        const task = tasks.find(t => t.text === taskText);
        if (task) {
            task.completed = isCompleted;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            // Note: We don't automatically save to the database here
        }
    }

    function getTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        // Return an empty array if tasks is null or undefined
        return tasks ? tasks : [];
    }

    function viewTasks() {
        // Open a new page to view tasks
        window.open('view_tasks.php', '_blank');
    }
});
