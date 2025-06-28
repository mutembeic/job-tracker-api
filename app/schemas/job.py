from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    description: Optional[str] = None
    link: Optional[str] = None
    status: Optional[str] = "applied"
    is_remote: Optional[bool] = False
    is_active: Optional[bool] = True

class JobResponse(JobCreate):
    id: int
    user_id: int

    class Config:
        orm_mode = True
