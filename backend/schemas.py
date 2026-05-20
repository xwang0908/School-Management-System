from pydantic import BaseModel
from typing import Optional, List


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True


class StudentBase(BaseModel):
    student_id: str
    name: str
    class_name: str
    email: Optional[str] = None
    interests: Optional[str] = ""
    career_goal: Optional[str] = ""


class StudentCreate(StudentBase):
    pass


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    class_name: Optional[str] = None
    email: Optional[str] = None
    interests: Optional[str] = None
    career_goal: Optional[str] = None


class StudentResponse(StudentBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class CourseBase(BaseModel):
    code: str
    name: str
    teacher: Optional[str] = None
    period: Optional[str] = None
    room: Optional[str] = None
    term: Optional[str] = "Spring 2026"
    category: Optional[str] = "General"
    difficulty: Optional[str] = "Beginner"
    credits: Optional[int] = 3
    description: Optional[str] = ""
    skills: Optional[str] = ""
    enrolled_student_ids: Optional[List[int]] = []
    prerequisite_ids: Optional[List[int]] = []


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    name: Optional[str] = None
    teacher: Optional[str] = None
    period: Optional[str] = None
    room: Optional[str] = None
    term: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[str] = None
    credits: Optional[int] = None
    description: Optional[str] = None
    skills: Optional[str] = None
    enrolled_student_ids: Optional[List[int]] = None
    prerequisite_ids: Optional[List[int]] = None


class CourseResponse(CourseBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class GradeBase(BaseModel):
    subject: str
    type: str
    score: float
    date: str
    student_id: int
    course_id: int


class GradeCreate(GradeBase):
    pass


class GradeUpdate(BaseModel):
    subject: Optional[str] = None
    type: Optional[str] = None
    score: Optional[float] = None
    date: Optional[str] = None
    student_id: Optional[int] = None
    course_id: Optional[int] = None


class GradeResponse(GradeBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class RecommendationRequest(BaseModel):
    student_id: int
    match_interests: bool = True
    check_prereqs: bool = True
    use_performance: bool = True
    balance_workload: bool = True


class RecommendationResponse(BaseModel):
    course_id: int
    course_name: str
    course_code: str
    score: int
    reasons: List[str]


class DashboardInsights(BaseModel):
    summary: str
    alerts: List[dict]
    trends: List[dict]
    predictions: List[dict]
