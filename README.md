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