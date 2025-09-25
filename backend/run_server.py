import uvicorn
from app.db.database import SessionLocal
from app.db.init_db import init_db

def init_database():
    """Initialize database with sample data"""
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()

if __name__ == "__main__":
    # Initialize database
    print("Initializing database...")
    init_database()
    
    # Start server
    print("Starting FastAPI server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )