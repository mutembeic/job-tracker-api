from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: str = None
    daily_target: int = None

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    daily_target: int
    
    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
