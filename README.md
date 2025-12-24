# REST API Project

REST API с Express.js, SQLite и JWT Authentication.

## Характеристики

- ✅ Express.js сървър
- ✅ SQLite база данни
- ✅ JWT Authentication
- ✅ Bcrypt password hashing
- ✅ Protected API endpoints
- ✅ CORS enabled
- ✅ Postman collection

## Инсталация

```bash
npm install
```

## Конфигурация

Копирай `.env.example` като `.env`:

```bash
cp .env.example .env
```

Или създай `.env` файл ръчно в root директорията:

```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=3000
```

**Важно:**
- `.env` файлът не е включен в Git repository (добавен в .gitignore)
- Промени `JWT_SECRET` със собствен random string за production
- `.env.example` файлът служи като template

## Стартиране

```bash
npm start
```

Сървърът ще стартира на `http://localhost:3000`

## API Endpoints

### Authentication Endpoints (Public)

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Ivan Petrov",
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Ivan Petrov",
    "email": "ivan@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Ivan Petrov",
    "email": "ivan@example.com"
  }
}
```

### User Endpoints (Protected - Require JWT Token)

Всички user endpoints изискват JWT token в Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get All Users
```http
GET /api/users
Authorization: Bearer <token>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Ivan Georgiev",
  "email": "ivan.georgiev@example.com"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

## Примери със cURL

### Регистрация
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ivan Petrov","email":"ivan@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ivan@example.com","password":"password123"}'
```

### Get All Users (с token)
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Postman Collection

В проекта е включена Postman колекция: `REST-API.postman_collection.json`

### Импортиране в Postman:
1. Отвори Postman
2. Кликни **Import**
3. Избери файла `REST-API.postman_collection.json`
4. Колекцията автоматично управлява JWT токените

### Как работи:
- Когато направиш **Register** или **Login**, токенът се запазва автоматично
- Всички protected endpoints автоматично използват запазения токен
- Не е нужно ръчно да копираш/поставяш токена

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Security

- Паролите се хешират с **bcryptjs** (10 salt rounds)
- JWT токените са валидни **24 часа**
- Password validation: минимум **6 символа**
- Email uniqueness проверка

## Tech Stack

- **Express.js** - Web framework
- **better-sqlite3** - SQLite database
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **cors** - CORS middleware
- **dotenv** - Environment variables

## Project Structure

```
rest-api-project/
├── middleware/
│   └── authMiddleware.js    # JWT verification middleware
├── database.js              # Database setup
├── server.js                # Express server & routes
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .env                     # Environment variables (not in Git)
├── .gitignore              # Git ignore rules
└── REST-API.postman_collection.json  # Postman collection
```

## License

ISC
