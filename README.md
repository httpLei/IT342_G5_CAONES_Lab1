# WorthIt - User Registration & Authentication System

**IT342 Software Integration and Architecture - Lab 1**

WorthIt is a cross-platform budgeting tool (Web + Mobile) designed to prevent "tracking burnout." By separating expenses into Needs and Wants and applying intelligent filtering to discretionary spending, WorthIt helps users understand their "Cost of Existence" vs. their "Lifestyle Cost."

This repository contains the implementation of the User Registration and Authentication System for WorthIt.

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
WorthIt/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/worthit/
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
│   └── FRS_WorthIt.pdf
├── README.md
└── TASK_CHECKLIST.md
```
