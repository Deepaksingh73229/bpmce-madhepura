# 🔐 Auth Module Documentation

## 📘 Overview

The Auth module handles:

- User registration
- User login
- JWT-based authentication
- Refresh token mechanism
- Logout & session invalidation
- Current user retrieval
- Role-based access integration (RBAC-ready)

It follows a **layered architecture**:

```

Route → Validator → Controller → Service → Repository → Database

```

---

## 🧱 Architecture Breakdown

### 1. Routes
Defines API endpoints and attaches:
- validation middleware
- authentication middleware
- controller methods

---

### 2. Validator (Zod)
- Validates incoming request data
- Sanitizes input (trim, lowercase)
- Prevents invalid data from reaching business logic

---

### 3. Controller
- Handles HTTP request/response
- Calls service layer
- Formats API response

---

### 4. Service
- Core business logic
- Token generation
- Authentication flow
- Error handling

---

### 5. Repository
- Direct database interaction
- Mongoose queries
- Data fetching & persistence

---

### 6. Utils
- JWT handling
- User sanitization

---

### 7. Middleware
- Auth middleware (JWT verification)
- Error handling middleware

---

## 🔄 Complete Auth Flow

### 🧾 1. Registration Flow

```

Client → POST /register
↓
Validator (Zod)
↓
Controller.register()
↓
Service.register()
↓
Repository:

* Check existing user
* Fetch roles
* Create user
  ↓
  Service:
* Generate accessToken
* Generate refreshToken
  ↓
  Repository:
* Save refreshToken
  ↓
  Response → User + Tokens

```

---

### 🔑 2. Login Flow

```

Client → POST /login
↓
Validator
↓
Controller.login()
↓
Service.login()
↓
Repository:

* Find user (+password)
  ↓
  Service:
* Compare password (bcrypt)
* Generate tokens
  ↓
  Repository:
* Update refreshToken
  ↓
  Response → User + Tokens

```

---

### 🔁 3. Refresh Token Flow

```

Client → POST /refresh-token
↓
Validator
↓
Controller.refreshToken()
↓
Service:

* Verify refresh token (JWT)
  ↓
  Repository:
* Find user by refreshToken
  ↓
  Service:
* Generate new tokens
  ↓
  Repository:
* Update refreshToken
  ↓
  Response → New Tokens

```

---

### 🚪 4. Logout Flow

```

Client → POST /logout
↓
Auth Middleware (JWT verify)
↓
Controller.logout()
↓
Service:

* Clear refreshToken in DB
  ↓
  Response → Success

```

---

### 👤 5. Get Current User

```

Client → GET /me
↓
Auth Middleware
↓
Controller.getCurrentUser()
↓
Service:

* Fetch user by ID
  ↓
  Response → User data

````

---

## 📦 JSDoc Type Definitions

```js
/**
 * @typedef {Object} LoginDTO
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterDTO
 * @property {string} name
 * @property {string} email
 * @property {string} [phone]
 * @property {string} password
 * @property {string[]} roles
 */

/**
 * @typedef {Object} TokenPayload
 * @property {string} userId
 * @property {string} email
 */

/**
 * @typedef {Object} RefreshTokenDTO
 * @property {string} refreshToken
 */

/**
 * @typedef {Object} AuthResponse
 * @property {Object} user
 * @property {string} user.id
 * @property {string} user.name
 * @property {string} user.email
 * @property {Array} user.roles
 * @property {string} accessToken
 * @property {string} refreshToken
 */
````

---

## 🧠 AuthService JSDoc

```js
/**
 * AuthService handles all authentication-related business logic.
 *
 * Flow Summary:
 *
 * 1. Registration:
 *    - Checks if user exists
 *    - Validates roles
 *    - Creates user
 *    - Generates access & refresh tokens
 *    - Stores refresh token in DB
 *
 * 2. Login:
 *    - Fetches user with password
 *    - Verifies password using bcrypt
 *    - Generates tokens
 *    - Updates refresh token in DB
 *
 * 3. Refresh Token:
 *    - Verifies refresh token (JWT)
 *    - Finds user by refresh token
 *    - Generates new tokens
 *    - Updates refresh token
 *
 * 4. Logout:
 *    - Clears refresh token from DB
 *
 * 5. Get Current User:
 *    - Fetches user by ID
 *    - Returns sanitized user data
 *
 * Security Notes:
 * - Password is hashed using bcrypt
 * - Access token is short-lived
 * - Refresh token is stored in DB
 * - Sensitive fields are removed via sanitizeUser()
 */
```

---

## 🔐 Security Features

* ✅ Password hashing (bcrypt)
* ✅ JWT authentication
* ✅ Refresh token rotation
* ✅ Protected routes via middleware
* ⚠️ Recommended: Hash refresh tokens in DB

---

## ⚡ API Endpoints

| Method | Endpoint       | Description      | Auth Required |
| ------ | -------------- | ---------------- | ------------- |
| POST   | /register      | Register user    | ❌             |
| POST   | /login         | Login user       | ❌             |
| POST   | /refresh-token | Refresh tokens   | ❌             |
| POST   | /logout        | Logout user      | ✅             |
| GET    | /me            | Get current user | ✅             |

---

## 🚀 Summary

This module provides:

* 🔐 Secure authentication system
* 🔄 Token-based session handling
* 🧱 Clean layered architecture
* 🔑 RBAC-ready foundation

It is designed to be scalable, maintainable, and production-ready.