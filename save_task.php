<?php
// Set CORS headers
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allow POST and OPTIONS requests
header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // Exit early for preflight requests
}

require_once 'config.php';  // Include the database configuration

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the JSON data from the request
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate the data
    if (is_array($data)) {
        // Connect to the database
        $conn = new mysqli('localhost', 'root', '', 'todo_list_app');

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Begin transaction
        $conn->begin_transaction();

        try {
            foreach ($data as $task) {
                // Prepare and bind
                $stmt = $conn->prepare("INSERT INTO tasks (task, date, completed) VALUES (?, ?, ?)");
                $stmt->bind_param("ssi", $task['task'], $task['date'], $task['completed']);

                // Execute
                $stmt->execute();
            }

            // Commit transaction
            $conn->commit();

            // Close connections
            $stmt->close();
            $conn->close();

            echo "Tasks saved successfully";
        } catch (Exception $e) {
            // Rollback transaction on error
            $conn->rollback();
            echo "Error saving tasks: " . $e->getMessage();
        }
    } else {
        echo "Invalid data format";
    }
} else {
    echo "Invalid request method";
}
?>
