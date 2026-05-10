````markdown
# 🏛️ BPMCE CampusCore

> A centralized and scalable campus management platform designed to power hostel, academic, student, and administrative systems through a unified API architecture.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/JWT-Authentication-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/RBAC-Authorization-blue?style=for-the-badge" />
</p>

---

# ✨ Vision

CampusCore is built to act as the **single source of truth** for student-related data across the institution.

Instead of isolated systems for:
- Hostel
- Academics
- Sports
- Administration

This platform provides a **centralized backend system** that can be consumed securely by multiple utility applications through APIs.

---

# 🧠 Core Philosophy

- ✅ Centralized Student Data
- ✅ Modular Architecture
- ✅ API-First Development
- ✅ Scalable RBAC System
- ✅ Future-ready Microservice Migration
- ✅ Multi-hostel Support
- ✅ Clean & Maintainable Codebase

---

# 🚀 Key Features

## 🔐 Authentication & Authorization

- JWT-based authentication
- Access & refresh token support
- Secure password hashing using bcrypt
- Session management
- Protected routes

---

## 👥 Role-Based Access Control (RBAC)

### Supported Roles

- Admin
- Superintendent
- Warden
- Student

### Features

- Hierarchical role system
- Permission inheritance
- Dynamic permission resolution
- Hostel-scoped authority
- Resource-level authorization

---

## 🏢 Hostel Management

- Multi-hostel support
- Hostel creation & management
- Floor management
- Room management
- Room allocation
- Occupancy tracking

---

## 🧑‍🎓 Student Management

- Student profile management
- Hostel assignment
- Leave management
- Complaint system
- Student status tracking

---

## 🛠️ Complaint Management

- Raise hostel complaints
- Complaint categories
- Complaint status tracking
- Resolution workflow

---

## 🌙 Leave Management

- Leave application system
- Leave approval/rejection
- Student availability tracking
- Leave history

---

# 🏗️ System Architecture

```text
                    ┌───────────────────┐
                    │   Frontend Apps   │
                    │  Web / Mobile     │
                    └─────────┬─────────┘
                              │
                              ▼
               ┌──────────────────────────┐
               │     CampusCore API       │
               │  Centralized Backend     │
               └─────────┬────────────────┘
                         │
      ┌──────────────────┼──────────────────┐
      │                  │                  │
      ▼                  ▼                  ▼
┌────────────┐    ┌────────────┐    ┌────────────┐
│ Hostel     │    │ Academic   │    │ Student    │
│ Module     │    │ Module     │    │ Module     │
└────────────┘    └────────────┘    └────────────┘
                         │
                         ▼
                ┌────────────────┐
                │    MongoDB     │
                └────────────────┘
````

---

# 🧩 Modular Architecture

The project follows a modular architecture for scalability and maintainability.

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

# 🔐 Role Hierarchy

```text
Admin
 └── Superintendent
       └── Warden
             └── Student
```

---

# 🛠️ Tech Stack

| Technology | Purpose               |
| ---------- | --------------------- |
| Node.js    | Runtime               |
| Express.js | Backend Framework     |
| MongoDB    | Database              |
| Mongoose   | ODM                   |
| JWT        | Authentication        |
| bcryptjs   | Password Hashing      |
| Zod        | Validation            |
| dotenv     | Environment Config    |
| multer     | File Upload           |
| cors       | Cross-Origin Requests |

---

# 📦 Installation

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

Create `.env` file:

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

# 🚀 Running the Server

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

Seed default roles and users:

```bash
npm run seed
```

---

# 👤 Default Seeded Accounts

## Admin

```text
Email: admin@college.com
Password: Admin@123
```

---

## Superintendent

```text
Email: superintendent@college.com
Password: Super@123
```

---

## Student

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

| Method | Endpoint              | Description   |
| ------ | --------------------- | ------------- |
| POST   | `/auth/register`      | Register user |
| POST   | `/auth/login`         | Login         |
| POST   | `/auth/refresh-token` | Refresh token |
| POST   | `/auth/logout`        | Logout        |
| GET    | `/auth/me`            | Current user  |

---

# 🧑‍🎓 Student Endpoints

| Method | Endpoint        |
| ------ | --------------- |
| POST   | `/students`     |
| GET    | `/students`     |
| GET    | `/students/:id` |
| PATCH  | `/students/:id` |
| DELETE | `/students/:id` |

---

# 🏢 Hostel Endpoints

| Method | Endpoint       |
| ------ | -------------- |
| POST   | `/hostels`     |
| GET    | `/hostels`     |
| PATCH  | `/hostels/:id` |
| DELETE | `/hostels/:id` |

---

# 🛏️ Room Endpoints

| Method | Endpoint     |
| ------ | ------------ |
| POST   | `/rooms`     |
| GET    | `/rooms`     |
| PATCH  | `/rooms/:id` |
| DELETE | `/rooms/:id` |

---

# 🌙 Leave Endpoints

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/leave/apply`       |
| GET    | `/leave/student/:id` |
| PATCH  | `/leave/:id/approve` |
| PATCH  | `/leave/:id/reject`  |

---

# 🛠️ Complaint Endpoints

| Method | Endpoint          |
| ------ | ----------------- |
| POST   | `/complaints`     |
| GET    | `/complaints`     |
| PATCH  | `/complaints/:id` |
| DELETE | `/complaints/:id` |

---

# 🔒 Authorization Flow

Every protected request requires:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

# 📁 Example API Response

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

# 🧠 Scalability Strategy

CampusCore is designed so it can evolve into:

* Separate frontend applications
* Dedicated mobile apps
* Independent microservices
* Distributed systems

without major rewrites.

---

# 🔮 Future Scope

## Planned Modules

* Academic Management
* Sports Management
* Achievement Tracking
* Notification System
* Analytics Dashboard
* QR Entry System
* Real-time Activity Logs
* API Rate Limiting
* WebSocket Integration

---

# 🛡️ Security Features

* Password hashing
* JWT authentication
* Refresh token support
* Protected routes
* Permission-based authorization
* Sensitive field protection
* Validation middleware

---

# 🧪 Development Principles

* Clean Architecture
* Modular Development
* Separation of Concerns
* API-first Design
* Reusable Components
* Future Scalability

---

# 🤝 Contributing

## Create Feature Branch

```bash
git checkout -b feature/feature-name
```

---

## Commit Changes

```bash
git commit -m "feat: added new feature"
```

---

## Push Branch

```bash
git push origin feature/feature-name
```

---

# 📄 License

This project is licensed under the ISC License.

---

# 👨‍💻 Author

## Deepak Kumar Singh

* GitHub: [https://github.com/Deepaksingh73229](https://github.com/Deepaksingh73229)

---

# ⭐ Project Status

| Module           | Status         |
| ---------------- | -------------- |
| Authentication   | ✅ Complete     |
| RBAC System      | ✅ Complete     |
| User Management  | ✅ Complete     |
| Student Module   | 🚧 In Progress |
| Hostel Module    | 🚧 In Progress |
| Leave Module     | 🚧 Planned     |
| Complaint Module | 🚧 Planned     |

---

# 💬 Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

---

<p align="center">
  Built with ❤️ for scalable campus infrastructure
</p>
```
