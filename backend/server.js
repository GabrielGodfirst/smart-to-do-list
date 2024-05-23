const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { google } = require('googleapis');
const cron = require('node-cron');
const twilio = require('twilio');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const taskSchema = new mongoose.Schema({
    name: String,
    dueDate: Date,
    startDate: Date,
    phoneNumber: String,
    reminderSent: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

app.post('/tasks', async (req, res) => {
    const { name, dueDate, startDate, phoneNumber } = req.body;
    const task = new Task({ name, dueDate, startDate, phoneNumber });
    await task.save();
    res.send(task);
});

// Google Calendar Integration (setup authentication here)

// Twilio and Cron Job setup here

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

cron.schedule('* * * * *', async () => {
    const tasks = await Task.find({ reminderSent: false });
    const now = new Date();

    tasks.forEach(task => {
        if (task.dueDate - now <= 86400000) { // 24 hours
            client.messages.create({
                body: `Reminder: Task "${task.name}" is due soon.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: task.phoneNumber
            });
            task.reminderSent = true;
            task.save();
        }
    });
});


app.listen(5000, () => {
    console.log('Server running on port 5000');
});
