# Accounting Software - Running Instructions

## Services are now running!

### Backend API
- URL: http://localhost:8001
- API Documentation: http://localhost:8001/docs
- Database: SQLite (accounting.db)

### Frontend Application
- URL: http://localhost:5173
- Framework: React with TypeScript

## Quick Start

1. **Create an Admin User**
   - Go to http://localhost:8001/docs
   - Navigate to `/api/auth/register` endpoint
   - Click "Try it out"
   - Use this request body:
   ```json
   {
     "email": "admin@example.com",
     "password": "yourpassword",
     "full_name": "Admin User",
     "role": "admin"
   }
   ```
   - Click "Execute"

2. **Login to the Application**
   - Go to http://localhost:3000
   - Login with the email and password you just created

3. **Create Your First Company**
   - After logging in, go to Companies
   - Add a new company
   - Then you can start adding accounts and journal entries

## To Stop the Services

1. Stop the frontend: Press Ctrl+C in the frontend terminal
2. Stop the backend: `pkill -f "uvicorn app.main:app"`

## To Restart

Backend:
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8001
```

Frontend:
```bash
cd frontend
npm run dev
```

## Using Docker (when available)

Simply run:
```bash
docker-compose up
```