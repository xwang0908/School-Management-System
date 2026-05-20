from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Course, Student, Grade, course_enrollment, course_prerequisites
from schemas import CourseCreate, CourseUpdate, CourseResponse
from auth import get_current_user
from models import User

router = APIRouter(prefix="/api/courses", tags=["Courses"])


@router.get("/", response_model=List[CourseResponse])
def list_courses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Course).filter(Course.user_id == current_user.id).all()


@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(Course).filter(
        Course.code == data.code, Course.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course code already exists",
        )

    course = Course(
        code=data.code,
        name=data.name,
        teacher=data.teacher or "",
        period=data.period or "",
        room=data.room or "",
        term=data.term or "Spring 2026",
        category=data.category or "General",
        difficulty=data.difficulty or "Beginner",
        credits=data.credits or 3,
        description=data.description or "",
        skills=data.skills or "",
        user_id=current_user.id,
    )
    db.add(course)
    db.flush()

    if data.enrolled_student_ids:
        students = db.query(Student).filter(
            Student.id.in_(data.enrolled_student_ids),
            Student.user_id == current_user.id,
        ).all()
        course.enrolled_students = students

    if data.prerequisite_ids:
        prereqs = db.query(Course).filter(
            Course.id.in_(data.prerequisite_ids),
            Course.user_id == current_user.id,
        ).all()
        course.prerequisites = prereqs

    db.commit()
    db.refresh(course)
    return course


@router.get("/{course_id}", response_model=CourseResponse)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    course = db.query(Course).filter(
        Course.id == course_id, Course.user_id == current_user.id
    ).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return course


@router.put("/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: int,
    data: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    course = db.query(Course).filter(
        Course.id == course_id, Course.user_id == current_user.id
    ).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    update_data = data.model_dump(exclude_unset=True)
    enrolled_ids = update_data.pop("enrolled_student_ids", None)
    prereq_ids = update_data.pop("prerequisite_ids", None)

    for key, value in update_data.items():
        setattr(course, key, value)

    if enrolled_ids is not None:
        students = db.query(Student).filter(
            Student.id.in_(enrolled_ids), Student.user_id == current_user.id
        ).all()
        course.enrolled_students = students

    if prereq_ids is not None:
        prereqs = db.query(Course).filter(
            Course.id.in_(prereq_ids), Course.user_id == current_user.id
        ).all()
        course.prerequisites = prereqs

    db.commit()
    db.refresh(course)
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    course = db.query(Course).filter(
        Course.id == course_id, Course.user_id == current_user.id
    ).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    related_grades = db.query(Grade).filter(Grade.course_id == course_id).count()
    if related_grades > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a course that has grade records",
        )

    db.delete(course)
    db.commit()
