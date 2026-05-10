# 📚 BPMCE Backend - Campus Management System

## **README.md**

```markdown
# 🏛️ BPMCE Backend - Campus Management System

> A scalable, production-ready backend system for comprehensive campus management built with Node.js, Express, TypeScript, and MongoDB.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.6.0-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [Role-Based Access Control](#role-based-access-control)
- [Modules](#modules)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**BPMCE Backend** is a centralized Campus Management System designed to handle multiple aspects of campus administration including student management, user management, authentication, hostel management, academic tracking, and more.

The system is built with a **microservices-ready architecture**, making it easy to scale and split into independent services in the future.

### Key Highlights

✅ **Production-Ready** - Clean architecture with industry best practices  
✅ **Type-Safe** - Built with TypeScript in strict mode  
✅ **Secure** - JWT-based authentication with bcrypt password hashing  
✅ **Scalable** - Layered architecture ready for microservices  
✅ **Flexible RBAC** - Role hierarchy with permission inheritance  
✅ **API-First Design** - RESTful APIs for multiple frontend applications  

---

## ✨ Features

### Core Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication (access & refresh tokens)
  - Secure password hashing with bcrypt
  - Token refresh mechanism
  - Session management

- 👥 **User Management**
  - Multi-role user support
  - Role hierarchy with permission inheritance
  - Bulk user creation (CSV import)
  - User activation/deactivation

- 🎓 **Student Management**
  - Complete student CRUD operations
  - Student profile management
  - Search, filter, and pagination
  - Soft delete functionality
  - Future-ready for module integration (hostel, academic, sports)

- 🛡️ **Role-Based Access Control (RBAC)**
  - Hierarchical role system
  - Permission-based authorization
  - Dynamic permission resolution
  - Circular hierarchy prevention

- 📊 **Additional Features**
  - Centralized error handling
  - Request validation with Zod
  - Database indexing for performance
  - CSV bulk operations
  - Comprehensive logging

---

## 🏗️ Architecture

The system follows a **clean, layered architecture**:

```
┌─────────────────────────────────────────┐
│           API Routes Layer              │
│  (Express Routes - Entry Point)         │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Controller Layer                │
│  (Request/Response Handling)            │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│          Service Layer                  │
│  (Business Logic & Validation)          │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│        Repository Layer                 │
│  (Database Operations)                  │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Database Layer                  │
│  (MongoDB with Mongoose)                │
└─────────────────────────────────────────┘
```

### Design Principles

- **Separation of Concerns** - Each layer has a single responsibility
- **Dependency Injection** - Loose coupling between components
- **DRY (Don't Repeat Yourself)** - Reusable utilities and helpers
- **SOLID Principles** - Clean, maintainable code
- **API-First Design** - Backend serves multiple frontends

---

## 🛠️ Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20+ | JavaScript runtime |
| **TypeScript** | 5.3.2 | Type-safe development |
| **Express.js** | 4.18.2 | Web framework |
| **MongoDB** | 9.6.0 | NoSQL database |
| **Mongoose** | 9.6.0 | MongoDB ODM |

### Libraries & Tools

| Library | Purpose |
|---------|---------|
| **Zod** | Schema validation |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **csv-parser** | CSV file parsing |
| **multer** | File upload handling |
| **dotenv** | Environment configuration |
| **cors** | Cross-origin resource sharing |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ts-node** | TypeScript execution |
| **nodemon** | Auto-restart on changes |
| **pnpm** | Fast package manager |

---

## 📁 Project Structure

```
bpmce-backend/
├── config/
│   └── env.ts                     # Environment configuration
├── lib/
│   ├── db.ts                      # Database connection
│   └── apiResponse.ts             # Standardized API responses
├── middlewares/
│   ├── auth.middleware.ts         # JWT authentication
│   ├── rbac.middleware.ts         # Role-based access control
│   └── error.middleware.ts        # Error handling
├── models/
│   ├── user.model.ts              # User schema
│   ├── role.model.ts              # Role schema
│   └── student.model.ts           # Student schema
├── modules/
│   ├── auth/                      # Authentication module
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── types/
│   │   └── utils/
│   ├── user/                      # User management module
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── types/
│   │   └── utils/
│   └── student/                   # Student management module
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── routes/
│       ├── validators/
│       ├── types/
│       └── utils/
├── scripts/
│   └── seed-roles.ts              # Database seeding
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── app.ts                         # Express app setup
├── server.ts                      # Server entry point
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
└── README.md                      # Documentation
```

---

## 🚀 Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v10+) - [Install](https://pnpm.io/installation)
- **MongoDB** (v6+) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

### Clone Repository

```bash
git clone https://github.com/Deepaksingh73229/bpmce-backend.git
cd bpmce-backend
```

### Install Dependencies

```bash
pnpm install
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/campus_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_REFRESH_EXPIRY=30d

# CORS Configuration (Optional)
CORS_ORIGIN=http://localhost:3000
```

⚠️ **Important**: 
- Never commit `.env` to version control
- Use strong, unique secrets in production
- Change default secrets before deployment

---

## 🗄️ Database Setup

### Local MongoDB Setup

1. **Install MongoDB** (if not already installed)

2. **Start MongoDB Service**

   **Windows:**
   ```bash
   net start MongoDB
   ```

   **macOS/Linux:**
   ```bash
   sudo systemctl start mongod
   ```

3. **Verify Connection**
   ```bash
   mongo --eval "db.version()"
   ```

### MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Seed Database

Populate the database with initial roles:

```bash
pnpm run seed
```

This creates the following roles:
- `admin` - Full system access
- `staff` - Read-only access
- `faculty` - Academic management
- `student` - Limited access
- `superintendent` - Student management (child of admin)
- `warden` - Hostel management (child of faculty)
- `office_assistant` - Student operations (child of staff)

---

## 🎬 Running the Application

### Development Mode

```bash
pnpm run dev
```

Server will start at: **http://localhost:5000**

### Production Build

```bash
# Build TypeScript to JavaScript
pnpm run build

# Start production server
pnpm start
```

### Clean Build

```bash
# Remove compiled files
pnpm run clean

# Rebuild
pnpm run build
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-05-10T12:00:00.000Z"
}
```

---

## 🔐 Authentication & Authorization

### Register User

**Endpoint:** `POST /api/v1/auth/register`

**Request:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "roles": ["admin"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Admin User",
      "email": "admin@example.com",
      "roles": [...]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Registration successful"
}
```

---

### Login

**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "Login successful"
}
```

---

### Get Current User

**Endpoint:** `GET /api/v1/auth/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@example.com",
    "roles": [...]
  },
  "message": "User retrieved successfully"
}
```

---

### Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh-token`

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "Token refreshed successfully"
}
```

---

### Logout

**Endpoint:** `POST /api/v1/auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

---

## 🛡️ Role-Based Access Control

### Permission System

The system uses **permission-based authorization** rather than hardcoded roles.

#### Permission Categories

| Category | Permissions |
|----------|-------------|
| **User Management** | `user.create`, `user.read`, `user.update`, `user.delete` |
| **Student Management** | `student.create`, `student.read`, `student.update`, `student.delete` |
| **Hostel Management** | `hostel.manage` |
| **Academic Management** | `academic.manage` |

### Role Hierarchy

Roles can inherit permissions from parent roles:

```
admin (top-level)
  └── superintendent (inherits all admin permissions + additional)

faculty
  └── warden (inherits faculty permissions + hostel.manage)

staff
  └── office_assistant (inherits staff permissions + student operations)
```

### Using Protected Routes

All protected routes require:
1. **Authentication** - Valid JWT token
2. **Authorization** - Required permissions

**Example:**

```typescript
// Requires authentication + user.create permission
router.post('/users', 
  authMiddleware, 
  rbacMiddleware(['user.create']), 
  controller.createUser
);
```

---

## 📦 Modules

### 1. Authentication Module (`/modules/auth`)

**Purpose:** User authentication and session management

**Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

---

### 2. User Module (`/modules/user`)

**Purpose:** User account management

**Endpoints:**
- `POST /users` - Create user (admin only)
- `GET /users` - Get all users with filters
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Deactivate user
- `POST /users/:id/roles` - Assign roles
- `POST /users/bulk-upload` - Bulk create users (CSV)

**Permissions Required:**
- `user.create` - Create users
- `user.read` - View users
- `user.update` - Update users
- `user.delete` - Deactivate users

---

### 3. Student Module (`/modules/student`)

**Purpose:** Student information management

**Endpoints:**
- `POST /students` - Create student
- `GET /students` - Get all students (with pagination/search)
- `GET /students/:id` - Get student by ID
- `PATCH /students/:id` - Update student
- `DELETE /students/:id` - Soft delete student
- `GET /students/:id/full-profile` - Get complete profile

**Student Model:**
```typescript
{
  name: string,
  email: string,
  phone?: string,
  rollNumber: string,
  registrationNumber: string,
  course?: string,
  branch?: string,
  batchYear?: number,
  gender?: string,
  dateOfBirth?: Date,
  address?: string,
  isActive: boolean
}
```

**Permissions Required:**
- `student.create` - Create students
- `student.read` - View students
- `student.update` - Update students
- `student.delete` - Delete students

---

## 🧪 Testing

### Manual Testing with cURL

#### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "roles": ["admin"]
}'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "test123"
}'
```

#### Create Student (Protected)
```bash
curl -X POST http://localhost:5000/api/v1/students \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-d '{
  "name": "John Doe",
  "email": "john@example.com",
  "rollNumber": "2024001",
  "registrationNumber": "REG2024001",
  "course": "B.Tech",
  "branch": "Computer Science",
  "batchYear": 2024
}'
```

#### Get All Students (with filters)
```bash
curl -X GET "http://localhost:5000/api/v1/students?page=1&limit=10&search=John&course=B.Tech" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Testing with Postman

1. Import the API collection (create from endpoints above)
2. Set environment variables:
   - `base_url`: `http://localhost:5000/api/v1`
   - `access_token`: (get from login response)
3. Test each endpoint

---

## 🚀 Deployment

### Prerequisites for Production

- **Node.js** 20+ installed
- **MongoDB** instance (Atlas recommended)
- **Environment variables** configured
- **Reverse proxy** (Nginx/Apache)

### Environment Setup

```bash
# Production environment
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
JWT_SECRET=your_production_secret_here
JWT_REFRESH_SECRET=your_production_refresh_secret_here
```

### Build for Production

```bash
pnpm install --prod
pnpm run build
```

### Run Production Server

```bash
NODE_ENV=production node dist/server.js
```

### Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/server.js --name bpmce-backend

# Auto-restart on system reboot
pm2 startup
pm2 save
```

### Docker Deployment (Optional)

**Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

**Build & Run:**
```bash
docker build -t bpmce-backend .
docker run -p 5000:5000 --env-file .env bpmce-backend
```

---

## 📝 API Response Format

### Success Response

```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "message": "Data retrieved successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error details",
  "message": "User-friendly message"
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, check network access settings

#### 2. JWT Token Errors

**Error:** `Invalid or expired token`

**Solution:**
- Check if token is properly formatted
- Ensure token hasn't expired
- Verify `JWT_SECRET` matches

#### 3. Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### 4. TypeScript Compilation Errors

**Solution:**
```bash
# Clean and rebuild
pnpm run clean
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm run build
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository

```bash
# Fork via GitHub UI, then clone your fork
git clone https://github.com/YOUR_USERNAME/bpmce-backend.git
cd bpmce-backend
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Follow existing code style
- Add tests if applicable
- Update documentation

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

**Commit Message Format:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### 5. Push & Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Deepak Kumar Singh**

- GitHub: [@Deepaksingh73229](https://github.com/Deepaksingh73229)
- Email: deepak.singh@example.com

---

## 🙏 Acknowledgments

- Built with ❤️ for BPMCE
- Inspired by modern backend architecture patterns
- Thanks to the open-source community

---

## 📚 Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT Introduction](https://jwt.io/introduction)

---

## 🔮 Future Enhancements

- [ ] Hostel Management Module
- [ ] Academic Management Module
- [ ] Sports Management Module
- [ ] Attendance Tracking
- [ ] Fee Management
- [ ] Library Management
- [ ] Notification System
- [ ] File Upload (Documents, Images)
- [ ] Reporting & Analytics
- [ ] Email Integration
- [ ] SMS Integration
- [ ] Real-time Updates (WebSockets)
- [ ] API Rate Limiting
- [ ] Comprehensive Test Suite
- [ ] GraphQL API
- [ ] Microservices Architecture

---

## 📊 System Status

- ✅ Authentication System - **Complete**
- ✅ User Management - **Complete**
- ✅ Student Management - **Complete**
- ✅ RBAC System - **Complete**
- 🚧 Hostel Module - **Planned**
- 🚧 Academic Module - **Planned**
- 🚧 Sports Module - **Planned**

---

## 💬 Support

For support, questions, or feedback:

- Open an [Issue](https://github.com/Deepaksingh73229/bpmce-backend/issues)
- Email: support@bpmce.edu
- Documentation: [Wiki](https://github.com/Deepaksingh73229/bpmce-backend/wiki)

---

**⭐ If you found this project helpful, please give it a star!**

---

*Last Updated: May 10, 2026*
```