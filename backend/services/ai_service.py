import json

from openai import OpenAI
from sqlalchemy.orm import Session

from config import settings
from models import Student, Course, Grade


def get_openai_client():
    return OpenAI(api_key=settings.openai_api_key)


def get_student_context(db: Session, student: Student):
    student_grades = db.query(Grade).filter(Grade.student_id == student.id).all()
    enrolled_courses = student.courses

    course_avgs = {}
    for grade in student_grades:
        course = db.query(Course).filter(Course.id == grade.course_id).first()
        if course:
            cat = course.category or "General"
            if cat not in course_avgs:
                course_avgs[cat] = []
            course_avgs[cat].append(grade.score)

    strength_areas = []
    for cat, scores in course_avgs.items():
        strength_areas.append({
            "category": cat,
            "average": round(sum(scores) / len(scores)),
        })
    strength_areas.sort(key=lambda x: x["average"], reverse=True)

    overall_avg = round(sum(g.score for g in student_grades) / len(student_grades)) if student_grades else 0

    return {
        "name": student.name,
        "student_id": student.student_id,
        "class": student.class_name,
        "interests": student.interests.split(",") if student.interests else [],
        "career_goal": student.career_goal,
        "overall_average": overall_avg,
        "strength_areas": strength_areas,
        "enrolled_courses": [
            {"name": c.name, "code": c.code, "category": c.category, "difficulty": c.difficulty, "credits": c.credits}
            for c in enrolled_courses
        ],
        "total_grades": len(student_grades),
    }


def get_available_courses_context(db: Session, student: Student):
    enrolled_ids = {c.id for c in student.courses}
    available = db.query(Course).filter(Course.id.notin_(enrolled_ids)).all()

    courses_data = []
    for course in available:
        prereqs = db.query(Course).filter(Course.id.in_(
            [p.id for p in course.prerequisites]
        )).all()

        courses_data.append({
            "id": course.id,
            "name": course.name,
            "code": course.code,
            "category": course.category,
            "difficulty": course.difficulty,
            "credits": course.credits,
            "description": course.description,
            "skills": course.skills.split(",") if course.skills else [],
            "prerequisites": [p.name for p in prereqs],
        })

    return courses_data


def generate_course_recommendations(db: Session, student_id: int, options: dict):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        return {"error": "Student not found"}

    context = get_student_context(db, student)
    available = get_available_courses_context(db, student)

    if not available:
        return {"recommendations": [], "message": "No available courses to recommend"}

    system_prompt = """You are an AI Course Recommender for a school grading system.
Analyze the student's profile and recommend courses from the available list.

Consider these factors (only if the option is enabled):
1. Interest Matching: Match student interests with course skills
2. Prerequisites: Check if student has completed prerequisite courses
3. Performance: Recommend based on student's strength areas and academic level
4. Workload Balance: Consider credit load and course diversity
5. Career Alignment: Recommend courses that align with the student's career goal

For each recommended course, provide:
- course_id: The course ID
- course_name: The course name
- course_code: The course code
- score: A match score from 0-100
- reasons: List of 2-4 specific reasons why this course is recommended

Return ONLY a JSON array sorted by score descending. Format:
[{"course_id": 1, "course_name": "Name", "course_code": "CODE", "score": 85, "reasons": ["reason1", "reason2"]}]

Do not include any text outside the JSON array."""

    user_prompt = f"""
Student Profile:
- Name: {context['name']} ({context['student_id']})
- Class: {context['class']}
- Interests: {', '.join(context['interests']) if context['interests'] else 'None specified'}
- Career Goal: {context['career_goal'] or 'Not specified'}
- Overall Average: {context['overall_average']}%
- Strength Areas: {context['strength_areas']}
- Currently Enrolled: {len(context['enrolled_courses'])} courses
- Total Grade Records: {context['total_grades']}

Options Enabled:
- Match Interests: {options.get('match_interests', True)}
- Check Prerequisites: {options.get('check_prereqs', True)}
- Use Performance Data: {options.get('use_performance', True)}
- Balance Workload: {options.get('balance_workload', True)}

Available Courses:
{json.dumps(available, indent=2)}

Recommend the best courses for this student."""

    try:
        client = get_openai_client()
        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=2000,
        )

        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        recommendations = json.loads(content)
        return {"recommendations": recommendations}

    except Exception as e:
        return {"error": str(e)}


def generate_dashboard_insights(db: Session, user_id: int):
    from models import User

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}

    students = db.query(Student).filter(Student.user_id == user_id).all()
    courses = db.query(Course).filter(Course.user_id == user_id).all()
    grades = db.query(Grade).filter(Grade.user_id == user_id).all()

    system_prompt = """You are an AI Education Analyst. Analyze the school data and provide insights.

Return a JSON object with:
{
    "summary": "A 2-3 sentence natural language summary of overall class performance",
    "alerts": [
        {"type": "danger|warning|info|success", "message": "Specific alert message"}
    ],
    "trends": [
        {"label": "Trend name", "description": "What the trend shows"}
    ],
    "predictions": [
        {"type": "honors|good|passing|failing", "message": "Prediction about a student or course"}
    ]
}

Guidelines:
- Be specific with numbers and names
- Identify at-risk students (failing or declining)
- Note strong performers
- Suggest areas needing attention
- Keep it concise

Return ONLY valid JSON."""

    grades_data = []
    for g in grades:
        student = db.query(Student).filter(Student.id == g.student_id).first()
        course = db.query(Course).filter(Course.id == g.course_id).first()
        grades_data.append({
            "student": student.name if student else "Unknown",
            "course": course.name if course else "Unknown",
            "category": course.category if course else "General",
            "subject": g.subject,
            "type": g.type,
            "score": g.score,
            "date": g.date,
        })

    students_data = [
        {
            "name": s.name,
            "student_id": s.student_id,
            "class": s.class_name,
            "interests": s.interests,
            "career_goal": s.career_goal,
        }
        for s in students
    ]

    user_prompt = f"""
Total Students: {len(students)}
Total Courses: {len(courses)}
Total Grades: {len(grades)}

Students:
{json.dumps(students_data, indent=2)}

Grade Records:
{json.dumps(grades_data, indent=2)}

Provide insights for this data."""

    try:
        client = get_openai_client()
        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.4,
            max_tokens=3000,
        )

        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        insights = json.loads(content)
        return insights

    except Exception as e:
        return {"error": str(e)}
