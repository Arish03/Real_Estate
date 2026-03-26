# Real Estate Management Application

A modern Full-Stack Real Estate management platform built with React and Fastify, designed for high performance, real-time interactions, and seamless property management.

## 🚀 Tech Stack

### Frontend
* **React** (with TypeScript)
* **Tailwind CSS** for utility-first styling
* **React Router DOM** for navigation
* **Lucide React** for beautiful icons

### Backend
* **Fastify** for a high-performance, low-overhead Node.js server
* **MongoDB** with **Mongoose** for data modeling
* **@fastify/websocket** for real-time alerts and notifications
* **JWT & Google OAuth 2.0** for secure authentication
* **Bcrypt** for password hashing

## ✨ Key Features

* **Robust Authentication:** Secure local login with strict password policies and Google OAuth integration.
* **Real-time Notifications:** Instant alerts using WebSockets for broadcast and targeted user updates.
* **Property Management:** Add, edit, and view property listings with multi-image uploads.
* **Interactive Maps:** Built-in map selector for pinning exact geospatial property locations (latitude/longitude).
* **Optimized Data Models:** Embedded subdocuments for activities and notifications to reduce database read latency, with automated safeguards preventing document bloat.

## 🛠️ Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd real-estate-app
```

### 2. Backend Setup
```bash
cd backend
npm install
# Make sure to configure your .env file with your MONGO_URI, JWT_SECRET, and Google OAuth credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📄 License
This project is licensed under the MIT License.