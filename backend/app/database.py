from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
 

from app.models import user, job  

def create_tables():
    Base.metadata.create_all(bind=engine)

create_tables()

if __name__ == "__main__":
    print("Creating database tables...")
    create_tables()
    print("Tables created successfully.")