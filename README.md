# AlgoVerse - InnoLearn

Master Data Structures & Algorithms with Interactive Visualization and Practice

##  Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Pages Overview](#pages-overview)

## Features

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

## Tech Stack

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

## Project Structure

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

## Prerequisites

Before running the application, ensure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8 or higher) - Usually comes with Node.js

Verify installation:
```bash
node --version
npm --version
```

## Installation

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

## Running the Application

### Option 1: Run Both Services Sequentially (Simple)

**Terminal 1 - Start Backend:**
```bash
cd backend
node server/authServer.js
```
You should see: ` Auth server running on port 5000`

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

## API Endpoints

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

## Pages Overview

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


