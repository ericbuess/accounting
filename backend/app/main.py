from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base

# Import models to register them with SQLAlchemy
from .models import user, company, account, journal

# Import API routers
from .api import auth as auth_api
from .api import companies as companies_api
from .api import accounts as accounts_api
from .api import journal as journal_api
from .api import reports as reports_api

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Accounting Software API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_api.router, prefix="/api/auth", tags=["auth"])
app.include_router(companies_api.router, prefix="/api/companies", tags=["companies"])
app.include_router(accounts_api.router, prefix="/api/accounts", tags=["accounts"])
app.include_router(journal_api.router, prefix="/api/journal", tags=["journal"])
app.include_router(reports_api.router, prefix="/api/reports", tags=["reports"])

@app.get("/")
def read_root():
    return {"message": "Accounting Software API"}

@app.get("/api")
def read_api_root():
    return {"message": "Accounting Software API", "version": "1.0.0"}