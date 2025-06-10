# Node.js Backend API with PostgreSQL

A clean and secure Node.js backend API built with Express.js, Sequelize ORM, and PostgreSQL database with user authentication.

## Features

- 🔐 User Authentication (Register/Login)
- 🗄️ PostgreSQL Database with Sequelize ORM
- 🔒 Password Hashing with bcrypt
- 🎫 JWT Token Authentication
- ✅ Input Validation
- 📝 Clean CRUD Operations
- 🚀 Express.js Framework

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check
- `GET /api/health` - Check server status

## Installation

1. Clone the repository:
```bash
git clone https://github.com/abdirahman-sharmarke/ABDI.git
cd ABDI
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
```

4. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## Example API Usage

### Register User
```json
POST /api/users/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Login User
```json
POST /api/users/login
{
  "email": "john@example.com",
  "password": "Password123"
}
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Project Structure

```
src/
├── config/
│   └── database.js       # Database configuration
├── controllers/
│   └── userController.js # User logic
├── models/
│   ├── index.js         # Models export
│   └── User.js          # User model
├── routes/
│   ├── index.js         # Main routes
│   └── userRoutes.js    # User routes
└── server.js            # Server entry point
```

## License

MIT License 