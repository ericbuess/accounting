# Accounting Software MVP

A modern double-entry accounting system built with FastAPI and React.

## Features

- ✅ User authentication with JWT
- ✅ Multi-company support
- ✅ Chart of accounts management
- ✅ Journal entry system with validation
- ✅ Financial reports (Balance Sheet, Income Statement, Trial Balance)
- ✅ Role-based access control

## Tech Stack

**Backend:**
- Python 3.11+ with FastAPI
- PostgreSQL database
- SQLAlchemy ORM
- JWT authentication

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- React Query for data fetching
- React Router for navigation

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/ericbuess/accounting.git
cd accounting
```

2. Copy environment file:
```bash
cp backend/.env.example backend/.env
```

3. Start the application:
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Manual Setup

#### Backend

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up PostgreSQL and update `.env` file

4. Run the backend:
```bash
uvicorn app.main:app --reload
```

#### Frontend

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Default Login

For development, you can register a new user through the API at `/api/auth/register` or use the registration endpoint.

## API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation.

## Development

- Backend code is in the `/backend` directory
- Frontend code is in the `/frontend` directory
- Database migrations can be managed with Alembic
- Hot reloading is enabled for both frontend and backend

## License

MIT