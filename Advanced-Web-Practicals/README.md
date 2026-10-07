# 🌐 Advanced Web Development Frameworks (AWDF) - Comprehensive Practicals Repository

Welcome to the **Advanced Web Development Practicals** repository. This comprehensive suite covers modern full-stack web engineering from frontend single-page applications (SPAs) with React, client-side routing, and complex state management, to backend Node.js/Express architectures, database integration with MongoDB & Mongoose, file management, and enterprise-grade Role-Based Access Control (RBAC) with JWT authentication.

---

## 📂 Project Directory Structure

```plaintext
Advanced-Web-Practicals/
│
├── Practical-01/
│   └── student-portfolio/          # React 19 Student Portfolio (Static SPA)
│
├── Practical-02/
│   └── student-portfolio-routing/  # React Router DOM Multi-Page Portfolio
│
├── Practical-03/
│   └── react-api-project/          # React API Consumer (External REST APIs, Search, Filters)
│
├── Practical-04/
│   └── task-manager-api/           # Express.js In-Memory RESTful API
│
├── Practical-05/
│   └── task-manager-mongodb/       # Express + MongoDB/Mongoose CRUD API
│
├── Practical-06/
│   ├── frontend/                   # React Notes Client with Color Tagging & Filtering
│   └── backend/                    # Express + MongoDB Notes REST API
│
├── Practical-07/
│   ├── frontend/                   # React Blog Client with AuthContext & Protected Routes
│   └── backend/                    # Express + MongoDB JWT Auth & User-Linked Posts
│
├── Practical-08/
│   └── frontend/                   # Advanced React 19 Store (useReducer + Context + Analytics)
│
├── Practical-09/
│   └── backend/                    # Advanced Express File Upload & Middleware Engine (Multer)
│
├── Practical-10/
│   └── backend/                    # Enterprise REST API (RBAC, JWT Refresh Tokens, Aggregations)
│
└── README.md                       # Master Documentation & Setup Guide
```

---

## 🛠️ Technology Stack Summary

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router DOM (v7), Axios, Modern Glassmorphism CSS |
| **Backend** | Node.js, Express.js (v5), Multer, UUID, CORS, Dotenv |
| **Database & Auth** | MongoDB, Mongoose (v9), JSON Web Tokens (jsonwebtoken), Bcrypt.js |
| **State Management** | React Context API, `useReducer`, `useState`, `useMemo`, `localStorage` |

---

## 📋 Comprehensive Practicals Breakdown

---

### 🔹 Practical 01: Student Portfolio SPA
- **Folder:** `Practical-01/student-portfolio/`
- **Tech Stack:** React 19, Vite, Vanilla Modern CSS
- **Description:** A single-page student developer portfolio showcasing biography, education, skills with progress meters, featured projects with interactive live demo/code links, achievements, and an interactive contact form.
- **Key Features:**
  - Responsive dark-mode glassmorphic theme
  - Interactive skill category switching and badges
  - Interactive project gallery with filters
  - Client-side contact form validation
- **How to Run:**
  ```bash
  cd Practical-01/student-portfolio
  npm install
  npm run dev
  ```

---

### 🔹 Practical 02: Multi-Page Portfolio with React Router
- **Folder:** `Practical-02/student-portfolio-routing/`
- **Tech Stack:** React 19, Vite, React Router DOM
- **Description:** Modular multi-page developer portfolio leveraging declarative client-side routing.
- **Key Features:**
  - Route configurations: `/`, `/about`, `/skills`, `/projects`, `/contact`
  - Active navigation indicator with NavLink
  - 404 catch-all redirect
  - Smooth page transitions and modular component architecture
- **How to Run:**
  ```bash
  cd Practical-02/student-portfolio-routing
  npm install
  npm run dev
  ```

---

### 🔹 Practical 03: React API Integration Project
- **Folder:** `Practical-03/react-api-project/`
- **Tech Stack:** React 19, Vite, Axios
- **Description:** Real-world API consumer showcasing asynchronous data fetching, error handling, loading states, search debouncing, and pagination.
- **Key Features:**
  - Real-time search query filtering
  - Category and status filters
  - Detailed modal popups
  - Pull-to-refresh & retry capabilities on network failures
- **How to Run:**
  ```bash
  cd Practical-03/react-api-project
  npm install
  npm run dev
  ```

---

### 🔹 Practical 04: Task Manager REST API (In-Memory)
- **Folder:** `Practical-04/task-manager-api/`
- **Tech Stack:** Node.js, Express.js, UUID, CORS
- **Description:** Full RESTful API with complete CRUD operations stored in-memory, demonstrating HTTP verbs, route parameters, query strings, and custom error handling.
- **Endpoints:**
  - `GET /api/tasks` — List tasks with status filtering, priority sorting, search
  - `GET /api/tasks/:id` — Get single task by ID
  - `POST /api/tasks` — Create task with title, description, priority, due date
  - `PUT /api/tasks/:id` — Update full task
  - `PATCH /api/tasks/:id/status` — Quick toggle status (`pending`, `in_progress`, `completed`)
  - `DELETE /api/tasks/:id` — Remove task
- **How to Run:**
  ```bash
  cd Practical-04/task-manager-api
  npm install
  npm start
  ```

---

### 🔹 Practical 05: Task Manager with MongoDB & Mongoose
- **Folder:** `Practical-05/task-manager-mongodb/`
- **Tech Stack:** Node.js, Express.js, MongoDB, Mongoose, Dotenv
- **Description:** Production-ready persistence layer replacing in-memory storage with MongoDB and Mongoose schemas, validation rules, MVC architecture (Models, Controllers, Routes), and environment configurations.
- **Key Features:**
  - Strict Mongoose schema validation with custom error messages
  - Pre-save hooks and automated timestamps
  - Pagination, sorting, and multi-field queries
- **How to Run:**
  ```bash
  cd Practical-05/task-manager-mongodb
  npm install
  # Ensure MongoDB is running locally at mongodb://localhost:27017
  npm start
  ```

---

### 🔹 Practical 06: Full-Stack Notes Application
- **Folder:** `Practical-06/` (`frontend/` + `backend/`)
- **Tech Stack:** React 19 (Frontend) + Express & MongoDB (Backend)
- **Description:** Complete end-to-end full-stack application.
- **Key Features:**
  - Color-coded note cards (yellow, purple, cyan, green, coral)
  - Category organization & instant search
  - Pinning critical notes to top
  - Live synchronization between React frontend and Express REST API
- **How to Run:**
  ```bash
  # Terminal 1 - Backend:
  cd Practical-06/backend
  npm install
  npm start

  # Terminal 2 - Frontend:
  cd Practical-06/frontend
  npm install
  npm run dev
  ```

---

### 🔹 Practical 07: Full-Stack Authentication & Protected Blog
- **Folder:** `Practical-07/` (`frontend/` + `backend/`)
- **Tech Stack:** React 19 + Express + MongoDB + JWT + Bcrypt.js
- **Description:** Secure multi-user blogging platform with token-based authentication, password hashing, and user-associated resources.
- **Key Features:**
  - User Registration and Login with Bcrypt salted hashing
  - JWT generation and verification via auth middleware
  - React `AuthContext` managing token storage and auto-login
  - Protected blog creation and author-only edit/delete permissions
- **How to Run:**
  ```bash
  # Terminal 1 - Backend:
  cd Practical-07/backend
  npm install
  npm start

  # Terminal 2 - Frontend:
  cd Practical-07/frontend
  npm install
  npm run dev
  ```

---

### 🔹 Practical 08: Advanced Frontend State Management
- **Folder:** `Practical-08/frontend/`
- **Tech Stack:** React 19, Vite, React Router, Context API, `useReducer`
- **Description:** **ApexCommerce** — An advanced state-driven e-commerce and analytics dashboard implementing complex client-side reducers, real-time calculations, and persistent cart/wishlist engines.
- **Key Features:**
  - Centralized `useReducer` managing Catalog, Cart, Wishlist, Orders, and Toast Notifications
  - Multi-faceted filters (Category pills, live price range slider, star rating thresholds)
  - Quantity controls, promo discount engine (`SAVE20`, `WELCOME10`), sales tax and free shipping calculations
  - Full checkout modal and persistent order receipt history
  - Live Analytics tab computing total revenue, average order value, units sold, and catalog inventory distribution
- **How to Run:**
  ```bash
  cd Practical-08/frontend
  npm install
  npm run dev
  ```

---

### 🔹 Practical 09: Advanced Express File Management & Middleware Engine
- **Folder:** `Practical-09/backend/`
- **Tech Stack:** Node.js, Express.js (v5), Multer, UUID, CORS
- **Description:** High-performance file management backend showcasing custom middleware pipelines, disk storage, MIME validation, and in-memory rate limiting.
- **Key Features:**
  - **UUID Request Logger:** Tracks execution time, HTTP status, and client IP
  - **Rate Limiter Middleware:** Sliding window limiting requests per IP address
  - **Multer Disk Engine:** Sanitizes file names, preserves extensions, enforces 10MB limits
  - **Single & Batch Uploads:** Supports up to 5 concurrent files
  - **Streaming & Downloads:** Inline preview (`/view`) and attachment download (`/download`)
  - **Storage Analytics:** Storage volume calculation, file counts, category breakdown
- **Key Endpoints:**
  - `POST /api/files/upload` — Upload single file with category/description
  - `POST /api/files/upload-multiple` — Batch upload files
  - `GET /api/files` — List files with search, pagination, and sorting
  - `GET /api/files/:id` — Get file metadata
  - `GET /api/files/:id/view` — Inline preview/stream
  - `GET /api/files/:id/download` — Download file attachment
  - `DELETE /api/files/:id` — Delete file from disk & registry
  - `GET /api/files/stats` — Storage consumption summary
- **How to Run:**
  ```bash
  cd Practical-09/backend
  npm install
  npm start
  ```

---

### 🔹 Practical 10: Enterprise REST API with RBAC & Aggregations
- **Folder:** `Practical-10/backend/`
- **Tech Stack:** Node.js, Express.js (v5), MongoDB, Mongoose, JWT, Bcrypt.js
- **Description:** Enterprise-level backend featuring multi-tier Role-Based Access Control (**Admin**, **Manager**, **User**), dual-token JWT authentication (access & refresh tokens), audit security trails, and MongoDB aggregation pipelines.
- **Key Features:**
  - **Multi-Role RBAC:** Declarative `authorizeRoles('admin', 'manager')` middleware
  - **Access + Refresh Tokens:** 15-minute access tokens with 7-day refresh token rotation
  - **Security Audit Logger:** Automatically logs administrative events, account modifications, and project operations to `AuditLog` collection
  - **MongoDB Aggregation Pipelines:** Summarizes project statuses, budget analytics (`$sum`, `$avg`, min, max), and completion velocity
  - **User Administration:** Admin endpoints for user promotion/demotion, suspension, and deletion
- **Key Endpoints:**
  - `POST /api/auth/register` — Register account (Admin, Manager, or standard User)
  - `POST /api/auth/login` — Authenticate and receive access & refresh tokens
  - `POST /api/auth/refresh-token` — Rotate session tokens
  - `GET /api/users` — Admin & Manager: View user directory with role filters
  - `PUT /api/users/:id/role` — Admin: Promote or demote user roles
  - `PATCH /api/users/:id/status` — Admin: Suspend or activate user accounts
  - `GET /api/projects` — Role-filtered project directory
  - `POST /api/projects` — Admin & Manager: Create enterprise project
  - `PUT /api/projects/:id` — Update project details or status
  - `DELETE /api/projects/:id` — Admin: Remove project
  - `GET /api/projects/analytics/summary` — MongoDB Aggregation analytics dashboard
  - `GET /api/audit-logs` — Admin: Chronological security audit trail
- **How to Run:**
  ```bash
  cd Practical-10/backend
  npm install
  # Ensure MongoDB is running locally at mongodb://localhost:27017
  npm start
  ```

---

## ⚡ Quick Start / Verification Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Community Server running locally on port `27017` (required for Practicals 05, 06, 07, 10)

### 2. Testing Endpoints with cURL

#### Test Practical 09 (File API):
```bash
# Upload a file
curl -X POST http://localhost:5000/api/files/upload \
  -F "file=@sample.png" \
  -F "category=Design" \
  -F "description=App Mockup"

# Get storage stats
curl http://localhost:5000/api/files/stats
```

#### Test Practical 10 (Enterprise RBAC):
```bash
# 1. Register first user (automatically assigned Admin role)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Admin User", "email": "admin@enterprise.com", "password": "password123"}'

# 2. Login to receive JWT
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@enterprise.com", "password": "password123"}'

# 3. Access Aggregation Analytics (using accessToken from login response)
curl http://localhost:5000/api/projects/analytics/summary \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

---

## 🎓 Academic Integrity & Best Practices
- Every practical follows strict modularization principles and clean coding conventions.
- All secrets and configurations are abstracted into `.env` files.
- Frontend components adhere to responsive layout principles and modern design aesthetics.
