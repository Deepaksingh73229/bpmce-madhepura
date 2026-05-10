# BPMCE - Campus Management System Backend API

A comprehensive, modular Node.js backend for the BPMCE Campus Management System. It features Role-Based Access Control (RBAC), secure authentication, and specialized modules to manage users, students, and hostels.

## Features

- **Modular Architecture**: Codebase is split into distinct domains (uth, user, student, hostel) for maintainability.
- **Role-Based Access Control (RBAC)**: Secure access to endpoints based on user roles and specific permissions.
- **Authentication**: JWT-based access and refresh token mechanisms.
- **Database**: MongoDB integration via Mongoose with pre-hook password hashing using cryptjs.
- **Validation**: Schema-based data validation using zod.
- **File Uploads**: Handled using multer.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Encryption**: bcryptjs
- **Package Manager**: pnpm

## Project Structure

`	ext
bpmce/
├── config/              # Configuration (Database, Environment configuration)
├── lib/                 # Core library files and custom API response handlers
├── middlewares/         # Application-level middlewares (Auth, RBAC, Errors)
├── models/              # Global mongoose models (User, Role, etc.)
├── modules/             # Domain-specific modules
│   ├── auth/            # Authentication logic & endpoints
│   ├── hostel/          # Hostel & room allocation endpoints
│   ├── student/         # Student record endpoints
│   └── user/            # System user management endpoints
├── scripts/             # Utility scripts
│   └── seed-roles.js    # Database seeding script for roles and initial users
├── app.js               # Express application setup
└── server.js            # Entry point / Server listener
`

## Setup & Installation

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI
- [pnpm](https://pnpm.io/) package manager

### 1. Install Dependencies

`ash
pnpm install
`

### 2. Environment Variables

Create a .env file in the root directory and configure the following variables:

`env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/bpmce
NODE_ENV=development

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
`

### 3. Database Seeding

To create initial roles (admin, staff, faculty, student, office_assistant, hostel_superintendent) and default sample users, run the seed script:

`ash
pnpm run seed
`

**Default Sample Accounts created by seed script:**
- **Admin**: dmin@college.com / Admin@123
- **Superintendent**: superintendent@college.com / Super@123
- **Student**: student@college.com / Student@123

### 4. Running the Application

**Development Mode:**
`ash
pnpm run dev
`

**Production Mode:**
`ash
pnpm start
`

## Modules & APIs

The project is structured into distinct modules. You can find more targeted information in the module directories:
- **Auth APIs:** /api/v1/auth/* (Login, Register, Token Refresh)
- **User APIs:** /api/v1/users/* (User Management)
- **Student APIs:** /api/v1/students/* (Student Records & Profiles)
- **Hostel APIs:** /api/v1/hostel/* (Beds, Rooms, and Allocations)

## Author

Deepak Kumar Singh

## License

ISC License
