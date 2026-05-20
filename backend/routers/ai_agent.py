from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from schemas import RecommendationRequest, DashboardInsights
from auth import get_current_user
from models import User
from services.ai_service import generate_course_recommendations, generate_dashboard_insights

router = APIRouter(prefix="/api/ai", tags=["AI Agent"])


@router.post("/recommendations")
def get_recommendations(
    data: RecommendationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from models import Student

    student = db.query(Student).filter(
        Student.id == data.student_id, Student.user_id == current_user.id
    ).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    options = {
        "match_interests": data.match_interests,
        "check_prereqs": data.check_prereqs,
        "use_performance": data.use_performance,
        "balance_workload": data.balance_workload,
    }

    result = generate_course_recommendations(db, data.student_id, options)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result


@router.get("/dashboard-insights", response_model=DashboardInsights)
def get_dashboard_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = generate_dashboard_insights(db, current_user.id)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
