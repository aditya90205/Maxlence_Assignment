# 🚀 Maxlence Assignment - MERN Stack Auth System

A modern Full-Stack Authentication system built with **React**, **Node.js**, **Express**, **MySQL (Sequelize)**, and **Redis**. Features include Secure JWT Auth, Google OAuth, Email Verification, and Password Reset.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, React Hook Form
- **Backend:** Node.js, Express, Sequelize (MySQL), Redis
- **Database:** MySQL 8.0
- **Caching:** Redis
- **Authentication:** JWT, Google OAuth 2.0
- **DevOps:** Docker Compose

---

## ⚙️ Project Structure

```bash
.
├── backend/            # Express.js Server
├── frontend/           # React + Vite Application
└── docker-compose.yml  # Infrastructure (MySQL & Redis)
```

---

## 🚀 Getting Started

Follow these steps to get the project running locally.

### 1. Prerequisite
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/) (Optional, for database)
- [NPM](https://www.npmjs.com/)

### 2. Infrastructure Setup (Docker)
If you have Docker installed, you can start MySQL and Redis instantly:
```bash
docker-compose up -d
```

### 3. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   - Create a `.env` file based on `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Update the variables in `.env` with your actual credentials.
4. Start the server:
   ```bash
   npm run dev
   ```

### 4. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Key Features
- ✅ **Secure Authentication**: JWT-based login and registration.
- ✅ **Google OAuth**: One-click login with Google.
- ✅ **Email Verification**: Automatic welcome and verification emails.
- ✅ **Password Management**: Forgot/Reset password functionality.
- ✅ **Profile Management**: User profile updates and image uploads.
- ✅ **Caching**: Optimized session management using Redis.

---

## 📝 License
This project is licensed under the ISC License.
