from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, job,user,profile  # these are your route files

app = FastAPI(title="Job Tracker API")

#CORS config
origins = [
    "http://localhost:5176",
    "http://127.0.0.1:5176",
    "https://job-tracker-api-rouge.vercel.app", 
    # add prod domain later if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register your routes
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(job.router, prefix="/jobs", tags=["Jobs"])
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(profile.router, tags=["Profile"])
@app.get("/")
def root():
    return {"message": "Welcome to the Job Tracker API"}
