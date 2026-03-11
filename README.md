# AlgoVerse - InnoLearn

Master Data Structures & Algorithms with Interactive Visualization and Practice

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Pages Overview](#pages-overview)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **Interactive Visualizations**: See how data structures work in real-time
  - Arrays
  - Linked Lists
  - Stacks
  - Queues
  - Binary Trees
  - Binary Search Trees

- **Practice Mode**: Learn and practice coding challenges with instant feedback

- **User Authentication**: Secure login and signup system

- **Code Editor**: Built-in code editor with syntax highlighting

- **Game Stats**: Track your learning progress and statistics

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Monaco Editor** - Code editor
- **D3.js & Konva.js** - Visualization
- **React DnD** - Drag and drop

### Backend
- **Node.js** - Server runtime
- **Express** - Web framework
- **bcryptjs** - Password hashing
- **JWT** - Authentication tokens
- **File-based Storage** - User data persistence

## 📁 Project Structure

```
SIH-InnoLearn-main/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components (Login, Signup, Home)
│   │   ├── practice/        # Practice mode components
│   │   │   ├── components/  # Visualization & code components
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── lib/         # Utilities
│   │   │   ├── types/       # TypeScript types
│   │   │   └── utils/       # Helper functions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json         # Dependencies
│   └── vite.config.ts       # Vite configuration
│
└── backend/                 # Node.js backend
    ├── server/
    │   ├── authServer.js    # Authentication server
    │   ├── .env             # Environment variables
    │   └── users.json       # User data storage (auto-created)
    └── package.json         # Dependencies
```

## 📦 Prerequisites

Before running the application, ensure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8 or higher) - Usually comes with Node.js

Verify installation:
```bash
node --version
npm --version
```

## 🚀 Installation

### 1. Clone or Extract the Project
```bash
cd SIH-InnoLearn-main
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies
```bash
cd ../backend
npm install
```

## ▶️ Running the Application

### Option 1: Run Both Services Sequentially (Simple)

**Terminal 1 - Start Backend:**
```bash
cd backend
node server/authServer.js
```
You should see: `🚀 Auth server running on port 5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:5173/`

### Option 2: Run Both Services in Separate Terminals (Recommended)

**Backend Terminal:**
```bash
# From project root
cd backend
node server/authServer.js
```

**Frontend Terminal:**
```bash
# From project root
cd frontend
npm run dev
```

### Access the Application
Open your browser and navigate to: **http://localhost:5173**

## 🔌 API Endpoints

The backend runs on `http://localhost:5000` and provides the following endpoints:

### Authentication Endpoints

**Signup**
```
POST /signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response: { "message": "User registered successfully!" }
```

**Login**
```
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response: { "message": "Login successful", "token": "jwt-token-here" }
```

**Health Check**
```
GET /health

Response: { "status": "Backend running successfully!" }
```

## 📄 Pages Overview

### 1. **Login Page** (`/login`)
- Email and password authentication
- Link to signup
- Form validation

### 2. **Signup Page** (`/signup`)
- Register new users
- Password strength indicator
- Email validation
- Confirm password field

### 3. **Home Page** (`/`)
- Main dashboard after login
- Navigation to other sections

### 4. **Visualization Page** (`/visualization`)
- Interactive data structure visualizations
  - Arrays
  - Linked Lists
  - Stacks
  - Queues
  - Binary Trees

### 5. **Practice Mode** (`/practice`)
- Coding challenges
- Live code editor with syntax highlighting
- Real-time feedback
- Performance statistics

## 🐛 Troubleshooting

### Issue: "Network error" on Login/Signup
**Solution:**
1. Ensure backend is running on port 5000
2. Check firewall isn't blocking port 5000
3. Verify `.env` file exists in `backend/` folder

### Issue: Frontend won't start
**Solution:**
```bash
cd frontend
npm install  # Reinstall packages
npm run dev
```

### Issue: Port 5000 already in use
**Solution:**
Edit `backend/.env` and change:
```
PORT=5001
```
Then update frontend fetch URLs from `localhost:5000` to `localhost:5001`

### Issue: "Cannot find modules" error
**Solution:**
```bash
# In backend/ or frontend/ directory where error occurred
rm -rf node_modules
npm install
```

### Issue: MongoDB connection error (ignore)
The application now uses file-based storage. MongoDB errors can be safely ignored.

## 🔐 User Authentication

Users are stored in `backend/server/users.json` with encrypted passwords.

Example entry:
```json
{
  "id": "1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$encrypted_hash..."
}
```

## 📝 Available NPM Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
node server/authServer.js    # Start the server
```

## 🎯 Next Steps

1. **Signup** with test credentials
2. **Login** to access the dashboard
3. Explore **Visualization Page** to see data structures in action
4. Try **Practice Mode** to solve coding challenges
5. Check **Performance Stats** to track progress

## 📧 Support

If you encounter any issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all dependencies are installed: `npm install`
3. Ensure both backend and frontend are running
4. Check browser console for detailed error messages (F12)

## 🚦 Quick Start (TL;DR)

```bash
# Terminal 1 - Backend
cd backend
node server/authServer.js

# Terminal 2 - Frontend
cd frontend
npm run dev

# Open browser to http://localhost:5173
```

---

**Happy Learning! 🎓**
