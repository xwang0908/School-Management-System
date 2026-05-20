from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, Table
from sqlalchemy.orm import relationship

from database import Base

course_enrollment = Table(
    "course_enrollment",
    Base.metadata,
    Column("course_id", Integer, ForeignKey("courses.id"), primary_key=True),
    Column("student_id", Integer, ForeignKey("students.id"), primary_key=True),
)

course_prerequisites = Table(
    "course_prerequisites",
    Base.metadata,
    Column("course_id", Integer, ForeignKey("courses.id"), primary_key=True),
    Column("prerequisite_id", Integer, ForeignKey("courses.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))

    students = relationship("Student", back_populates="user", cascade="all, delete-orphan")
    courses = relationship("Course", back_populates="user", cascade="all, delete-orphan")
    grades = relationship("Grade", back_populates="user", cascade="all, delete-orphan")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    class_name = Column(String(50), nullable=False)
    email = Column(String(100))
    interests = Column(Text, default="")
    career_goal = Column(String(100), default="")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="students")
    courses = relationship("Course", secondary=course_enrollment, back_populates="enrolled_students")
    grades = relationship("Grade", back_populates="student", cascade="all, delete-orphan")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), nullable=False)
    name = Column(String(100), nullable=False)
    teacher = Column(String(100))
    period = Column(String(50))
    room = Column(String(50))
    term = Column(String(50), default="Spring 2026")
    category = Column(String(50), default="General")
    difficulty = Column(String(20), default="Beginner")
    credits = Column(Integer, default=3)
    description = Column(Text, default="")
    skills = Column(Text, default="")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="courses")
    enrolled_students = relationship("Student", secondary=course_enrollment, back_populates="courses")
    prerequisites = relationship(
        "Course",
        secondary=course_prerequisites,
        primaryjoin=id == course_prerequisites.c.course_id,
        secondaryjoin=id == course_prerequisites.c.prerequisite_id,
        backref="required_for",
    )
    grades = relationship("Grade", back_populates="course", cascade="all, delete-orphan")


class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)
    score = Column(Float, nullable=False)
    date = Column(String(20), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="grades")
    student = relationship("Student", back_populates="grades")
    course = relationship("Course", back_populates="grades")
