# BudTrip - User Registration & Authentication System

**IT342 Software Integration and Architecture - Lab 1**

BudTrip is a cross-platform budgeting tool (Web + Mobile) designed to prevent "tracking burnout." By separating expenses into Needs and Wants and applying intelligent filtering to discretionary spending, BudTrip helps users understand their "Cost of Existence" vs. their "Lifestyle Cost."

This repository contains the implementation of the User Registration and Authentication System for BudTrip.

---

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Task Progress](#task-progress)

---

## ✨ Features

### Backend (Spring Boot)
- ✅ User Registration with validation
- ✅ User Login with JWT authentication
- ✅ Password encryption using BCrypt
- ✅ Protected API endpoints
- ✅ MySQL database integration
- ✅ RESTful API design

### Web Application (React)
- ✅ User Registration page
- ✅ User Login page
- ✅ Protected Dashboard/Profile page
- ✅ Logout functionality
- ✅ Responsive design
- ✅ Token-based authentication
- ✅ Error handling and validation

---

## 🛠 Technology Stack

### Backend
- **Java:** 17
- **Framework:** Spring Boot 3.2.0
- **Security:** Spring Security + JWT
- **Database:** MySQL 8.0
- **ORM:** Spring Data JPA / Hibernate
- **Build Tool:** Maven
- **Password Encryption:** BCrypt

### Frontend (Web)
- **Framework:** React 18.2.0
- **Build Tool:** Vite
- **Routing:** React Router DOM 6.20.0
- **HTTP Client:** Axios
- **Styling:** CSS3

---

## 📁 Project Structure

```
BudTrip/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/budtrip/
│   │   │   │   ├── config/           # Security & CORS config
│   │   │   │   ├── controller/       # REST controllers
│   │   │   │   ├── dto/              # Data transfer objects
│   │   │   │   ├── model/            # JPA entities
│   │   │   │   ├── repository/       # Data repositories
│   │   │   │   ├── security/         # JWT & authentication
│   │   │   │   └── service/          # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── web/                        # React web application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/            # Global state management
│   │   │   └── AuthContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/           # API services
│   │   │   └── authService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── mobile/                     # React Native app (Lab 2)
├── docs/                       # Documentation
│   └── FRS_BudTrip.pdf
├── README.md
└── TASK_CHECKLIST.md
```

---

## 📦 Prerequisites

Before running this project, make sure you have:

- **Java JDK 17** or higher
- **Maven 3.6+**
- **MySQL 8.0+**
- **Node.js 18+** and **npm**
- **Git**

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd BudTrip
```

### 2. Database Setup

```sql
-- Create database
CREATE DATABASE budtrip_db;

-- Tables will be automatically created by Hibernate
```

Update database credentials in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/budtrip_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies and build
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Web Application Setup

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

The web app will start on `http://localhost:3000`

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Endpoints

#### 1. User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe"
}
```

#### 2. User Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe"
}
```

#### 3. Get Current User (Protected)
```http
GET /user/me
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "createdAt": "2026-02-06T10:30:00"
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "message": "Username already exists"
}
```

**401 Unauthorized:**
```json
{
  "message": "Invalid username or password"
}
```

---

## 🖼 Screenshots

Screenshots will be added after testing the application.

### Register Page
![Register Page](docs/screenshots/register.png)

### Login Page
![Login Page](docs/screenshots/login.png)

### Dashboard Page
![Dashboard](docs/screenshots/dashboard.png)

---

## 📊 Task Progress

See [TASK_CHECKLIST.md](TASK_CHECKLIST.md) for detailed task tracking.

**Current Progress:** 64% (14/22 tasks completed)

---

## 🔐 Security Features

- **Password Encryption:** All passwords are hashed using BCrypt before storage
- **JWT Authentication:** Secure token-based authentication
- **Token Expiration:** Tokens expire after 24 hours
- **Protected Routes:** Client-side route protection
- **CORS Configuration:** Restricted cross-origin requests

---

## 🧪 Testing

### Manual Testing Steps

1. **Test Registration:**
   - Open http://localhost:3000/register
   - Fill in the registration form
   - Submit and verify redirection to dashboard

2. **Test Login:**
   - Navigate to http://localhost:3000/login
   - Enter valid credentials
   - Verify successful login and token storage

3. **Test Protected Route:**
   - Try accessing /dashboard without logging in
   - Verify redirection to login page

4. **Test Logout:**
   - Click logout button on dashboard
   - Verify redirection to login page
   - Verify token removal from localStorage

---

## 👥 Contributors

- **Developer:** [Your Name]
- **Course:** IT342 - Software Integration and Architecture
- **Institution:** [Your Institution]
- **Session:** Lab 1 - User Registration & Authentication

---

## 📝 License

This project is developed for educational purposes as part of IT342 course requirements.

---

## 📞 Support

For issues or questions, please contact through the course MS Teams channel.

---

**Last Updated:** February 6, 2026