# BizFlow - Smart Local Business Operations Platform

A production-ready **MERN Stack** SaaS application designed for local business management. It features real-time analytics, comprehensive customer and inventory management, role-based access control, and a premium mobile-first UI.

---

## 🏗️ Architecture Overview

The application follows a classic **Client-Server** architecture using the MERN stack:

1.  **Client (Frontend)**:
    -   Built with **React 18** and **Vite** for high performance.
    -   Uses **Material UI (MUI)** for a unified, accessible, and responsive design system.
    -   State management via React Context (`AuthContext`, `ThemeContext`).
    -   Communicates with the backend via RESTful APIs using `axios`.
2.  **Server (Backend)**:
    -   **Node.js** runtime with **Express.js** framework.
    -   REST API structure with controller-service pattern.
    -   Authentication via **JWT** (JSON Web Tokens) stored in local storage.
    -   Email services powered by **Nodemailer** (with dev-mode fallback).
3.  **Database**:
    -   **MongoDB** (NoSQL) for flexible schema design.
    -   **Mongoose** ODM for schema validation and business logic hooks (e.g., password hashing).

---

## 🛠️ Tech Stack

### Frontend
-   **Core**: React 18, Vite
-   **UI/UX**: Material UI (MUI), Emotion, Framer Motion (animations)
-   **Routing**: React Router DOM v6
-   **Http Client**: Axios
-   **Charts**: Recharts

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB + Mongoose
-   **Auth**: JWT, Bcrypt.js
-   **Validation**: Express-Validator
-   **Email**: Nodemailer

---

## 📋 Prerequisites

-   **Node.js** (v16.x or higher)
-   **NPM** or **Yarn**
-   **MongoDB** (Local instance or MongoDB Atlas Connection URI)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd BizFlow
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bizflow  # Or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_jwt_key_123
NODE_ENV=development

# Email Configuration (Optional for Dev, Required for Prod)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```
*(Note: If `EMAIL_USER` is not set, email sending will fallback to console logs for testing.)*

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the Application
-   **Frontend**: `http://localhost:5173` (Vite default) or `http://localhost:3000`
-   **Backend**: `http://localhost:5000`

---

## 🧩 Assumptions & Trade-offs

1.  **Authentication Security**: 
    -   *Assumption*: Tokens are stored in `localStorage` for simplicity.
    -   *Trade-off*: Valid for MVP/SaaS scale, but HttpOnly cookies would be more secure against XSS for banking-grade security.
2.  **Role-Based Access**:
    -   *Assumption*: Three distinct roles (Admin, Staff, Customer) cover all use cases.
    -   *Trade-off*: Permissions are hard-coded in middleware rather than dynamic access control lists (ACLs) for simplicity and speed.
3.  **Email Service**:
    -   *Assumption*: Startups often lack SMTP servers initially.
    -   *Trade-off*: We built a "Dev Mode" fallback that prints emails to the console if credentials aren't found, preventing the app from crashing during local development.
4.  **Data Consistency**:
    -   *Assumption*: MongoDB's eventual consistency is acceptable for analytics.
    -   *Trade-off*: We use aggregation pipelines for real-time stats which is performant, but complex relational integrity (like SQL foreign keys) is managed at the application layer.

---

## 🚀 Key Features

-   **Premium UI**: Dark/Light mode, glassmorphism effects, and cinematic splash screen.
-   **Universal Forgot Password**: Secure email-based recovery for all user roles.
-   **Interactive Dashboard**: Real-time visualization of revenue, profits, and top-selling products.
-   **Staff Management**: Dedicated portals for staff with restricted views ensuring data privacy.
-   **Customer Portal**: Customers can log in to view their purchase history.

---

## 🤝 Contributing

This project is open-source. Please feel free to fork, submit issues, or create pull requests to improve the platform.

---

**Built with ❤️ for Local Businesses**
"# bizflow" 
