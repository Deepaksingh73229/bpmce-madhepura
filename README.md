<div align="center">

# 🏛️ BPMCE CampusCore

### Centralized Campus Management Infrastructure

A scalable and modular backend platform designed to manage hostel, student, academic, and administrative systems through a unified API architecture.

<br/>

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
<img src="https://img.shields.io/badge/RBAC-System-blue?style=for-the-badge" />

<br/>
<br/>

> 🚀 Modular • Secure • Scalable • API-First

</div>

---

# ✨ Overview

CampusCore is a centralized backend system built to act as the **single source of truth** for student-related data across the campus.

Instead of maintaining separate disconnected systems for:
- Hostel
- Academics
- Administration
- Sports
- Student Services

CampusCore provides a unified backend ecosystem that can securely power multiple utility applications through APIs.

---

# 🎯 Goals

- Centralized student data management
- Scalable modular architecture
- Secure role-based access control
- API-first development approach
- Future-ready system design
- Multi-hostel support

---

# 🧠 Core Philosophy

## 🔹 Modular Architecture
Each feature is developed independently in modules for maintainability and scalability.

## 🔹 Centralized Data
All systems consume data from one centralized backend instead of maintaining duplicate records.

## 🔹 API-First Design
Frontend applications, mobile apps, and future services communicate through secure APIs.

## 🔹 Scalable Foundation
The architecture is designed so it can later evolve into dedicated microservices without major rewrites.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │   Frontend Apps     │
                    │  Web / Mobile / ERP │
                    └──────────┬──────────┘
                               │
                               ▼
               ┌────────────────────────────┐
               │       CampusCore API       │
               │  Centralized Backend Core  │
               └──────────┬─────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
 ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
 │ Hostel      │   │ Student     │   │ Academic    │
 │ Module      │   │ Module      │   │ Module      │
 └─────────────┘   └─────────────┘   └─────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │    MongoDB     │
                 └────────────────┘
```

---

# 🧩 Modules

## 🔐 Authentication Module
Handles:
- Login
- Registration
- JWT authentication
- Refresh tokens
- Session management

---

## 👥 User & RBAC Module
Handles:
- User management
- Roles
- Permissions
- Authorization
- Role hierarchy

---

## 🏢 Hostel Module
Handles:
- Hostel management
- Floor management
- Room management
- Occupancy tracking
- Room allocation

---

## 🧑‍🎓 Student Module
Handles:
- Student profiles
- Hostel assignments
- Status tracking
- Student records

---

## 🌙 Leave Module
Handles:
- Leave applications
- Leave approval/rejection
- Student availability tracking
- Leave history

---

## 🛠️ Complaint Module
Handles:
- Hostel complaints
- Complaint tracking
- Complaint resolution workflow

---

# 🔐 Role Hierarchy

```text
Admin
 └── Superintendent
       └── Warden
             └── Student
```

---

# 🛡️ Role-Based Access Control

CampusCore uses a permission-based authorization system.

## Example Permissions

```text
user.create
user.read
student.manage
hostel.manage
leave.approve
complaint.resolve
```

## Features

- Permission inheritance
- Resource-level access
- Hostel-specific authority
- Secure protected routes

---

# 🏢 Hostel System Design

The hostel system is designed to support multiple hostels dynamically.

## Current Structure

- 2 Boys Hostels
- 1 Girls Hostel

## Features

- Multi-hostel support
- Dynamic floor creation
- Dynamic room creation
- Superintendent-level hostel control
- Warden-level student operations

---

# ⚙️ Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Zod | Validation |
| dotenv | Environment Configuration |

---

# 📁 Project Structure

```bash
src/
├── config/
├── lib/
├── middlewares/
├── models/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── role/
│   ├── hostel/
│   ├── room/
│   ├── student/
│   ├── leave/
│   └── complaint/
├── routes/
├── scripts/
└── server.js
```

---

# 🚀 Getting Started

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/campuscore.git

cd campuscore
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

# ⚙️ Environment Setup

Create a `.env` file in the root directory.

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/campuscore

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=7d

JWT_REFRESH_SECRET=your_refresh_secret

JWT_REFRESH_EXPIRES_IN=30d
```

---

# ▶️ Running the Server

## Development

```bash
npm run dev
```

---

## Production

```bash
npm start
```

---

# 🌱 Database Seeding

Seed initial roles and users.

```bash
npm run seed
```

---

# 👤 Default Seeded Accounts

## 🔹 Admin

```text
Email: admin@college.com
Password: Admin@123
```

---

## 🔹 Superintendent

```text
Email: superintendent@college.com
Password: Super@123
```

---

## 🔹 Student

```text
Email: student@college.com
Password: Student@123
```

---

# 📡 API Base URL

```text
http://localhost:5000/api/v1
```

---

# 🔑 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register user |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh-token` | Refresh token |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Current user |

---

# 🧑‍🎓 Student Endpoints

| Method | Endpoint |
|--------|----------|
| POST | `/students` |
| GET | `/students` |
| GET | `/students/:id` |
| PATCH | `/students/:id` |
| DELETE | `/students/:id` |

---

# 🏢 Hostel Endpoints

| Method | Endpoint |
|--------|----------|
| POST | `/hostels` |
| GET | `/hostels` |
| PATCH | `/hostels/:id` |
| DELETE | `/hostels/:id` |

---

# 🌙 Leave Endpoints

| Method | Endpoint |
|--------|----------|
| POST | `/leave/apply` |
| GET | `/leave/student/:id` |
| PATCH | `/leave/:id/approve` |
| PATCH | `/leave/:id/reject` |

---

# 🛠️ Complaint Endpoints

| Method | Endpoint |
|--------|----------|
| POST | `/complaints` |
| GET | `/complaints` |
| PATCH | `/complaints/:id` |
| DELETE | `/complaints/:id` |

---

# 🔒 Authentication Example

Protected routes require:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# 📦 Example API Response

## Success Response

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

---

# 🔮 Future Scope

## Planned Features

- Academic Management
- Sports Management
- Achievement Tracking
- Notification System
- QR-based Entry System
- Analytics Dashboard
- Real-time Updates
- Mobile App Integration
- API Rate Limiting

---

# 🧪 Development Principles

- Clean Architecture
- Modular Development
- Separation of Concerns
- Reusable Components
- Future Scalability
- Maintainable Codebase

---

# 🤝 Contributing

## Create Branch

```bash
git checkout -b feature/feature-name
```

---

## Commit Changes

```bash
git commit -m "feat: added new feature"
```

---

## Push Changes

```bash
git push origin feature/feature-name
```

---

# 📄 License

This project is licensed under the ISC License.

---

# 👨‍💻 Author

## Deepak Kumar Singh

- GitHub: https://github.com/Deepaksingh73229

---

# ⭐ Project Status

| Module | Status |
|--------|--------|
| Authentication | ✅ Complete |
| RBAC System | ✅ Complete |
| User Management | ✅ Complete |
| Student Module | 🚧 In Progress |
| Hostel Module | 🚧 In Progress |
| Leave Module | 🚧 Planned |
| Complaint Module | 🚧 Planned |

---

# 💬 Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

---

<div align="center">

Built with ❤️ for scalable campus infrastructure

</div>