# 👥 User Module

## 📘 Overview

The **User Module** manages user-related operations including:

- User creation
- User retrieval (single & paginated)
- User update
- User deactivation (soft delete)
- Role assignment
- Bulk user creation via CSV upload
- Advanced filtering & search

This module is fully integrated with:

- 🔐 Authentication (JWT)
- 🔑 Role-Based Access Control (RBAC)
- ✅ Validation (Zod)
- 🧱 Layered Architecture

---

## 🧱 Architecture

```

Route → Middleware → Validator → Controller → Service → Repository → Database

````

### Layers

| Layer        | Responsibility |
|-------------|----------------|
| Routes       | API endpoints & middleware chaining |
| Middleware   | Auth, RBAC, error handling |
| Validator    | Input validation & sanitization |
| Controller   | Request/response handling |
| Service      | Business logic |
| Repository   | Database interaction |
| Utils        | Filters, pagination, CSV parsing |

---

## 🔐 Security Features

- JWT-based authentication (required for all routes)
- RBAC permission checks
- Password hashing (handled in model)
- Sensitive fields removed before response
- Input validation using Zod

---

## ⚡ API Endpoints

### 🔒 All routes require authentication

---

### ➕ Create User

```http
POST /users
````

**Permission:** `user.create`

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "roles": ["admin"]
}
```

---

### 📄 Get All Users (Paginated)

```http
GET /users
```

**Permission:** `user.read`

**Query Params:**

| Param    | Type    | Description          |
| -------- | ------- | -------------------- |
| page     | number  | Page number          |
| limit    | number  | Items per page       |
| search   | string  | Search by name/email |
| role     | string  | Filter by role       |
| isActive | boolean | Filter active users  |

---

### 👤 Get User by ID

```http
GET /users/:id
```

**Permission:** `user.read`

---

### ✏️ Update User

```http
PATCH /users/:id
```

**Permission:** `user.update`

---

### ❌ Deactivate User (Soft Delete)

```http
DELETE /users/:id
```

**Permission:** `user.delete`

---

### 🔑 Assign Roles

```http
POST /users/:id/roles
```

**Permission:** `user.update`

**Body:**

```json
{
  "roles": ["admin", "staff"]
}
```

---

### 📄 Bulk Upload Users (CSV)

```http
POST /users/bulk-upload
```

**Permission:** `user.create`

**Form Data:**

```
file: users.csv
```

---

## 🔄 Flow Explanation

### 🧾 Create User Flow

```
Request → Validation → RBAC → Controller → Service
        → Check email → Validate roles → Create user → Response
```

---

### 🔍 Get Users Flow

```
Request → Validation → RBAC → Service
        → Build filters → Apply pagination → Fetch users → Response
```

---

### 🔁 Bulk Upload Flow

```
CSV Upload → Parse CSV → Validate rows
           → Check duplicates → Validate roles
           → Bulk insert → Return result (success + errors)
```

---

## 🧰 Utilities

### 🔍 Filter Builder

Supports:

* search (name/email)
* role filtering
* active/inactive users

---

### 📊 Pagination

```js
skip = (page - 1) * limit
```

---

### 📄 CSV Parser

* Converts file buffer → JSON rows
* Validates each row
* Returns structured result:

  * success count
  * failed count
  * error details

---

## 📦 Example CSV Format

```csv
name,email,password,phone,roles
John Doe,john@example.com,123456,9876543210,admin
Jane Doe,jane@example.com,123456,,staff
```

---

## ⚠️ Important Notes

### 🔥 Password Hashing in Bulk Upload

* `insertMany()` does NOT trigger Mongoose hooks
* Passwords must be hashed manually before insert

---

### ⚠️ File Upload Limits

* Uses `multer.memoryStorage()`
* Recommended max size: **5MB**

---

### ⚠️ Validation

* All inputs validated via Zod
* Query params are sanitized (numbers, booleans)

---

### ⚠️ RBAC

* Permissions are required for every route
* Example:

  ```js
  rbacMiddleware(['user.create'])
  ```

---

## 🚀 Performance Considerations

* Regex search can be slow for large datasets
* CSV parsing loads file into memory
* Bulk operations are not transactional (can be improved)

---

## 🔮 Future Improvements

* 🔐 Hash refresh tokens
* 📦 Add MongoDB transactions for bulk operations
* ⚡ Optimize search using indexes
* 📊 Add audit logs
* 🧪 Add automated tests
* 📤 Support Excel uploads

---

## 🧠 Summary

This module provides:

* 👥 Complete user management system
* 🔑 Permission-based RBAC integration
* 📄 Bulk import functionality
* 🔍 Advanced filtering & pagination
* 🧱 Clean and scalable architecture

---