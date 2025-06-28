from fastapi import FastAPI
from app.routes import auth, job,user  # these are your route files

app = FastAPI(title="Job Tracker API")

# Register your routes
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(job.router, prefix="/jobs", tags=["Jobs"])
app.include_router(user.router, prefix="/users", tags=["Users"])

@app.get("/")
def root():
    return {"message": "Welcome to the Job Tracker API"}
