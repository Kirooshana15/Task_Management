# ServiceFlow — Service Request & Task Management System

ServiceFlow is a premium task management and service delivery platform designed for high-performance teams. It bridges the gap between client service requests and internal engineering workflows with a stunning, modern interface and robust role-based access control.

## 🚀 Project Overview

The system allows **Clients** (represented by Admins/Coordinators) to submit service requests, which are then reviewed, approved, and broken down into actionable **Work Items** for the development team.

### ✨ Key Features
- **Dynamic Dashboard**: Activity visualization with delivery velocity trends and request distribution.
- **Role-Based Access (RBAC)**: Distinct permissions for Admins, Coordinators, and Developers.
- **Clean API**: Lightweight backend responses with internal metadata stripped for maximum efficiency.
- **Human-Readable IDs**: Consistent identifier system (SR-XXX, WI-XXX) across the platform.
- **Secure Authentication**: JWT-based auth with server-side session invalidation on logout.
- **Modern UI**: Dark-themed, glassmorphic design built with React, Tailwind, and Framer Motion.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS (Vanilla CSS for custom components)
- Framer Motion (Animations)
- Recharts (Data Visualization)
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Joi (Validation)
- Bcrypt (Security)

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### 1. Clone & Install
```bash
# Install root dependencies (concurrently)
npm install

# Install Frontend dependencies
cd frontend && npm install

# Install Backend dependencies
cd ../backend && npm install
```

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/serviceflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Running the Project
From the root directory, you can run both frontend and backend simultaneously:
```bash
npm start
```
- **Frontend:** http://localhost:5173 (or assigned port)
- **Backend:** http://localhost:5000

---

## 👤 Test Credentials
The database is automatically seeded with professional test accounts on first run:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `sarah` | `Admin@123` |
| **Coordinator** | `alex` | `Coord@123` |
| **Developer** | `jordan` | `Dev@123` |

---

## 🏗️ Project Structure
```text
.
├── backend/            # Express API
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   └── middleware/   # Auth & Validation
│   └── server.js         # Entry point
├── frontend/           # Vite React App
│   └── src/
│       ├── components/   # Reusable UI
│       ├── contexts/     # Auth & Data State
│       └── pages/        # Main route views
└── package.json        # Project scripts
```

---

## 📝 License
This project is for demonstration purposes. All rights reserved.
