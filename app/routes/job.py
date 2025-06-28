from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal
from app.models import job as job_model
from app.auth import get_current_user
from app.models.user import User
from app.schemas import job as job_schema

router = APIRouter()


#{initial testing
# @router.get("/test")
# def test_job():
#     return {"message": "Job route working"}

# @router.get("/protected")
# def protected_route(current_user: User = Depends(get_current_user)):
#     return {"message": f"Welcome, {current_user.full_name}!"}
#}

#DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#create a job
@router.post('/', response_model=job_schema.JobResponse)
def create_job(
    job: job_schema.JobCreate,
    db: Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    new_job = job_model.Job(**job.dict(), user_id=current_user.id)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job


#list my jobs
@router.get('/', response_model=List[job_schema.JobResponse])
def get_my_job(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int= 0,
    limit: int = 10,
    search: str ="",
    status: str=""
):
    query = db.query(job_model.Job).filter(
        job_model.Job.user_id == current_user.id,
        job_model.Job.is_deleted == False
    )

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(job_model.Job.title.ilike(search_pattern))

    if status:
        query = query.filter(job_model.Job.status == status)

    jobs = db.query(job_model.Job).filter(job_model.Job.user_id == current_user.id).all()
    return jobs

#get single job by id
@router.get('/{job_id}', response_model=job_schema.JobResponse)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(job_model.Job).filter(
        job_model.Job.id == job_id,
        job_model.Job.user_id == current_user.id
    ).first()
    if not job:
        raise HTTPException(status_code=404, details="Job not found")
    return job

#update job
@router.put('/{job_id}', response_model=job_schema.JobResponse)
def update_job(
    job_id: int,
    updated_job: job_schema.JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(job_model.Job).filter(
        job_model.Job.id == job_id,
        job_model.Job.user_id == current_user.id
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    for key, value in updated_job.dict().items():
        setattr(job, key, value)
    db.commit()
    db.refresh(job)
    return job

#Delete Job)
@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(job_model.Job).filter(
        job_model.Job.id == job_id,
        job_model.Job.user_id == current_user.id
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail= "Job not found")
    job.is_deleted = True
    db.commit()
    return {"detail": "Job soft-deleted"}