# BPMCE Campus Management System

A comprehensive, full-stack campus management platform designed for Bakhtiyarpur College of Engineering (BPMCE). This system manages student records, hostel allocations, staff management, and role-based access control.

## 🚀 Overview

This project is a monorepo consisting of a modern React/Next.js frontend and a robust Node.js/Express backend. It provides a centralized dashboard for administrators to manage campus resources efficiently.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Data Fetching**: Axios & React Query
- **Icons**: Lucide React
- **UI Components**: Radix UI & Custom Components

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens) with Refresh Token rotation
- **Validation**: Zod
- **Architecture**: Modular Service-Repository Pattern

## ✨ Key Features

- **Authentication & Authorization**:
  - Secure Login with JWT.
  - Role-Based Access Control (RBAC) for Admin, Staff, and Students.
  - Automatic token refresh mechanism.
- **Hostel Management**:
  - Multi-hostel support.
  - Hierarchical structure: Hostel -> Floor -> Room -> Bed.
  - Real-time occupancy tracking.
- **Student Management**:
  - Complete student profiles (Course, Branch, Batch, Roll No).
  - Automated password generation based on Roll No and DOB.
  - Active/Inactive status tracking.
- **Room Allocation**:
  - Allocate students to specific beds within rooms.
  - Visual floor maps and room status.
- **Dashboard**:
  - Interactive overview of campus statistics.
  - Quick access to key modules.

## 📂 Project Structure

```text
bpmce-campus/
├── frontend/             # Next.js web application
│   ├── app/              # App router (pages & layouts)
│   ├── components/       # UI & Module-specific components
│   ├── services/         # API clients and hooks
│   └── store/            # Global state (Zustand)
├── server/               # Express API
│   ├── config/           # Environment & DB config
│   ├── middlewares/      # Auth, RBAC, Error handling
│   ├── models/           # Mongoose schemas
│   ├── modules/          # Business logic (Auth, Hostel, Student, User)
│   └── scripts/          # Database seeding scripts
└── README.md             # This file
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or later)
- pnpm (recommended) or npm/yarn
- MongoDB instance (local or Atlas)

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file based on the environment requirements:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   ```
4. Seed the database (optional):
   ```bash
   pnpm run seed
   ```
5. Start the development server:
   ```bash
   pnpm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```
4. Start the development server:
   ```bash
   pnpm run dev
   ```

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a Pull Request.

## 📝 License

This project is licensed under the ISC License - see the [server/package.json](server/package.json) file for details.
