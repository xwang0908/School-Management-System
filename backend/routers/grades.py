from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Grade, Student, Course
from schemas import GradeCreate, GradeUpdate, GradeResponse
from auth import get_current_user
from models import User

router = APIRouter(prefix="/api/grades", tags=["Grades"])


@router.get("/", response_model=List[GradeResponse])
def list_grades(
    student_id: Optional[int] = None,
    course_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Grade).filter(Grade.user_id == current_user.id)
    if student_id:
        query = query.filter(Grade.student_id == student_id)
    if course_id:
        query = query.filter(Grade.course_id == course_id)
    return query.all()


@router.post("/", response_model=GradeResponse, status_code=status.HTTP_201_CREATED)
def create_grade(
    data: GradeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = db.query(Student).filter(
        Student.id == data.student_id, Student.user_id == current_user.id
    ).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    course = db.query(Course).filter(
        Course.id == data.course_id, Course.user_id == current_user.id
    ).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    grade = Grade(
        subject=data.subject,
        type=data.type,
        score=data.score,
        date=data.date,
        student_id=data.student_id,
        course_id=data.course_id,
        user_id=current_user.id,
    )
    db.add(grade)

    if student not in course.enrolled_students:
        course.enrolled_students.append(student)

    db.commit()
    db.refresh(grade)
    return grade


@router.get("/{grade_id}", response_model=GradeResponse)
def get_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    grade = db.query(Grade).filter(
        Grade.id == grade_id, Grade.user_id == current_user.id
    ).first()
    if not grade:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grade not found")
    return grade


@router.put("/{grade_id}", response_model=GradeResponse)
def update_grade(
    grade_id: int,
    data: GradeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    grade = db.query(Grade).filter(
        Grade.id == grade_id, Grade.user_id == current_user.id
    ).first()
    if not grade:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grade not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(grade, key, value)

    db.commit()
    db.refresh(grade)
    return grade


@router.delete("/{grade_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    grade = db.query(Grade).filter(
        Grade.id == grade_id, Grade.user_id == current_user.id
    ).first()
    if not grade:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grade not found")

    db.delete(grade)
    db.commit()
