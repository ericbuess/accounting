#!/bin/bash

# Start PostgreSQL with Docker
echo "Starting PostgreSQL..."
docker run -d \
  --name accounting-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=accounting_db \
  -p 5432:5432 \
  postgres:15-alpine

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Start backend
echo "Starting backend..."
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000 &

# Start frontend
echo "Starting frontend..."
cd ../frontend
npm install
npm run dev