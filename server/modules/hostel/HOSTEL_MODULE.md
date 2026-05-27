# 🏠 Hostel Module

## 📘 Overview

The **Hostel Module** manages hostel infrastructure and student accommodation lifecycle within the campus system.

It handles:

- Hostel hierarchy (Hostel → Floor → Room → Bed)
- Room allocation & shifting
- Occupancy tracking
- Role-based access control (RBAC)
- Scalable structure for future integrations (fees, complaints, etc.)

---

## 🧱 Core Architecture

```

Hostel → Floor → Room → Bed → Allocation

````id="arch-flow"

### Why this structure?

- Supports **single & triple rooms**
- Enables **partial occupancy**
- Tracks **bed-level allocation**
- Maintains **allocation history**

---

## 🧩 Data Models

### 🏠 Hostel
- name
- hostelType (`male | female`)
- totalFloors
- capacity
- staff (warden, superintendent)
- isActive

---

### 🏢 Floor
- hostel (ref)
- floorNumber
- name

---

### 🚪 Room
- hostel (ref)
- floor (ref)
- roomNumber
- type (`single | triple`)
- capacity
- occupiedBeds

---

### 🛏️ Bed
- room (ref)
- bedNumber
- isOccupied

---

### 🔄 Room Allocation
- student (ref)
- hostel (ref)
- room (ref)
- bed (ref)
- fromDate
- toDate
- status (`active | completed | cancelled`)

---

## 🔐 RBAC Permissions

All routes are protected by authentication + RBAC.

| Permission        | Description |
|------------------|-------------|
| `hostel.manage`  | Full access to hostel system |

---

## ⚡ API Endpoints

---

### 🏠 Hostel

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/hostels` | Create hostel |
| GET    | `/hostels` | Get all hostels |
| GET    | `/hostels/:id` | Get hostel by ID |
| PATCH  | `/hostels/:id` | Update hostel |
| DELETE | `/hostels/:id` | Soft delete |

---

### 🏢 Floor

| Method | Endpoint |
|--------|---------|
| POST   | `/hostels/floors` |
| PATCH  | `/hostels/floors/:id` |

---

### 🚪 Room

| Method | Endpoint |
|--------|---------|
| POST   | `/hostels/rooms` |
| PATCH  | `/hostels/rooms/:id` |
| GET    | `/hostels/rooms` |

---

### 🛏️ Bed

| Method | Endpoint |
|--------|---------|
| POST   | `/hostels/beds` |

---

### 🔥 Allocation

| Method | Endpoint | Description |
|--------|---------|-------------|
| POST   | `/hostels/allocate` | Allocate room |
| POST   | `/hostels/vacate` | Vacate room |
| POST   | `/hostels/shift` | Shift room |

---

## 🔄 Flow Explanation

---

### 🧾 Room Allocation Flow

``` id="alloc-flow"
Request → Validation → RBAC → Service
        → Fetch student/hostel/room/bed
        → Validate gender
        → Check room capacity
        → Check bed availability
        → Create allocation
        → Update bed + room
        → Response
````

---

### ❌ Vacate Flow

```id="vacate-flow"
Request → RBAC → Service
        → Find active allocation
        → Update allocation (completed)
        → Free bed
        → Decrement room occupancy
```

---

### 🔄 Shift Flow

```id="shift-flow"
Vacate current → Allocate new
```

---

## 🧠 Business Rules

### 🔐 Allocation Rules

* Student gender must match hostel type
* Only one active allocation per student
* Room must have available capacity
* Bed must be unoccupied

---

### ⚠️ Constraints

* Unique room per floor
* Unique bed per room
* One active allocation per student

---

## 🧰 Utilities

### 🔍 Filtering

Supports:

* hostelType
* search (name, address)
* room availability

---

### 📊 Pagination

```js id="pagination"
skip = (page - 1) * limit
```

---

### 🧼 Sanitization

Removes internal fields:

* `__v`

---

## ⚠️ Important Notes

---

### 🔥 Bed-Level Design (CRITICAL)

Rooms do not directly hold students.

Instead:

```id="bed-logic"
Student → Bed → Room
```

---

### ⚠️ Concurrency Risk

Simultaneous allocations may cause:

* double booking
* inconsistent state

👉 Solution (future):

* MongoDB transactions
* atomic updates

---

### ⚠️ Soft Delete

* Hostels are not deleted
* `isActive = false`

---

### ⚠️ Validation

* Zod ensures input correctness
* Business logic handled in service layer

---

## 🚀 Performance Considerations

* Index on:

  * room (floor + roomNumber)
  * bed (room + bedNumber)
  * allocation (student + status)
* Avoid heavy `.populate()` unless required
* Use `.lean()` for read-heavy queries

---

## 🔮 Future Enhancements

* 💰 Hostel fee management
* 📄 Complaint system
* 🏥 Leave & medical tracking
* 👥 Guest entry system
* 📊 Admin dashboard
* 🔔 Notifications
* 🧾 Audit logs
* ⏳ Waitlist system

---

## 🧠 Summary

The Hostel Module provides:

* 🏠 Complete hostel infrastructure management
* 🛏️ Bed-level allocation system
* 🔄 Allocation lifecycle management
* 🔐 Secure RBAC integration
* 🧱 Scalable and extensible architecture

---