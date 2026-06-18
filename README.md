# Task Management Application

A full-stack Task Management Application built using React, Node.js, Express, and MongoDB. This application allows users to register, log in, create tasks, update task details, mark tasks as completed or pending, and delete tasks.

## Live Demo

**Frontend:** https://task-manager-app-wine-omega.vercel.app

**Backend API:** Add your Render backend URL here

**GitHub Repository:** https://github.com/bommakoushik-code/task-manager-app

## Features

* User registration and login
* JWT-based authentication
* Create, read, update, and delete tasks
* Mark tasks as completed or pending
* Add task title and description
* Set task priority: low, medium, or high
* Add due dates for tasks
* Responsive frontend design
* MongoDB database integration
* REST API integration between frontend and backend

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router DOM

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Token
* bcryptjs
* dotenv
* CORS

## Project Structure

```bash
task_manager_app/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/bommakoushik-code/task-manager-app.git
cd task-manager-app
```

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

The backend will run on:

```bash
http://localhost:5000
```

## Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on:

```bash
http://localhost:3000
```

## API Endpoints

### Authentication Routes

```http
POST /api/auth/register
POST /api/auth/login
```

### Task Routes

```http
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

## Deployment

The project is deployed using:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

For production, the frontend environment variable should point to the deployed backend URL:

```env
VITE_API_URL=your_deployed_backend_url
```

## Usage

1. Register a new account.
2. Log in with your account.
3. Create a new task.
4. Edit task details if needed.
5. Mark tasks as completed or pending.
6. Delete tasks when they are no longer needed.

## Author

**Koushik Bomma**

GitHub: https://github.com/bommakoushik-code
