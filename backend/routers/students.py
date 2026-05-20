from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models import Student, Course
from schemas import StudentCreate, StudentUpdate, StudentResponse
from auth import get_current_user
from models import User

router = APIRouter(prefix="/api/students", tags=["Students"])


@router.get("/", response_model=List[StudentResponse])
def list_students(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Student).filter(Student.user_id == current_user.id).all()


@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(
    data: StudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(Student).filter(
        Student.student_id == data.student_id,
        Student.user_id == current_user.id,
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student ID already exists",
        )

    student = Student(
        student_id=data.student_id,
        name=data.name,
        class_name=data.class_name,
        email=data.email,
        interests=data.interests or "",
        career_goal=data.career_goal or "",
        user_id=current_user.id,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = db.query(Student).filter(
        Student.id == student_id, Student.user_id == current_user.id
    ).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student


@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int,
    data: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = db.query(Student).filter(
        Student.id == student_id, Student.user_id == current_user.id
    ).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(student, key, value)

    db.commit()
    db.refresh(student)
    return student


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = db.query(Student).filter(
        Student.id == student_id, Student.user_id == current_user.id
    ).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    db.delete(student)
    db.commit()
