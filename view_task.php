<?php
// view_tasks.php

require_once 'config.php';  // Include the database configuration

// Connect to the database
$conn = new mysqli('localhost', 'root', '', 'todo_list_app');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch tasks
$sql = "SELECT task, date, completed FROM tasks";
$result = $conn->query($sql);

$tasks = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }
}

// Close connection
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Tasks</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f8ff;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #add8e6;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #333;
        }
        .task-list {
            list-style: none;
            padding: 0;
        }
        .task-item {
            background-color: white;
            margin-bottom: 10px;
            padding: 15px;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .task-item.completed {
            background-color: #90ee90;
        }
        .task-text {
            flex-grow: 1;
            margin-left: 10px;
        }
        .task-date {
            width: 100px;
            text-align: right;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>Saved Tasks</h1>
        <ul class="task-list">
            <?php foreach ($tasks as $task): ?>
                <li class="task-item <?php echo $task['completed'] ? 'completed' : ''; ?>">
                    <span class="task-text"><?php echo htmlspecialchars($task['task']); ?></span>
                    <span class="task-date"><?php echo htmlspecialchars($task['date']); ?></span>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>

</body>
</html>
