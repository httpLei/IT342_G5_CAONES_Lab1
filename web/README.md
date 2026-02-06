# BudTrip Web App - Setup Guide

## Prerequisites
- Node.js 18+ and npm
- Backend API running on port 8080

## Installation Steps

### 1. Install Node.js
Download and install from [Node.js Official Website](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

### 2. Install Dependencies
```bash
cd web
npm install
```

### 3. Configure API URL
The API URL is already configured in `vite.config.js` to proxy to `http://localhost:8080`

If you need to change it, edit:
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:YOUR_PORT',
      changeOrigin: true
    }
  }
}
```

Or update the base URL in `src/services/authService.js`:
```javascript
const API_URL = 'http://localhost:8080/api';
```

### 4. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 5. Build for Production
```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure
```
web/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx     # Route protection
│   ├── context/
│   │   └── AuthContext.jsx        # Global auth state
│   ├── pages/
│   │   ├── Register.jsx           # Registration page
│   │   ├── Register.css
│   │   ├── Login.jsx              # Login page
│   │   ├── Dashboard.jsx          # User dashboard
│   │   └── Dashboard.css
│   ├── services/
│   │   └── authService.js         # API service
│   ├── App.jsx                    # Main app component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Features

### Pages
1. **Register Page** (`/register`)
   - User registration form
   - Input validation
   - Error handling

2. **Login Page** (`/login`)
   - User login form
   - JWT token storage
   - Remember user session

3. **Dashboard** (`/dashboard`)
   - Protected route
   - Display user information
   - Logout functionality

### Authentication Flow
1. User registers/logs in
2. JWT token received and stored in localStorage
3. Token sent with all API requests
4. Protected routes check for valid token
5. Logout removes token and redirects to login

## Testing

### Manual Testing
1. **Registration:**
   - Go to http://localhost:3000/register
   - Fill in all fields
   - Click "Register"
   - Should redirect to dashboard

2. **Login:**
   - Go to http://localhost:3000/login
   - Enter credentials
   - Click "Login"
   - Should redirect to dashboard

3. **Protected Route:**
   - Try accessing /dashboard without logging in
   - Should redirect to /login

4. **Logout:**
   - Click "Logout" button
   - Should redirect to /login
   - Token should be removed from localStorage

### Browser Console Debugging
Open browser console (F12) to:
- Check API requests/responses
- View localStorage for token
- See any error messages

## Troubleshooting

### API Connection Issues
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify API URL in `authService.js`

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
Change port in `vite.config.js`:
```javascript
server: {
  port: 3001
}
```

## Styling
- CSS3 with gradient backgrounds
- Responsive design
- Mobile-friendly layout
- Custom form styling

## Technologies Used
- React 18.2.0
- React Router DOM 6.20.0
- Axios for HTTP requests
- Vite for fast builds
- LocalStorage for token persistence
