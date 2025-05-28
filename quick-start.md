# Quick Start Guide

Since Docker isn't running, here's how to run the application manually:

## 1. Start PostgreSQL

You'll need PostgreSQL running locally. If you have it installed:
```bash
# Create the database
createdb accounting_db
```

Or use Docker when it's available:
```bash
docker run -d \
  --name accounting-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=accounting_db \
  -p 5432:5432 \
  postgres:15-alpine
```

## 2. Start the Backend

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- http://localhost:8000
- API Docs: http://localhost:8000/docs

## 3. Start the Frontend

In a new terminal:
```bash
cd frontend
npm run dev
```

The frontend will be available at:
- http://localhost:5173 (Vite's default port)

## 4. First Steps

1. Visit http://localhost:8000/docs to create a user via the API
2. Use the `/api/auth/register` endpoint to create an admin user
3. Login at http://localhost:5173 with your credentials

## Alternative: Use Docker Compose

When Docker is available, simply run:
```bash
docker-compose up
```