# WorthIt Backend - Setup Guide

## Prerequisites
- Java JDK 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Installation Steps

### 1. Install Java JDK 17
Download and install from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)

Verify installation:
```bash
java -version
```

### 2. Install Maven
Download from [Apache Maven](https://maven.apache.org/download.cgi)

Verify installation:
```bash
mvn -version
```

### 3. Install MySQL
Download and install from [MySQL](https://dev.mysql.com/downloads/mysql/)

### 4. Create Database
```sql
CREATE DATABASE worthit_db;
```

### 5. Configure Application
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/worthit_db?createDatabaseIfNotExist=true
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 6. Build & Run
```bash
# Install dependencies
mvn clean install

# Run application
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

## Testing the API

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:8080/api/user/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import the API endpoints
2. Set `Content-Type: application/json`
3. For protected endpoints, add `Authorization: Bearer <token>` header

## Troubleshooting

### Port Already in Use
Change the port in `application.properties`:
```properties
server.port=8081
```

### Database Connection Error
- Verify MySQL is running
- Check username and password
- Ensure database exists

### Build Errors
```bash
# Clean and rebuild
mvn clean
mvn install -U
```

## Project Structure
```
backend/
├── src/main/java/com/worthit/
│   ├── WorthItApplication.java    # Main application
│   ├── config/
│   │   └── SecurityConfig.java    # Security configuration
│   ├── controller/
│   │   ├── AuthController.java    # Auth endpoints
│   │   └── UserController.java    # User endpoints
│   ├── dto/                       # Data transfer objects
│   ├── model/
│   │   └── User.java              # User entity
│   ├── repository/
│   │   └── UserRepository.java    # Data access layer
│   ├── security/
│   │   ├── JwtUtils.java          # JWT utilities
│   │   ├── JwtAuthenticationFilter.java
│   │   └── UserDetailsServiceImpl.java
│   └── service/
│       └── AuthService.java       # Business logic
└── src/main/resources/
    └── application.properties     # Configuration
```
