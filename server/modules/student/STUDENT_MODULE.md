# 🎓 Student Module

## 📘 Overview

The **Student Module** manages all student-related operations in the system. It is designed to handle student identity, academic details, and future extensibility for hostel, sports, and other modules.

### Features

- ➕ Create student
- 📄 Retrieve students (paginated)
- 👤 Get student by ID
- ✏️ Update student details
- ❌ Soft delete (deactivate student)
- 📊 Advanced filtering & search
- 🧩 Full profile aggregation (extensible)

---

## 🧱 Architecture

```

Route → Middleware → Validator → Controller → Service → Repository → Database

````

### Layer Responsibilities

| Layer        | Responsibility |
|-------------|----------------|
| Routes       | API endpoints + middleware chaining |
| Middleware   | Auth, RBAC, error handling |
| Validator    | Input validation (Zod) |
| Controller   | Request/response handling |
| Service      | Business logic |
| Repository   | Database operations |
| Utils        | Filters, pagination, sanitization |

---

## 🔐 Security

- All routes are protected via **JWT authentication**
- RBAC-based permission checks:
  - `student.create`
  - `student.read`
  - `student.update`
  - `student.delete`
- Input validation using **Zod**
- Soft delete prevents data loss

---

## ⚡ API Endpoints

---

### ➕ Create Student

```http
POST /students
````

**Permission:** `student.create`

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "rollNumber": "CSE123",
  "registrationNumber": "REG2024001",
  "course": "B.Tech",
  "branch": "CSE",
  "batchYear": 2024
}
```

---

### 📄 Get All Students (Paginated)

```http
GET /students
```

**Permission:** `student.read`

**Query Params:**

| Param     | Type    | Description                                      |
| --------- | ------- | ------------------------------------------------ |
| page      | number  | Page number                                      |
| limit     | number  | Items per page                                   |
| search    | string  | Search by name, roll number, registration number |
| course    | string  | Filter by course                                 |
| branch    | string  | Filter by branch                                 |
| batchYear | number  | Filter by batch                                  |
| isActive  | boolean | Active/inactive filter                           |

---

### 👤 Get Student by ID

```http
GET /students/:id
```

**Permission:** `student.read`

---

### ✏️ Update Student

```http
PATCH /students/:id
```

**Permission:** `student.update`

---

### ❌ Soft Delete Student

```http
DELETE /students/:id
```

**Permission:** `student.delete`

---

### 🧩 Get Full Profile

```http
GET /students/:id/full-profile
```

**Permission:** `student.read`

**Response Structure:**

```json
{
  "student": {},
  "academic": null,
  "hostel": null,
  "sports": null
}
```

---

## 🔄 Flow Explanation

---

### 🧾 Create Student Flow

```
Request → Validation → RBAC → Controller
        → Service (check uniqueness)
        → Repository (create)
        → Response
```

---

### 🔍 Get Students Flow

```
Request → Validation → RBAC → Service
        → Build filters
        → Apply pagination
        → Fetch students
        → Response
```

---

### ✏️ Update Student Flow

```
Request → Validation → RBAC → Service
        → Check existence
        → Check uniqueness (email)
        → Update record
        → Response
```

---

### ❌ Soft Delete Flow

```
Request → RBAC → Service
        → Check existence
        → Check active status
        → Set isActive = false
        → Response
```

---

### 🧩 Full Profile Flow

```
Request → RBAC → Service
        → Fetch student
        → Attach additional modules (future)
        → Response
```

---

## 🧰 Utilities

### 🔍 Filter Builder

Supports:

* Active/inactive filtering
* Course, branch, batch filtering
* Search across:

  * name
  * rollNumber
  * registrationNumber

---

### 📊 Pagination

```js
skip = (page - 1) * limit
```

---

### 🧼 Data Sanitization

Removes internal fields:

* `__v`

---

## ⚠️ Important Notes

### 🔥 Unique Constraints

The following must be unique:

* email
* rollNumber
* registrationNumber

Handled in:

* Service layer (validation)
* Database schema (recommended)

---

### ⚠️ Route Order

```
/:id/full-profile MUST come before /:id
```

---

### ⚠️ ID Validation

Invalid Mongo IDs should be handled to avoid database errors.

---

### ⚠️ Regex Search

Search uses `$regex`:

* Good for small-medium datasets
* May slow down large datasets

---

## 🚀 Performance Considerations

* Use indexes on:

  * email
  * rollNumber
  * registrationNumber
* Regex queries may degrade performance at scale
* Pagination prevents large data loads

---

## 🔮 Future Enhancements

* 🏠 Hostel integration (room allocation)
* 📚 Academic module integration
* 🏃 Sports module integration
* 📊 Analytics dashboard
* 🔍 Full-text search optimization
* 🧪 Automated testing
* 📤 Bulk student upload

---

## 🧠 Summary

The Student Module provides:

* 🎓 Structured student management
* 🔍 Advanced filtering & search
* 🔐 Secure RBAC integration
* 🧱 Scalable architecture
* 🧩 Extensible profile system

---