from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
def test_job():
    return {"message": "Job route working"}
