# Smart To-Do List

A smart to-do list application that allows users to create tasks with due dates and phone numbers. The app integrates with Google Calendar to set task start dates and uses Twilio to send reminder SMS notifications to users.

Link to site:  https://gabrielgodfirst.github.io/smart-to-do-list/
Blog post: https://medium.com/@godfirstgabriel_46402/smart-to-do-list-portfolio-project-a-journey-of-trials-triumphs-and-learning-0a418bcd8952
Author linkin: www.linkedin.com/in/godfirst-gabriel-nwoko

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Google Calendar Integration](#google-calendar-integration)
- [Twilio Integration](#twilio-integration)
- [License](#license)

## Features

- Create tasks with names, due dates.
- Integrates with Google Calendar to set task start dates.
- Sends reminder SMS notifications via Twilio 24 hours before the task due date.
- Simple and responsive frontend interface.

## Technologies Used

- **Backend:**
  - Twilio
  - Google Calendar API
  - Mysql

- **Frontend:**
  - HTML
  - CSS
  - JavaScript
 
## Setup Instructions

### Prerequisites

- Twilio account
- Google Cloud Platform project with Calendar API enabled

### Clone the Repository

```bash
git clone https://github.com/your-username/smart-todo-list.git
cd smart-todo-list

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

 Start the Application

 Usage

1. Open your browser and navigate to http://localhost.
2. Fill out the form with task details and submit.
3. The task will be added to the database, and an event will be created in Google Calendar.
4. An SMS reminder will be sent 24 hours before the task due date.

 Google Calendar Integration

To integrate with Google Calendar, ensure you have followed these steps:

1. Set up OAuth 2.0 credentials on Google Cloud Platform and obtain the client ID and client secret.
2. Add the credentials to your .env file in the backend.
3. Use the Google Calendar API to create events for task start dates.

 Twilio Integration

To send SMS reminders using Twilio:

1. Create a Twilio account and obtain your account SID, auth token, and Twilio phone number.
2. Add these credentials to your .env file in the backend.
3. Use Twilio's API to send SMS notifications 24 hours before the task due date.

```
