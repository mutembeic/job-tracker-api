from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.auth import get_current_user
from app.models.job import Job
from sqlalchemy import func

router = APIRouter(
    tags=["Profile"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/daily-stats")
def get_daily_job_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    results = (
        db.query(
            func.date(Job.created_at).label('date'),
            func.count(Job.id).label('count')
        )
        .filter(Job.user_id == current_user.id)
        .group_by(func.date(Job.created_at))
        .order_by(func.date(Job.created_at))
        .all()
    )
    return [{"date": str(r.date), "count": r.count} for r in results]




