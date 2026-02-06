# API Testing Guide

## Testing with cURL

### 1. Register a New User

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

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTcwNzIzMDQwMCwiZXhwIjoxNzA3MzE2ODAwfQ...",
  "type": "Bearer",
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "fullName": "Test User"
}
```

### 2. Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTcwNzIzMDQwMCwiZXhwIjoxNzA3MzE2ODAwfQ...",
  "type": "Bearer",
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "fullName": "Test User"
}
```

### 3. Get Current User (Protected)

```bash
# Replace YOUR_TOKEN with the actual token from login/register
curl -X GET http://localhost:8080/api/user/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "fullName": "Test User",
  "createdAt": "2026-02-06T10:30:00"
}
```

---

## Testing with Postman

### Import Collection
1. Open Postman
2. Click "Import" button
3. Select `BudTrip_API_Collection.postman_collection.json`
4. Collection will be imported with all endpoints

### Using the Collection

#### 1. Register User
- Method: POST
- URL: `http://localhost:8080/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "username": "postmanuser",
  "email": "postman@example.com",
  "password": "password123",
  "fullName": "Postman User"
}
```
- Click "Send"
- Copy the `token` from response

#### 2. Login User
- Method: POST
- URL: `http://localhost:8080/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "username": "postmanuser",
  "password": "password123"
}
```
- Click "Send"
- Copy the `token` from response

#### 3. Get Current User
- Method: GET
- URL: `http://localhost:8080/api/user/me`
- Headers: 
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- Click "Send"

### Setting Environment Variable (Optional)
1. Create new environment in Postman
2. Add variable: `token`
3. After login, set the token value
4. Use `{{token}}` in Authorization header

---

## Testing with Browser (Chrome DevTools)

### 1. Test Registration via Web UI
1. Open http://localhost:3000/register
2. Fill in the form
3. Open DevTools (F12)
4. Go to "Network" tab
5. Submit form
6. Check the POST request to `/api/auth/register`
7. View response

### 2. Test Token Storage
1. After successful login
2. Open DevTools (F12)
3. Go to "Application" tab
4. Navigate to "Local Storage" → `http://localhost:3000`
5. Should see `token` and `user` keys

### 3. Test Protected Endpoint
1. Copy token from localStorage
2. Go to "Console" tab
3. Run:
```javascript
fetch('http://localhost:8080/api/user/me', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})
.then(r => r.json())
.then(data => console.log(data));
```

---

## Testing with Thunder Client (VS Code)

### Install Extension
1. Open VS Code
2. Go to Extensions
3. Search "Thunder Client"
4. Install

### Create Requests

#### Register
- Method: POST
- URL: `http://localhost:8080/api/auth/register`
- Body (JSON):
```json
{
  "username": "thunderuser",
  "email": "thunder@example.com",
  "password": "password123",
  "fullName": "Thunder User"
}
```

#### Login
- Method: POST
- URL: `http://localhost:8080/api/auth/login`
- Body (JSON):
```json
{
  "username": "thunderuser",
  "password": "password123"
}
```

#### Get User
- Method: GET
- URL: `http://localhost:8080/api/user/me`
- Auth: Bearer Token
- Token: (paste from login response)

---

## Error Testing Scenarios

### 1. Duplicate Username
```bash
# Register first user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "duplicate", "email": "user1@example.com", "password": "pass123"}'

# Try to register with same username
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "duplicate", "email": "user2@example.com", "password": "pass123"}'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Username already exists"
}
```

### 2. Invalid Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "wronguser", "password": "wrongpass"}'
```

**Expected Response (400 Bad Request):**
```json
{
  "message": "Invalid username or password"
}
```

### 3. Access Protected Endpoint Without Token
```bash
curl -X GET http://localhost:8080/api/user/me
```

**Expected Response (403 Forbidden)**

### 4. Access Protected Endpoint With Invalid Token
```bash
curl -X GET http://localhost:8080/api/user/me \
  -H "Authorization: Bearer invalid.token.here"
```

**Expected Response (403 Forbidden)**

---

## Automated Testing Script

Save as `test-api.sh` (Linux/Mac) or `test-api.ps1` (Windows):

### Bash Script (test-api.sh)
```bash
#!/bin/bash

echo "Testing BudTrip API..."
echo ""

# Test Registration
echo "1. Testing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "autotest", "email": "auto@test.com", "password": "password123", "fullName": "Auto Test"}')

echo "Response: $REGISTER_RESPONSE"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo ""

# Test Login
echo "2. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "autotest", "password": "password123"}')

echo "Response: $LOGIN_RESPONSE"
echo ""

# Test Get User
echo "3. Testing Get Current User..."
USER_RESPONSE=$(curl -s -X GET http://localhost:8080/api/user/me \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $USER_RESPONSE"
echo ""

echo "All tests completed!"
```

### PowerShell Script (test-api.ps1)
```powershell
Write-Host "Testing BudTrip API..." -ForegroundColor Cyan
Write-Host ""

# Test Registration
Write-Host "1. Testing Registration..." -ForegroundColor Yellow
$registerBody = @{
    username = "autotest"
    email = "auto@test.com"
    password = "password123"
    fullName = "Auto Test"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $registerBody

Write-Host "Response: $($registerResponse | ConvertTo-Json)"
$token = $registerResponse.token
Write-Host "Token: $token"
Write-Host ""

# Test Login
Write-Host "2. Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    username = "autotest"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

Write-Host "Response: $($loginResponse | ConvertTo-Json)"
Write-Host ""

# Test Get User
Write-Host "3. Testing Get Current User..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $token"
}

$userResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/user/me" `
    -Method Get `
    -Headers $headers

Write-Host "Response: $($userResponse | ConvertTo-Json)"
Write-Host ""

Write-Host "All tests completed!" -ForegroundColor Green
```

---

## Verification Checklist

- [ ] Backend is running on port 8080
- [ ] Can register a new user
- [ ] Receives JWT token after registration
- [ ] Can login with credentials
- [ ] Receives JWT token after login
- [ ] Can access `/api/user/me` with valid token
- [ ] Cannot access `/api/user/me` without token
- [ ] Cannot register duplicate username
- [ ] Cannot register duplicate email
- [ ] Cannot login with wrong password
- [ ] Password is hashed in database
- [ ] Token expires after 24 hours

---

## Database Verification

After testing registration, verify in MySQL:

```sql
USE budtrip_db;

-- Show all users
SELECT 
    id,
    username,
    email,
    LEFT(password, 10) as password_prefix,
    full_name,
    created_at
FROM users;

-- Verify password is hashed (should start with $2a$ or $2b$)
SELECT 
    username,
    password
FROM users
WHERE username = 'testuser';
```

---

## Expected Results Summary

| Test | Expected Result |
|------|----------------|
| Register new user | 200 OK + JWT token |
| Login with correct credentials | 200 OK + JWT token |
| Access `/api/user/me` with token | 200 OK + user data |
| Access `/api/user/me` without token | 403 Forbidden |
| Register duplicate username | 400 Bad Request |
| Login with wrong password | 400 Bad Request |
| Password in database | BCrypt hash (starts with $2a$ or $2b$) |

---

## Troubleshooting

### Issue: Connection refused
**Solution:** Ensure backend is running on port 8080

### Issue: 403 Forbidden on all requests
**Solution:** Check CORS configuration in SecurityConfig.java

### Issue: Token not accepted
**Solution:** Verify token format is "Bearer <token>"

### Issue: Database connection error
**Solution:** Verify MySQL is running and credentials are correct

---

## Next Steps

1. ✅ Test all endpoints manually
2. ✅ Verify database entries
3. ✅ Check password encryption
4. ✅ Test error scenarios
5. ✅ Document results
6. ✅ Capture screenshots for FRS

---

**Testing Complete!** 🎉
