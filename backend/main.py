from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from database import Base, engine
from routers import auth, students, courses, grades, ai_agent

Base.metadata.create_all(bind=engine)

app = FastAPI(title="School Grading System API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(students.router)
app.include_router(courses.router)
app.include_router(grades.router)
app.include_router(ai_agent.router)

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def root():
    return FileResponse("static/index.html")


@app.get("/health")
def health_check():
    return {"status": "ok"}
