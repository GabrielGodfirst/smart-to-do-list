import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
	const [name, setName] = useState('');
	const [dueDate, setDueDate] = useState(new Date());
	const [startDate, setStartDate] = useState(new Date());
	const [phoneNumber, setPhoneNumber] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await axios.post('http://localhost:5000/tasks', {
				name,
				dueDate,
				startDate,
				phoneNumber
			});
			alert('Task added successfully!');
		} catch (error) {
			console.error('Error adding task:', error);
			alert('Failed to add task.');
		}
	};

	return (
		<div className="container">
		<h1>Smart To-Do List</h1>
		<form onSubmit={handleSubmit}>
		<div>
		<label>Task Name</label>
		<input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
		</div>
		<div>
		<label>Due Date</label>
		<DatePicker selected={dueDate} onChange={date => setDueDate(date)} />
		</div>
		<div>
		<label>Start Date</label>
		<DatePicker selected={startDate} onChange={date => setStartDate(date)} />
		</div>
		<div>
		<label>Phone Number</label>
		<input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
		</div>
		<button type="submit">Add Task</button>
		</form>
		</div>
	);
}

ReactDOM.render(<App />, document.getElementById('root'));
