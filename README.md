# Secure Task Management System

A full-stack Task Management Application built as part of the Earnest Fintech Limited Software Engineering Assessment (Track A).

This project demonstrates secure authentication, protected APIs, and complete task management functionality using modern web technologies.

---

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- SQL (SQLite)
- JWT Authentication
- bcrypt for password hashing

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Axios

---

## 🔐 Authentication Features

- User Registration
- User Login
- JWT Access & Refresh Tokens
- Secure Password Hashing (bcrypt)
- Logout
- Protected Routes

---

## 📋 Task Features

- Create Task
- View Tasks
- Update Task Status (Toggle)
- Delete Task
- Search Tasks
- Pagination Support (Backend)

Each user can manage **only their own tasks**.

---

## 🖥️ Application Flow

1. User registers an account
2. User logs in securely
3. JWT access token is stored
4. Dashboard loads user-specific tasks
5. User can create, update, delete, and search tasks
6. Logout securely clears session

---

## 📂 Project Structure

task-management-system/
│
├── backend/
│ ├── src/
│ ├── prisma/
│ └── package.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
│
└── README.md
