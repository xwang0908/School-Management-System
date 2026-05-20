# School Grading System Frontend Guide

This guide teaches you step by step how to create a school grading system frontend. The app should let teachers record student grades, edit grades, delete grades, view class performance, search students, and manage basic grading information.

The goal is not only to build screens, but to understand how each part connects: forms collect data, JavaScript stores the data, tables display the data, and dashboard cards summarize the data.

## 1. Project Goal

Build a frontend application for a school grading system where a teacher or school staff member can manage students and grades in one place.

The finished frontend should allow the user to:

- Add students
- Edit student information
- Delete students
- Record a student's grade
- Edit a student's grade
- Delete a student's grade
- View all student grades in a table
- Search and filter grade records
- Calculate averages
- Show pass or fail status
- View subject-based grades
- Display simple grade statistics
- Save records in the browser with local storage

Think of this project as a small teacher dashboard. A teacher should be able to open the app, add a student, enter that student's score for a subject, and immediately see the updated class information.

## 2. Recommended Technology

You can build this frontend in different ways depending on your skill level.

### Beginner Option

Use plain HTML, CSS, and JavaScript.

This is the best option if you want to understand the basics clearly.

Files:

- `index.html` for the page structure
- `styles.css` for the design
- `script.js` for the app logic

### Intermediate Or Advanced Option

Use React, Vue, Angular, or another frontend framework.

This is better if you already understand JavaScript and want reusable components.

Possible React components:

- `Dashboard`
- `StudentForm`
- `GradeForm`
- `GradeTable`
- `SearchBar`
- `SubjectFilter`
- `StudentProfile`
- `ReportSummary`

### Recommended Starting Choice

Start with plain HTML, CSS, and JavaScript first. Once the app works, rebuild it in React if you want practice with components.

## 3. Main Pages Or Screens

Your school grading system can be a single-page app with multiple sections, or it can have separate pages. For a beginner version, use one page with sections.

### Dashboard

The dashboard gives a quick overview of the grading system.

It should answer questions such as:

- How many students are in the system?
- How many grades have been recorded?
- What is the class average?
- How many grades are passing?
- How many grades are failing?
- What was the most recent grade entered?

Suggested dashboard cards:

- Total Students
- Total Grades
- Class Average
- Passing Grades
- Failing Grades

### Students Section

This section manages student records.

Each student should have:

- Internal `id`
- Student ID, such as `S001`
- Student name
- Class or grade level
- Email or contact information

The user should be able to:

- Add a new student
- Edit an existing student
- Delete a student
- See students in a list or table

### Grades Section

This is the main section for recording and managing grades.

Each grade should include:

- Student
- Subject
- Grade type, such as homework, quiz, exam, or project
- Score
- Date

The user should be able to:

- Add a grade
- Edit a grade
- Delete a grade
- See the letter grade
- See pass or fail status

### Reports Section

This section helps the teacher understand performance.

Possible reports:

- Average score by student
- Average score by subject
- Highest score
- Lowest score
- Number of A, B, C, D, and F grades
- Students who are failing
- Students who are missing grades

You do not need to build every report at first. Start with the dashboard numbers, then add reports later.

## 4. Suggested Data Model

Before connecting to a backend, use JavaScript arrays. This makes the project easier to build and understand.

Use one array for students:

```js
let students = [
  {
    id: 1,
    studentId: "S001",
    name: "Ava Johnson",
    className: "Grade 8",
    email: "ava@example.com"
  }
];
```

Use another array for grades:

```js
let grades = [
  {
    id: 1,
    studentId: 1,
    courseId: 201,
    subject: "Math",
    type: "Exam",
    score: 92,
    date: "2026-04-28"
  }
];
```

Use another array for courses or class sections:

```js
let courses = [
  {
    id: 201,
    code: "MATH-801",
    name: "Algebra 1",
    teacher: "Ms. Rivera",
    period: "Period 2",
    room: "Room 204",
    term: "Spring 2026",
    studentIds: [1, 2]
  }
];
```

Notice that the grade object uses both `studentId: 1` and `courseId: 201`. This connects the grade to one student and one course.

### Why Use Separate Arrays?

Students, courses, and grades are different types of information.

A student can have many grades. If you keep students and grades separate, it becomes easier to:

- Add multiple grades for one student
- Delete one grade without deleting the student
- Calculate a student's average
- Show all grades for one course
- Show all grades for one subject
- Enroll students in different courses
- Show course-level averages
- Track teacher, period, room, and term information

## 5. Step-By-Step Build Plan

### Step 1: Create The Project Files

Create a folder named `school-grading-system`.

Inside it, create these files:

```text
school-grading-system/
  index.html
  styles.css
  script.js
```

Your `index.html` file should connect to your CSS and JavaScript files:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>School Grading System</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <script src="script.js" defer></script>
</body>
</html>
```

The `defer` attribute tells the browser to load the JavaScript after the HTML is ready. This helps prevent errors when JavaScript tries to find elements on the page.

Done when:

- The project folder exists
- The three files exist
- `styles.css` is linked
- `script.js` is linked
- Opening `index.html` shows a blank page without errors

### Step 2: Create The Page Layout

Now build the main structure of the app.

Start with:

- Header
- Navigation area
- Main content area
- Dashboard section
- Student management section
- Grade management section
- Reports or summary section

Example:

```html
<header class="app-header">
  <h1>School Grading System</h1>
  <p>Manage students, grades, and class performance.</p>
</header>

<main class="app-layout">
  <section class="dashboard" id="dashboard"></section>

  <section class="panel" id="students-section">
    <h2>Students</h2>
  </section>

  <section class="panel" id="grades-section">
    <h2>Grades</h2>
  </section>

  <section class="panel" id="reports-section">
    <h2>Reports</h2>
  </section>
</main>
```

At this stage, do not worry about making every feature work. You are creating places where the features will live.

Add simple CSS so the app looks organized:

```css
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f4f6f8;
  color: #1f2933;
}

.app-header {
  padding: 24px;
  background: #1f4e79;
  color: white;
}

.app-layout {
  display: grid;
  gap: 20px;
  padding: 20px;
}

.panel,
.dashboard {
  background: white;
  border: 1px solid #d8dee4;
  border-radius: 8px;
  padding: 20px;
}
```

Done when:

- The app has a visible header
- The page has separate sections
- Each section has a clear heading
- The layout is readable on your screen

### Step 3: Add Starter Data

Before building forms, add sample data in `script.js`. Sample data helps you test your table and dashboard before user input works.

```js
let students = [
  {
    id: 1,
    studentId: "S001",
    name: "Ava Johnson",
    className: "Grade 8",
    email: "ava@example.com"
  },
  {
    id: 2,
    studentId: "S002",
    name: "Noah Smith",
    className: "Grade 8",
    email: "noah@example.com"
  }
];

let grades = [
  {
    id: 1,
    studentId: 1,
    subject: "Math",
    type: "Exam",
    score: 92,
    date: "2026-04-28"
  },
  {
    id: 2,
    studentId: 2,
    subject: "Science",
    type: "Quiz",
    score: 78,
    date: "2026-04-28"
  }
];
```

Also create helper functions to find students:

```js
function findStudentById(id) {
  return students.find((student) => student.id === id);
}
```

Done when:

- `students` and `grades` arrays exist
- You have at least two students
- You have at least two grades
- Each grade connects to a real student

### Step 4: Build The Student Form

The student form lets the teacher add students.

Add this HTML inside the students section:

```html
<form id="studentForm" class="form-grid">
  <label>
    Student Name
    <input id="studentName" type="text" placeholder="Example: Ava Johnson">
  </label>

  <label>
    Student ID
    <input id="studentCode" type="text" placeholder="Example: S001">
  </label>

  <label>
    Class
    <input id="studentClass" type="text" placeholder="Example: Grade 8">
  </label>

  <label>
    Email
    <input id="studentEmail" type="email" placeholder="Example: ava@example.com">
  </label>

  <button type="submit">Add Student</button>
</form>
```

Then add JavaScript to handle the form:

```js
const studentForm = document.querySelector("#studentForm");

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addStudent();
});
```

Create the `addStudent` function:

```js
function addStudent() {
  const name = document.querySelector("#studentName").value.trim();
  const studentId = document.querySelector("#studentCode").value.trim();
  const className = document.querySelector("#studentClass").value.trim();
  const email = document.querySelector("#studentEmail").value.trim();

  if (!name || !studentId || !className) {
    alert("Please enter the student name, student ID, and class.");
    return;
  }

  students.push({
    id: Date.now(),
    studentId,
    name,
    className,
    email
  });

  studentForm.reset();
  renderStudentOptions();
  renderStudents();
  renderDashboard();
  saveData();
}
```

The `Date.now()` value gives each new student a unique id. In a real backend system, the database usually creates this id.

Done when:

- The student form appears
- Required fields are checked
- Submitting the form adds a student to the `students` array
- The form clears after saving

### Step 5: Show Students In A Table

Users need to see which students already exist.

Add an empty table area below the student form:

```html
<div id="studentTable"></div>
```

Create a render function:

```js
function renderStudents() {
  const studentTable = document.querySelector("#studentTable");

  if (students.length === 0) {
    studentTable.innerHTML = "<p>No students added yet.</p>";
    return;
  }

  studentTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Name</th>
          <th>Class</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        ${students.map((student) => `
          <tr>
            <td>${student.studentId}</td>
            <td>${student.name}</td>
            <td>${student.className}</td>
            <td>${student.email || "N/A"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}
```

Call it when the app starts:

```js
renderStudents();
```

Done when:

- Students appear in a table
- New students appear after being added
- The table does not break when the email is empty

### Step 6: Build Course And Class Management

Real school systems organize grades inside courses or class sections. A course should describe the class a student is enrolled in, who teaches it, and when or where it meets.

The course form should collect:

- Course name, such as `Algebra 1`
- Course code, such as `MATH-801`
- Teacher
- Period
- Room
- Term
- Enrolled students

Example fields:

```html
<input id="courseName" type="text" placeholder="Algebra 1">
<input id="courseCode" type="text" placeholder="MATH-801">
<input id="courseTeacher" type="text" placeholder="Ms. Rivera">
<input id="coursePeriod" type="text" placeholder="Period 2">
<input id="courseRoom" type="text" placeholder="Room 204">
<input id="courseTerm" type="text" placeholder="Spring 2026">
<select id="courseStudents" multiple></select>
<button id="saveCourseButton">Add Course</button>
```

Course actions:

- Add a course
- Edit a course
- Delete a course if it has no grade records
- Enroll students in the course
- Show course averages in reports
- Use courses when recording grades

Done when:

- A course can be added
- A course can be edited
- Students can be enrolled in a course
- Courses appear in a course table
- Courses appear in the grade form dropdown

### Step 7: Build The Grade Form

The grade form lets the teacher record scores.

Add this HTML inside the grades section:

```html
<form id="gradeForm" class="form-grid">
  <label>
    Student
    <select id="gradeStudent"></select>
  </label>

  <label>
    Course
    <select id="gradeCourse"></select>
  </label>

  <label>
    Subject
    <input id="gradeSubject" type="text" placeholder="Example: Math">
  </label>

  <label>
    Grade Type
    <select id="gradeType">
      <option value="Homework">Homework</option>
      <option value="Quiz">Quiz</option>
      <option value="Exam">Exam</option>
      <option value="Project">Project</option>
    </select>
  </label>

  <label>
    Score
    <input id="gradeScore" type="number" min="0" max="100">
  </label>

  <label>
    Date
    <input id="gradeDate" type="date">
  </label>

  <button id="saveGradeButton" type="submit">Save Grade</button>
</form>
```

The student dropdown should be filled from the `students` array:

```js
function renderStudentOptions() {
  const gradeStudent = document.querySelector("#gradeStudent");

  gradeStudent.innerHTML = `
    <option value="">Select a student</option>
    ${students.map((student) => `
      <option value="${student.id}">${student.name} (${student.studentId})</option>
    `).join("")}
  `;
}
```

Call it when the app starts and after adding a student:

```js
renderStudentOptions();
```

Done when:

- The grade form appears
- The student dropdown lists all students
- Adding a new student updates the dropdown

### Step 8: Record A Student's Grade

Now connect the grade form to JavaScript.

```js
const gradeForm = document.querySelector("#gradeForm");

gradeForm.addEventListener("submit", function (event) {
  event.preventDefault();
  saveGrade();
});
```

Create the grade saving function:

```js
function saveGrade() {
  const studentId = Number(document.querySelector("#gradeStudent").value);
  const subject = document.querySelector("#gradeSubject").value.trim();
  const type = document.querySelector("#gradeType").value;
  const score = Number(document.querySelector("#gradeScore").value);
  const date = document.querySelector("#gradeDate").value;

  if (!studentId) {
    alert("Please select a student.");
    return;
  }

  if (!subject) {
    alert("Please enter a subject.");
    return;
  }

  if (Number.isNaN(score) || score < 0 || score > 100) {
    alert("Score must be a number from 0 to 100.");
    return;
  }

  if (!date) {
    alert("Please select a date.");
    return;
  }

  grades.push({
    id: Date.now(),
    studentId,
    subject,
    type,
    score,
    date
  });

  gradeForm.reset();
  renderGrades();
  renderDashboard();
  saveData();
}
```

This function does six important things:

1. Reads values from the form.
2. Checks that the values are valid.
3. Creates a grade object.
4. Adds it to the `grades` array.
5. Refreshes the grade table and dashboard.
6. Saves the data to local storage.

Done when:

- A grade can be added
- Invalid scores are rejected
- Empty student or subject fields are rejected
- The form clears after saving

### Step 9: Show Grades In A Table

The grade table is the main record view.

Add this HTML under the grade form:

```html
<div id="gradeTable"></div>
```

Create a function to calculate letter grades:

```js
function getLetterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
```

Create a function for pass or fail:

```js
function getPassFailStatus(score) {
  return score >= 60 ? "Pass" : "Fail";
}
```

Render the grade table:

```js
function renderGrades() {
  const gradeTable = document.querySelector("#gradeTable");

  if (grades.length === 0) {
    gradeTable.innerHTML = "<p>No grades recorded yet.</p>";
    return;
  }

  gradeTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Subject</th>
          <th>Type</th>
          <th>Score</th>
          <th>Letter</th>
          <th>Status</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${grades.map((grade) => {
          const student = findStudentById(grade.studentId);

          return `
            <tr>
              <td>${student ? student.name : "Unknown Student"}</td>
              <td>${grade.subject}</td>
              <td>${grade.type}</td>
              <td>${grade.score}</td>
              <td>${getLetterGrade(grade.score)}</td>
              <td>${getPassFailStatus(grade.score)}</td>
              <td>${grade.date}</td>
              <td>
                <button onclick="editGrade(${grade.id})">Edit</button>
                <button onclick="deleteGrade(${grade.id})">Delete</button>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}
```

Call it when the app starts:

```js
renderGrades();
```

Done when:

- Grades appear in a table
- Student names show correctly
- Each grade has a letter grade
- Each grade has pass or fail status
- Each row has edit and delete buttons

### Step 10: Delete A Student's Grade

Each grade row should have a delete button.

When the delete button is clicked, the app should:

1. Ask the user to confirm.
2. Find the selected grade by `id`.
3. Remove it from the `grades` array.
4. Re-render the grade table.
5. Re-render the dashboard.
6. Save the new data to local storage.

Example:

```js
function deleteGrade(gradeId) {
  const confirmed = confirm("Delete this grade?");

  if (!confirmed) {
    return;
  }

  grades = grades.filter((grade) => grade.id !== gradeId);
  renderGrades();
  renderDashboard();
  saveData();
}
```

Why confirmation matters:

- Deleting is permanent in this simple frontend.
- A teacher might click the wrong button.
- Confirmation protects the user from accidental data loss.

Done when:

- Clicking delete asks for confirmation
- Cancel keeps the grade
- Confirm removes the grade
- The dashboard updates after deletion

### Step 11: Edit A Student's Grade

Editing is slightly more complex than adding because the app needs to remember which grade is being changed.

Create a variable:

```js
let editingGradeId = null;
```

When the edit button is clicked, load the grade into the form:

```js
function editGrade(gradeId) {
  const grade = grades.find((item) => item.id === gradeId);

  if (!grade) {
    return;
  }

  editingGradeId = grade.id;

  document.querySelector("#gradeStudent").value = grade.studentId;
  document.querySelector("#gradeSubject").value = grade.subject;
  document.querySelector("#gradeType").value = grade.type;
  document.querySelector("#gradeScore").value = grade.score;
  document.querySelector("#gradeDate").value = grade.date;
  document.querySelector("#saveGradeButton").textContent = "Update Grade";
}
```

Then update `saveGrade` so it can either create or update:

```js
function saveGrade() {
  const studentId = Number(document.querySelector("#gradeStudent").value);
  const subject = document.querySelector("#gradeSubject").value.trim();
  const type = document.querySelector("#gradeType").value;
  const score = Number(document.querySelector("#gradeScore").value);
  const date = document.querySelector("#gradeDate").value;

  if (!studentId || !subject || Number.isNaN(score) || score < 0 || score > 100 || !date) {
    alert("Please complete the grade form correctly.");
    return;
  }

  if (editingGradeId) {
    grades = grades.map((grade) => {
      if (grade.id !== editingGradeId) {
        return grade;
      }

      return {
        ...grade,
        studentId,
        subject,
        type,
        score,
        date
      };
    });
  } else {
    grades.push({
      id: Date.now(),
      studentId,
      subject,
      type,
      score,
      date
    });
  }

  editingGradeId = null;
  document.querySelector("#saveGradeButton").textContent = "Save Grade";
  gradeForm.reset();
  renderGrades();
  renderDashboard();
  saveData();
}
```

Done when:

- Clicking edit fills the form
- The button changes to `Update Grade`
- Saving updates the existing grade
- The app returns to normal add mode after updating

### Step 12: Add Search, Filter, And Sort

Search and filtering make the system easier to use when there are many records.

Add controls above the grade table:

```html
<div class="toolbar">
  <input id="searchGrades" type="search" placeholder="Search by student or subject">

  <select id="statusFilter">
    <option value="all">All Statuses</option>
    <option value="pass">Passing</option>
    <option value="fail">Failing</option>
  </select>

  <select id="sortGrades">
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
    <option value="highest">Highest Score</option>
    <option value="lowest">Lowest Score</option>
  </select>
</div>
```

Create a function that returns the visible grades:

```js
function getVisibleGrades() {
  const searchText = document.querySelector("#searchGrades").value.toLowerCase();
  const statusFilter = document.querySelector("#statusFilter").value;
  const sortValue = document.querySelector("#sortGrades").value;

  let visibleGrades = grades.filter((grade) => {
    const student = findStudentById(grade.studentId);
    const studentName = student ? student.name.toLowerCase() : "";
    const subject = grade.subject.toLowerCase();
    const matchesSearch = studentName.includes(searchText) || subject.includes(searchText);
    const status = getPassFailStatus(grade.score).toLowerCase();
    const matchesStatus = statusFilter === "all" || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  visibleGrades = visibleGrades.sort((a, b) => {
    if (sortValue === "highest") return b.score - a.score;
    if (sortValue === "lowest") return a.score - b.score;
    if (sortValue === "oldest") return new Date(a.date) - new Date(b.date);
    return new Date(b.date) - new Date(a.date);
  });

  return visibleGrades;
}
```

Then update `renderGrades` to use `getVisibleGrades()` instead of `grades`.

Also listen for control changes:

```js
document.querySelector("#searchGrades").addEventListener("input", renderGrades);
document.querySelector("#statusFilter").addEventListener("change", renderGrades);
document.querySelector("#sortGrades").addEventListener("change", renderGrades);
```

Done when:

- Search works by student name
- Search works by subject
- The pass or fail filter works
- Sorting changes the table order

### Step 13: Add Student Search And Profile Records

A useful school grading system should let the user search for one student and see that student's complete record in one place.

This feature is different from the grade table search. The grade table search helps find grade rows. The student profile search helps answer: "Show me everything about this student."

The student profile should show:

- Student name
- Student ID
- Class
- Email
- Number of recorded grades
- Student average
- Highest score
- Lowest score
- Pass or fail summary
- Full grade history for that student

Add a student lookup section:

```html
<section id="student-profile-section">
  <h2>Student Profile</h2>

  <input id="studentProfileSearch" type="search" placeholder="Search by student name or ID">

  <select id="studentProfileSelect">
    <option value="">Select a student</option>
  </select>

  <div id="studentProfile"></div>
</section>
```

Fill the profile dropdown from the `students` array:

```js
function renderStudentProfileOptions() {
  const select = document.querySelector("#studentProfileSelect");

  select.innerHTML = `
    <option value="">Select a student</option>
    ${students.map((student) => `
      <option value="${student.id}">${student.name} (${student.studentId})</option>
    `).join("")}
  `;
}
```

Create a helper to find all grades for one student:

```js
function getGradesForStudent(studentId) {
  return grades.filter((grade) => grade.studentId === studentId);
}
```

Create a small average helper for the selected student's grades:

```js
function calculateAverage(items) {
  if (items.length === 0) {
    return 0;
  }

  const total = items.reduce((sum, item) => sum + item.score, 0);
  return Math.round(total / items.length);
}
```

Render the selected student's full profile:

```js
function renderStudentProfile(studentId) {
  const profile = document.querySelector("#studentProfile");
  const student = findStudentById(studentId);

  if (!student) {
    profile.innerHTML = "<p>Select a student to view their full record.</p>";
    return;
  }

  const studentGrades = getGradesForStudent(student.id);
  const average = calculateAverage(studentGrades);

  profile.innerHTML = `
    <article>
      <h3>${student.name}</h3>
      <p>Student ID: ${student.studentId}</p>
      <p>Class: ${student.className}</p>
      <p>Email: ${student.email || "N/A"}</p>
      <p>Average: ${studentGrades.length ? `${average}%` : "N/A"}</p>
      <p>Total Grades: ${studentGrades.length}</p>
    </article>

    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Type</th>
          <th>Score</th>
          <th>Letter</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${studentGrades.map((grade) => `
          <tr>
            <td>${grade.subject}</td>
            <td>${grade.type}</td>
            <td>${grade.score}</td>
            <td>${getLetterGrade(grade.score)}</td>
            <td>${getPassFailStatus(grade.score)}</td>
            <td>${grade.date}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}
```

Add search behavior:

```js
document.querySelector("#studentProfileSearch").addEventListener("input", function () {
  const searchText = this.value.toLowerCase();

  const matchedStudent = students.find((student) => {
    return student.name.toLowerCase().includes(searchText) ||
      student.studentId.toLowerCase().includes(searchText);
  });

  if (matchedStudent) {
    document.querySelector("#studentProfileSelect").value = matchedStudent.id;
    renderStudentProfile(matchedStudent.id);
  }
});
```

Also listen for dropdown changes:

```js
document.querySelector("#studentProfileSelect").addEventListener("change", function () {
  renderStudentProfile(Number(this.value));
});
```

Done when:

- The user can search for a student by name
- The user can search for a student by student ID
- Selecting a student shows all student information
- Selecting a student shows all grade records for that student
- The profile updates after grades are added, edited, or deleted

### Step 14: Add Dashboard Calculations

The dashboard should update whenever grades or students change.

Useful calculations:

- Total students
- Total grades
- Average score
- Highest score
- Lowest score
- Passing grades
- Failing grades

Example helper functions:

```js
function calculateAverageScore() {
  if (grades.length === 0) {
    return 0;
  }

  const total = grades.reduce((sum, grade) => sum + grade.score, 0);
  return Math.round(total / grades.length);
}

function countPassingGrades() {
  return grades.filter((grade) => grade.score >= 60).length;
}

function countFailingGrades() {
  return grades.filter((grade) => grade.score < 60).length;
}
```

Render the dashboard:

```js
function renderDashboard() {
  const dashboard = document.querySelector("#dashboard");

  dashboard.innerHTML = `
    <article>
      <h3>Total Students</h3>
      <p>${students.length}</p>
    </article>
    <article>
      <h3>Total Grades</h3>
      <p>${grades.length}</p>
    </article>
    <article>
      <h3>Class Average</h3>
      <p>${calculateAverageScore()}%</p>
    </article>
    <article>
      <h3>Passing Grades</h3>
      <p>${countPassingGrades()}</p>
    </article>
    <article>
      <h3>Failing Grades</h3>
      <p>${countFailingGrades()}</p>
    </article>
  `;
}
```

Done when:

- Dashboard cards appear
- Numbers update after adding a student
- Numbers update after adding a grade
- Numbers update after editing or deleting a grade

### Step 15: Add Local Storage

Local storage lets the browser remember data after refresh.

Create save and load functions:

```js
function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
  localStorage.setItem("grades", JSON.stringify(grades));
}

function loadData() {
  students = JSON.parse(localStorage.getItem("students")) || students;
  grades = JSON.parse(localStorage.getItem("grades")) || grades;
}
```

Call `loadData()` before rendering the app:

```js
loadData();
renderStudents();
renderStudentOptions();
renderGrades();
renderDashboard();
```

Call `saveData()` after every change:

- After adding a student
- After editing a student
- After deleting a student
- After adding a grade
- After editing a grade
- After deleting a grade

Done when:

- Add a student
- Refresh the browser
- The student is still there
- Add a grade
- Refresh the browser
- The grade is still there

### Step 16: Improve The Styling And User Experience

Once the app works, improve the design so it feels like a useful school tool instead of a rough demo.

Good frontend design should make the most important actions easy to find:

- Add a student
- Look up a student
- Record a grade
- Review class performance

Use a clear visual hierarchy:

- A compact header with the app name and a few useful actions
- Dashboard cards near the top for quick status
- Main work panels for students, student profile, and grades
- Reports below the daily workflow
- Tables that are easy to scan
- Empty states that explain what is missing

Style these parts carefully:

- Page background
- Header
- Navigation links
- Dashboard cards
- Forms
- Inputs
- Buttons
- Tables
- Student profile panel
- Report bars
- Empty states
- Toast messages
- Pass and fail labels

Suggested visual direction:

- Use a calm professional palette
- Use blue for primary actions
- Use green for passing grades
- Use red for failing grades or delete actions
- Use amber for warning or average performance
- Use light surfaces with clear borders
- Use consistent spacing between panels
- Use rounded corners lightly, around `8px`
- Use shadows only to separate important surfaces

Example page foundation:

```css
:root {
  --page: #eef3f7;
  --surface: #ffffff;
  --text: #1f2937;
  --muted: #64748b;
  --border: #d7e0ea;
  --primary: #2563eb;
  --success: #16824a;
  --danger: #b42318;
  --warning: #a16207;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: var(--page);
  color: var(--text);
}
```

Example table CSS:

```css
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid #d8dee4;
  text-align: left;
}

th {
  background: #eef2f6;
}

button {
  border: 0;
  border-radius: 6px;
  padding: 10px 14px;
  cursor: pointer;
}
```

Make the main workspace responsive:

```css
.workspace-grid {
  display: grid;
  grid-template-columns: minmax(300px, 0.8fr) minmax(340px, 0.9fr) minmax(520px, 1.3fr);
  gap: 22px;
}

@media (max-width: 1080px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }
}
```

Make the dashboard cards responsive:

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}
```

Done when:

- The app looks clean, modern, and organized
- Forms are easy to use
- Tables are easy to scan
- Buttons are visually clear
- The student profile is easy to find
- The student profile shows important information first
- Reports feel connected to the rest of the page
- The layout works on smaller screens

## 6. Extra Features To Add Later

Once the main grading features work, add more school system features.

### Student Management

- Edit student details
- Delete students
- Add student photos
- Add guardian contact information
- Add notes for student support plans

### Grade Management

- Weighted grading, such as exams worth 50 percent
- Assignment names
- Missing assignment status
- Late assignment status
- Extra credit
- Comments or teacher notes

### Reports

- Print report cards
- Export grades to CSV
- Import student list from CSV
- Grade distribution chart
- Subject performance chart
- Class ranking

### User Roles

- Teacher login
- Administrator login
- Student view
- Parent view
- Role-based permissions

### School Features

- Attendance tracking
- Subject management
- Class management
- Term or semester management
- Notifications for failing grades
- Notifications for missing grades

## 7. User Interface Tips

Keep the frontend simple and clear.

Good design choices:

- Use a table for grade records
- Use forms for adding and editing
- Use clear buttons for save, edit, and delete
- Use color carefully for pass and fail status
- Keep dashboard numbers easy to scan
- Put common work areas in predictable sections
- Make the student profile visually important because teachers often need one student's full record quickly
- Keep table headers sticky-looking or visually distinct
- Use search and filters close to the table they control
- Show helpful error messages
- Ask for confirmation before deleting grades

Suggested colors:

- Blue for primary actions
- Green for passing grades
- Red for failing grades or delete actions
- Gray for secondary actions
- White or light gray for backgrounds
- Amber for warning or average performance

Make sure the app answers the user's most important question quickly: "How are my students doing?"

## 8. Testing Checklist

Before calling the frontend complete, test that:

- A student can be added
- A student appears in the student table
- A student appears in the grade form dropdown
- A course can be added
- A course can be edited
- Students can be enrolled in a course
- Courses appear in the grade form dropdown
- A grade can be recorded
- A grade can be edited
- A grade can be deleted
- Invalid scores are rejected
- Empty required fields are rejected
- The grade table updates after every change
- A student can be searched by name or student ID
- A selected student profile shows student information
- A selected student profile shows all grades for that student
- Student profile averages update after grades change
- Dashboard statistics update correctly
- Data remains after refreshing the browser
- Search works correctly
- Filters work correctly
- Sorting works correctly
- The app looks good on desktop
- The app still works on a small screen

## 9. Suggested Final Folder Structure

For a simple JavaScript project:

```text
school-grading-system/
  index.html
  styles.css
  script.js
  README.md
```

For a React project:

```text
school-grading-system/
  src/
    components/
      Dashboard.jsx
      StudentForm.jsx
      StudentTable.jsx
      StudentProfile.jsx
      GradeForm.jsx
      GradeTable.jsx
      SearchBar.jsx
      ReportSummary.jsx
    data/
      storage.js
    utils/
      gradeUtils.js
    App.jsx
    main.jsx
  package.json
  README.md
```

## 10. Final Build Order

Build the system in this order:

1. Create the project files.
2. Create the page layout.
3. Add starter student and grade data.
4. Build the student form.
5. Show students in a table.
6. Build course and class management.
7. Build the grade form.
8. Record grades.
9. Show grades in a table.
10. Add delete grade functionality.
11. Add edit grade functionality.
12. Add search, filter, and sort.
13. Add student search and profile records.
14. Add dashboard calculations.
15. Save data to local storage.
16. Improve styling.
17. Test the full workflow.

## 11. Full Workflow Example

When the frontend is complete, the user should be able to do this:

1. Open the app.
2. See the dashboard.
3. Add a new student named Ava Johnson.
4. Create a course named Algebra 1.
5. Enroll Ava in Algebra 1.
6. Select Ava and Algebra 1 from the grade form.
7. Enter `Math`, `Exam`, `92`, and a date.
8. Click `Save Grade`.
9. See Ava's grade in the table with its course.
10. See the class and course averages update.
11. Search for Ava in the student profile section.
12. See Ava's full information, enrolled courses, and grade history together.
13. Edit the grade if the score was entered incorrectly.
14. Delete the grade if it was added by mistake.
15. Refresh the browser and still see the saved records.

By following this expanded guide, you will have a complete frontend plan for a school grading system that records student grades, deletes grades, edits records, displays performance summaries, saves data, and supports the most important school grading workflows.
