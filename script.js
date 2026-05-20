const CACHE_KEY = "schoolGradingSystemData";
const DEMO_SEEDED_KEY = "schoolGradingSystem_demoSeeded";

const demoCourses = [
  {
    id: 201,
    code: "MATH-801",
    name: "Algebra 1",
    teacher: "Ms. Rivera",
    period: "Period 2",
    room: "Room 204",
    term: "Spring 2026",
    category: "STEM",
    difficulty: "Intermediate",
    credits: 3,
    prerequisites: [],
    description: "Introduction to algebraic concepts including equations, inequalities, and functions.",
    skills: ["problem-solving", "logical-thinking", "algebra"],
    studentIds: [1, 2]
  },
  {
    id: 202,
    code: "SCI-801",
    name: "Life Science",
    teacher: "Mr. Bennett",
    period: "Period 4",
    room: "Lab 3",
    term: "Spring 2026",
    category: "STEM",
    difficulty: "Beginner",
    credits: 3,
    prerequisites: [],
    description: "Study of living organisms, ecosystems, and biological processes.",
    skills: ["analysis", "observation", "scientific-method"],
    studentIds: [2, 3]
  },
  {
    id: 203,
    code: "ELA-701",
    name: "English Language Arts",
    teacher: "Mrs. Patel",
    period: "Period 1",
    room: "Room 118",
    term: "Spring 2026",
    category: "Humanities",
    difficulty: "Intermediate",
    credits: 2,
    prerequisites: [],
    description: "Reading comprehension, writing, grammar, and literature analysis.",
    skills: ["writing", "critical-reading", "communication"],
    studentIds: [1, 3]
  },
  {
    id: 204,
    code: "MATH-802",
    name: "Geometry",
    teacher: "Ms. Rivera",
    period: "Period 3",
    room: "Room 204",
    term: "Spring 2026",
    category: "STEM",
    difficulty: "Advanced",
    credits: 3,
    prerequisites: [201],
    description: "Study of shapes, angles, proofs, and spatial reasoning.",
    skills: ["spatial-reasoning", "proofs", "algebra"],
    studentIds: []
  },
  {
    id: 205,
    code: "ART-701",
    name: "Visual Arts",
    teacher: "Ms. Torres",
    period: "Period 5",
    room: "Art Studio",
    term: "Spring 2026",
    category: "Arts",
    difficulty: "Beginner",
    credits: 1,
    prerequisites: [],
    description: "Introduction to drawing, painting, and creative expression.",
    skills: ["creativity", "visual-design", "fine-motor"],
    studentIds: [1]
  },
  {
    id: 206,
    code: "SOC-701",
    name: "World History",
    teacher: "Mr. Davis",
    period: "Period 6",
    room: "Room 310",
    term: "Spring 2026",
    category: "Social Science",
    difficulty: "Beginner",
    credits: 2,
    prerequisites: [],
    description: "Survey of major world civilizations and historical events.",
    skills: ["research", "critical-thinking", "writing"],
    studentIds: []
  }
];

const demoStudents = [
  { id: 1, studentId: "S001", name: "Ava Johnson", className: "Grade 8", email: "ava@example.com", interests: ["problem-solving", "creativity"], careerGoal: "Engineer" },
  { id: 2, studentId: "S002", name: "Noah Smith", className: "Grade 8", email: "noah@example.com", interests: ["analysis", "scientific-method"], careerGoal: "Scientist" },
  { id: 3, studentId: "S003", name: "Mia Chen", className: "Grade 7", email: "mia@example.com", interests: ["writing", "critical-reading"], careerGoal: "Journalist" }
];

const demoGrades = [
  { id: 101, studentId: 1, courseId: 201, subject: "Math", type: "Exam", score: 92, date: "2026-04-28" },
  { id: 102, studentId: 2, courseId: 202, subject: "Science", type: "Quiz", score: 78, date: "2026-04-28" },
  { id: 103, studentId: 3, courseId: 203, subject: "English", type: "Project", score: 86, date: "2026-04-29" },
  { id: 104, studentId: 2, courseId: 201, subject: "Math", type: "Homework", score: 58, date: "2026-04-30" }
];

let students = [];
let courses = [];
let grades = [];

const courseForm = document.querySelector("#courseForm");
const studentForm = document.querySelector("#studentForm");
const gradeForm = document.querySelector("#gradeForm");
const toast = document.querySelector("#toast");

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function createId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function cacheToLocal() {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ students, courses, grades })); } catch {}
}

function loadFromLocalCache() {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) normalizeLoadedData(JSON.parse(saved));
  } catch {}
}

function inferCourseIdFromGrade(grade) {
  const subject = (grade.subject || "").toLowerCase();
  const course = courses.find((item) =>
    item.name.toLowerCase().includes(subject) ||
    item.code.toLowerCase().includes(subject.slice(0, 3))
  );

  return course ? course.id : courses[0]?.id || "";
}

function normalizeLoadedData(parsed) {
  students = Array.isArray(parsed.students) ? parsed.students : cloneData(demoStudents);
  courses = Array.isArray(parsed.courses) && parsed.courses.length > 0 ? parsed.courses : cloneData(demoCourses);
  grades = Array.isArray(parsed.grades) ? parsed.grades : cloneData(demoGrades);

  courses = courses.map((course) => ({
    id: course.id || createId(),
    code: course.code || course.courseCode || "COURSE",
    name: course.name || course.subject || "Untitled Course",
    teacher: course.teacher || "",
    period: course.period || "",
    room: course.room || "",
    term: course.term || "Spring 2026",
    category: course.category || "General",
    difficulty: course.difficulty || "Beginner",
    credits: course.credits || 1,
    prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites.map(Number) : [],
    description: course.description || "",
    skills: Array.isArray(course.skills) ? course.skills : [],
    studentIds: Array.isArray(course.studentIds) ? course.studentIds.map(Number) : []
  }));

  students = students.map((student) => ({
    ...student,
    interests: Array.isArray(student.interests) ? student.interests : [],
    careerGoal: student.careerGoal || ""
  }));

  grades = grades.map((grade) => ({
    ...grade,
    courseId: Number(grade.courseId) || inferCourseIdFromGrade(grade)
  }));

  grades.forEach((grade) => {
    const course = findCourseById(grade.courseId);

    if (course && !course.studentIds.map(Number).includes(Number(grade.studentId))) {
      course.studentIds.push(Number(grade.studentId));
    }
  });
}

async function fetchFromApi() {
  try {
    const [apiStudents, apiCourses, apiGrades] = await Promise.all([
      api.getStudents(),
      api.getCourses(),
      api.getGrades(),
    ]);
    students = apiStudents;
    courses = apiCourses;
    grades = apiGrades;
    cacheToLocal();
    return true;
  } catch (err) {
    return false;
  }
}

function loadFromCacheOrDemo() {
  loadFromLocalCache();
  if (!students.length && !courses.length && !grades.length) {
    students = cloneData(demoStudents);
    courses = cloneData(demoCourses);
    grades = cloneData(demoGrades);
    cacheToLocal();
  }
}

function findStudentById(id) {
  return students.find((student) => Number(student.id) === Number(id));
}

function findCourseById(id) {
  return courses.find((course) => Number(course.id) === Number(id));
}

function getGradesForStudent(studentId) {
  return grades.filter((grade) => Number(grade.studentId) === Number(studentId));
}

function getCoursesForStudent(studentId) {
  return courses.filter((course) => course.studentIds.map(Number).includes(Number(studentId)));
}

function getLetterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function getPassFailStatus(score) {
  return score >= 60 ? "Pass" : "Fail";
}

function calculateAverage(items) {
  if (items.length === 0) return 0;
  const total = items.reduce((sum, item) => sum + Number(item.score), 0);
  return Math.round(total / items.length);
}

function getHighestScore() {
  if (grades.length === 0) return 0;
  return Math.max(...grades.map((grade) => Number(grade.score)));
}

function getLowestScore() {
  if (grades.length === 0) return 0;
  return Math.min(...grades.map((grade) => Number(grade.score)));
}

function getSelectedValues(select) {
  return Array.from(select.selectedOptions).map((option) => Number(option.value));
}

function generateDashboardSummary() {
  if (students.length === 0 && courses.length === 0 && grades.length === 0) {
    return { text: "No data yet. Add students, courses, and grades to see insights.", type: "empty" };
  }

  const average = grades.length > 0 ? calculateAverage(grades) : null;
  const passing = grades.filter((g) => Number(g.score) >= 60).length;
  const failing = grades.length - passing;
  const passRate = grades.length > 0 ? Math.round((passing / grades.length) * 100) : 0;

  const enrolledStudents = [...new Set(courses.flatMap((c) => c.studentIds))];
  const unenrolled = students.filter((s) => !enrolledStudents.includes(Number(s.id)));

  let text = `This term, ${students.length} student${students.length === 1 ? " is" : "s are"} enrolled across ${courses.length} course${courses.length === 1 ? "" : "s"} with ${grades.length} grade record${grades.length === 1 ? "" : "s"}.`;

  if (average !== null) {
    const tone = average >= 80 ? "strong" : average >= 70 ? "solid" : average >= 60 ? "moderate" : "concerning";
    text += ` The class average of ${average}% shows ${tone} overall performance`;
    text += ` with a ${passRate}% pass rate (${passing} passing, ${failing} failing).`;
  }

  if (unenrolled.length > 0) {
    text += ` ${unenrolled.length} student${unenrolled.length === 1 ? "" : "s"} (${unenrolled.map((s) => s.name).join(", ")}) ${unenrolled.length === 1 ? "is" : "are"} not yet enrolled in any course.`;
  }

  const categoryAverages = {};
  grades.forEach((g) => {
    const course = findCourseById(g.courseId);
    if (!course) return;
    const cat = course.category || "General";
    if (!categoryAverages[cat]) categoryAverages[cat] = [];
    categoryAverages[cat].push(Number(g.score));
  });

  if (Object.keys(categoryAverages).length > 1) {
    const best = Object.entries(categoryAverages).sort((a, b) => {
      const avgA = a[1].reduce((s, v) => s + v, 0) / a[1].length;
      const avgB = b[1].reduce((s, v) => s + v, 0) / b[1].length;
      return avgB - avgA;
    });
    text += ` ${best[0][0]} leads in performance.`;
  }

  return { text, type: average !== null && average < 60 ? "warning" : "normal" };
}

function detectSmartAlerts() {
  const alerts = [];

  const atRiskStudents = [];
  students.forEach((student) => {
    const studentGrades = getGradesForStudent(student.id);
    if (studentGrades.length === 0) {
      alerts.push({ type: "info", message: `${student.name} has no grade records yet.`, icon: "info" });
      return;
    }
    const failing = studentGrades.filter((g) => Number(g.score) < 60);
    if (failing.length > 0) {
      const courseNames = [...new Set(failing.map((g) => {
        const course = findCourseById(g.courseId);
        return course ? course.name : g.subject;
      }))];
      atRiskStudents.push({ name: student.name, count: failing.length, courses: courseNames });
    }
  });

  atRiskStudents.forEach((s) => {
    alerts.push({ type: "danger", message: `${s.name} is at risk — ${s.count} failing grade(s) in ${s.courses.join(", ")}.`, icon: "alert" });
  });

  courses.forEach((course) => {
    const courseGrades = grades.filter((g) => Number(g.courseId) === Number(course.id));
    if (courseGrades.length === 0) return;
    const failRate = courseGrades.filter((g) => Number(g.score) < 60).length / courseGrades.length;
    if (failRate > 0.5) {
      alerts.push({ type: "danger", message: `${course.name} has a ${Math.round(failRate * 100)}% failure rate. Consider reviewing teaching approach.`, icon: "alert" });
    }
  });

  const enrolledIds = [...new Set(courses.flatMap((c) => c.studentIds.map(Number)))];
  students.forEach((s) => {
    if (!enrolledIds.includes(Number(s.id))) {
      alerts.push({ type: "warning", message: `${s.name} is not enrolled in any courses.`, icon: "warning" });
    }
  });

  const recentGrades = grades.filter((g) => {
    const daysAgo = (new Date() - new Date(g.date)) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  });
  if (recentGrades.length > 0) {
    alerts.push({ type: "info", message: `${recentGrades.length} grade(s) recorded in the last 7 days.`, icon: "activity" });
  }

  students.forEach((student) => {
    const studentGrades = getGradesForStudent(student.id).sort((a, b) => new Date(a.date) - new Date(b.date));
    if (studentGrades.length < 2) return;
    const firstHalf = studentGrades.slice(0, Math.ceil(studentGrades.length / 2));
    const secondHalf = studentGrades.slice(Math.ceil(studentGrades.length / 2));
    const firstAvg = calculateAverage(firstHalf);
    const secondAvg = calculateAverage(secondHalf);
    const drop = firstAvg - secondAvg;
    if (drop >= 15) {
      alerts.push({ type: "danger", message: `${student.name}'s grades dropped ${Math.round(drop)}% recently (from ${firstAvg}% to ${secondAvg}%).`, icon: "trend-down" });
    } else if (drop >= 5) {
      alerts.push({ type: "warning", message: `${student.name} shows a slight grade decline (${firstAvg}% → ${secondAvg}%).`, icon: "trend-down" });
    } else if (secondAvg - firstAvg >= 10) {
      alerts.push({ type: "success", message: `${student.name} is improving! Grades up ${Math.round(secondAvg - firstAvg)}% (from ${firstAvg}% to ${secondAvg}%).`, icon: "trend-up" });
    }
  });

  return alerts;
}

function analyzeTrends() {
  const trends = [];

  if (grades.length === 0) return trends;

  const categoryData = {};
  grades.forEach((g) => {
    const course = findCourseById(g.courseId);
    if (!course) return;
    const cat = course.category || "General";
    if (!categoryData[cat]) categoryData[cat] = [];
    categoryData[cat].push(Number(g.score));
  });

  if (Object.keys(categoryData).length > 0) {
    const categoryAvgs = Object.entries(categoryData).map(([cat, scores]) => ({
      category: cat,
      average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      count: scores.length
    })).sort((a, b) => b.average - a.average);

    trends.push({ type: "category", data: categoryAvgs });
  }

  const gradeTypeData = {};
  grades.forEach((g) => {
    if (!gradeTypeData[g.type]) gradeTypeData[g.type] = [];
    gradeTypeData[g.type].push(Number(g.score));
  });

  if (Object.keys(gradeTypeData).length > 0) {
    const typeAvgs = Object.entries(gradeTypeData).map(([type, scores]) => ({
      type,
      average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    })).sort((a, b) => b.average - a.average);

    trends.push({ type: "gradeType", data: typeAvgs });
  }

  const sortedGrades = [...grades].sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sortedGrades.length >= 2) {
    const mid = Math.floor(sortedGrades.length / 2);
    const earlier = sortedGrades.slice(0, mid);
    const later = sortedGrades.slice(mid);
    const earlierAvg = calculateAverage(earlier);
    const laterAvg = calculateAverage(later);
    trends.push({
      type: "overTime",
      earlier: earlierAvg,
      later: laterAvg,
      change: laterAvg - earlierAvg
    });
  }

  return trends;
}

function generatePredictions() {
  const predictions = [];

  if (grades.length === 0) return predictions;

  students.forEach((student) => {
    const studentGrades = getGradesForStudent(student.id);
    if (studentGrades.length === 0) return;

    const avg = calculateAverage(studentGrades);

    if (avg >= 90) {
      predictions.push({ student: student.name, type: "honors", message: `${student.name} is on track for honors (current average: ${avg}%).`, level: "success" });
    } else if (avg >= 80) {
      predictions.push({ student: student.name, type: "good", message: `${student.name} is performing well (average: ${avg}%). Consistent effort could push them to honors.`, level: "info" });
    } else if (avg >= 60) {
      predictions.push({ student: student.name, type: "passing", message: `${student.name} is passing (average: ${avg}%) but could benefit from additional support.`, level: "warning" });
    } else {
      predictions.push({ student: student.name, type: "failing", message: `${student.name} is at risk of failing (average: ${avg}%). Immediate intervention recommended.`, level: "danger" });
    }

    const lowestGrade = studentGrades.reduce((min, g) => Number(g.score) < Number(min.score) ? g : min);
    if (Number(lowestGrade.score) < 60) {
      const needed = 60 + (60 - Number(lowestGrade.score));
      const course = findCourseById(lowestGrade.courseId);
      predictions.push({ student: student.name, type: "recovery", message: `${student.name} needs ${needed - Number(lowestGrade.score)}+ points above passing on next ${course ? course.name : lowestGrade.subject} assignment to recover.`, level: "danger" });
    }
  });

  const failingCourses = courses.filter((course) => {
    const courseGrades = grades.filter((g) => Number(g.courseId) === Number(course.id));
    return courseGrades.length > 0 && courseGrades.some((g) => Number(g.score) < 60);
  });

  if (failingCourses.length > 0) {
    predictions.push({
      type: "courseRisk",
      message: `${failingCourses.map((c) => c.name).join(", ")} ${failingCourses.length === 1 ? "has" : "have"} failing grades. Monitor closely.`,
      level: "warning"
    });
  }

  return predictions;
}

function renderDashboard() {
  const dashboard = document.querySelector("#dashboard");
  const passing = grades.filter((grade) => Number(grade.score) >= 60).length;
  const failing = grades.length - passing;
  const average = calculateAverage(grades);

  const cards = [
    { label: "Total Students", value: students.length },
    { label: "Total Courses", value: courses.length },
    { label: "Total Grades", value: grades.length },
    { label: "Class Average", value: `${average}%` },
    { label: "Passing Grades", value: passing },
    { label: "Failing Grades", value: failing },
    { label: "Highest Score", value: `${getHighestScore()}%` },
    { label: "Lowest Score", value: `${getLowestScore()}%` }
  ];

  dashboard.innerHTML = cards.map((card) => `
    <article class="stat-card">
      <p>${card.label}</p>
      <strong>${card.value}</strong>
    </article>
  `).join("");

  const summary = generateDashboardSummary();
  document.querySelector("#aiSummary").innerHTML = `
    <div class="summary-content">
      <div class="summary-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </div>
      <div>
        <h3>AI Summary</h3>
        <p>${escapeHtml(summary.text)}</p>
      </div>
    </div>
  `;

  const alerts = detectSmartAlerts();
  if (alerts.length === 0) {
    document.querySelector("#aiAlerts").innerHTML = `
      <h3><span class="panel-icon">🛡</span>Smart Alerts</h3>
      <p class="empty-state">No alerts — everything looks good!</p>
    `;
  } else {
    document.querySelector("#aiAlerts").innerHTML = `
      <h3><span class="panel-icon">🛡</span>Smart Alerts</h3>
      <div class="alerts-list">
        ${alerts.map((alert) => `
          <div class="alert-item alert-${alert.type}">
            <span class="alert-icon">${alert.icon === "alert" ? "🚨" : alert.icon === "warning" ? "⚠" : alert.icon === "success" ? "✅" : alert.icon === "trend-down" ? "📉" : alert.icon === "trend-up" ? "📈" : "ℹ"}</span>
            <p>${escapeHtml(alert.message)}</p>
          </div>
        `).join("")}
      </div>
    `;
  }

  const trends = analyzeTrends();
  if (trends.length === 0) {
    document.querySelector("#aiTrends").innerHTML = `
      <h3><span class="panel-icon">📊</span>Trend Analysis</h3>
      <p class="empty-state">Add more grades to see trend analysis.</p>
    `;
  } else {
    let trendsHtml = `<h3><span class="panel-icon">📊</span>Trend Analysis</h3>`;

    trends.forEach((trend) => {
      if (trend.type === "category") {
        trendsHtml += `
          <div class="trend-section">
            <h4>Performance by Category</h4>
            <div class="trend-bars">
              ${trend.data.map((cat) => `
                <div class="trend-bar-row">
                  <span class="trend-label">${escapeHtml(cat.category)}</span>
                  <div class="trend-bar-track">
                    <div class="trend-bar-fill" style="width: ${cat.average}%; ${cat.average >= 80 ? "background: var(--success)" : cat.average >= 60 ? "background: var(--warning)" : "background: var(--danger)"}"></div>
                  </div>
                  <span class="trend-value">${cat.average}%</span>
                  <span class="trend-count">(${cat.count} grade${cat.count === 1 ? "" : "s"})</span>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      } else if (trend.type === "gradeType") {
        trendsHtml += `
          <div class="trend-section">
            <h4>Average by Assessment Type</h4>
            <div class="trend-bars">
              ${trend.data.map((t) => `
                <div class="trend-bar-row">
                  <span class="trend-label">${escapeHtml(t.type)}</span>
                  <div class="trend-bar-track">
                    <div class="trend-bar-fill" style="width: ${t.average}%; ${t.average >= 80 ? "background: var(--success)" : t.average >= 60 ? "background: var(--warning)" : "background: var(--danger)"}"></div>
                  </div>
                  <span class="trend-value">${t.average}%</span>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      } else if (trend.type === "overTime") {
        const arrow = trend.change >= 0 ? "↑" : "↓";
        const color = trend.change >= 0 ? "var(--success)" : "var(--danger)";
        trendsHtml += `
          <div class="trend-section">
            <h4>Overall Trend</h4>
            <div class="trend-overall">
              <div class="trend-period">
                <span>Earlier Average</span>
                <strong>${trend.earlier}%</strong>
              </div>
              <div class="trend-arrow" style="color: ${color}">${arrow} ${Math.abs(Math.round(trend.change))}%</div>
              <div class="trend-period">
                <span>Recent Average</span>
                <strong>${trend.later}%</strong>
              </div>
            </div>
          </div>
        `;
      }
    });

    document.querySelector("#aiTrends").innerHTML = trendsHtml;
  }

  const predictions = generatePredictions();
  if (predictions.length === 0) {
    document.querySelector("#aiPredictions").innerHTML = `
      <h3><span class="panel-icon">🎯</span>Predictions & Insights</h3>
      <p class="empty-state">Add grades to see predictions.</p>
    `;
  } else {
    document.querySelector("#aiPredictions").innerHTML = `
      <h3><span class="panel-icon">🎯</span>Predictions & Insights</h3>
      <div class="predictions-list">
        ${predictions.map((pred) => `
          <div class="prediction-item prediction-${pred.level}">
            <p>${escapeHtml(pred.message)}</p>
          </div>
        `).join("")}
      </div>
    `;
  }
}

function renderCourseStudentOptions() {
  const courseStudents = document.querySelector("#courseStudents");

  courseStudents.innerHTML = students.map((student) => `
    <option value="${student.id}">${escapeHtml(student.name)} (${escapeHtml(student.studentId)})</option>
  `).join("");
}

function renderCoursePrerequisiteOptions(excludeId) {
  const select = document.querySelector("#coursePrerequisites");

  select.innerHTML = courses
    .filter((c) => Number(c.id) !== Number(excludeId))
    .map((course) => `
      <option value="${course.id}">${escapeHtml(course.name)} (${escapeHtml(course.code)})</option>
    `).join("");
}

function renderCourses() {
  const courseTable = document.querySelector("#courseTable");
  const countLabel = document.querySelector("#courseCountLabel");

  countLabel.textContent = `${courses.length} ${courses.length === 1 ? "record" : "records"}`;

  if (courses.length === 0) {
    courseTable.innerHTML = '<p class="empty-state">No courses added yet. Create your first course above.</p>';
    return;
  }

  courseTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Course</th>
          <th>Code</th>
          <th>Category</th>
          <th>Difficulty</th>
          <th>Credits</th>
          <th>Teacher</th>
          <th>Period</th>
          <th>Room</th>
          <th>Term</th>
          <th>Students</th>
          <th>Grades</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${courses.map((course) => {
          const courseGrades = grades.filter((grade) => Number(grade.courseId) === Number(course.id));

          return `
            <tr>
              <td>${escapeHtml(course.name)}</td>
              <td>${escapeHtml(course.code)}</td>
              <td><span class="rec-category">${escapeHtml(course.category)}</span></td>
              <td><span class="rec-difficulty">${escapeHtml(course.difficulty)}</span></td>
              <td>${course.credits || 1}</td>
              <td>${course.teacher ? escapeHtml(course.teacher) : "N/A"}</td>
              <td>${course.period ? escapeHtml(course.period) : "N/A"}</td>
              <td>${course.room ? escapeHtml(course.room) : "N/A"}</td>
              <td>${course.term ? escapeHtml(course.term) : "N/A"}</td>
              <td>${course.studentIds.length}</td>
              <td>${courseGrades.length}</td>
              <td>
                <div class="actions">
                  <button class="ghost-button" type="button" data-action="edit-course" data-id="${course.id}">Edit</button>
                  <button class="danger-button" type="button" data-action="delete-course" data-id="${course.id}">Delete</button>
                </div>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function renderStudents() {
  const studentTable = document.querySelector("#studentTable");
  const countLabel = document.querySelector("#studentCountLabel");

  countLabel.textContent = `${students.length} ${students.length === 1 ? "record" : "records"}`;

  if (students.length === 0) {
    studentTable.innerHTML = '<p class="empty-state">No students added yet. Add your first student above.</p>';
    return;
  }

  studentTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Name</th>
          <th>Grade Level</th>
          <th>Email</th>
          <th>Courses</th>
          <th>Grades</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${students.map((student) => {
          const gradeCount = getGradesForStudent(student.id).length;
          const courseCount = getCoursesForStudent(student.id).length;

          return `
            <tr>
              <td>${escapeHtml(student.studentId)}</td>
              <td>${escapeHtml(student.name)}</td>
              <td>${escapeHtml(student.className)}</td>
              <td>${student.email ? escapeHtml(student.email) : "N/A"}</td>
              <td>${courseCount}</td>
              <td>${gradeCount}</td>
              <td>
                <div class="actions">
                  <button class="ghost-button" type="button" data-action="edit-student" data-id="${student.id}">Edit</button>
                  <button class="ghost-button" type="button" data-action="view-student" data-id="${student.id}">View</button>
                  <button class="danger-button" type="button" data-action="delete-student" data-id="${student.id}">Delete</button>
                </div>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function renderStudentOptions() {
  const gradeStudent = document.querySelector("#gradeStudent");

  gradeStudent.innerHTML = `
    <option value="">Select a student</option>
    ${students.map((student) => `
      <option value="${student.id}">${escapeHtml(student.name)} (${escapeHtml(student.studentId)})</option>
    `).join("")}
  `;
}

function renderCourseOptions() {
  const gradeCourse = document.querySelector("#gradeCourse");

  gradeCourse.innerHTML = `
    <option value="">Select a course</option>
    ${courses.map((course) => `
      <option value="${course.id}">${escapeHtml(course.name)} (${escapeHtml(course.code)})</option>
    `).join("")}
  `;
}

function getStudentProfileMatches() {
  const searchText = document.querySelector("#studentProfileSearch").value.trim().toLowerCase();

  if (!searchText) return students;

  return students.filter((student) => {
    const enrolledCourses = getCoursesForStudent(student.id).map((course) => `${course.name} ${course.code}`).join(" ").toLowerCase();

    return student.name.toLowerCase().includes(searchText) ||
      student.studentId.toLowerCase().includes(searchText) ||
      student.className.toLowerCase().includes(searchText) ||
      (student.email || "").toLowerCase().includes(searchText) ||
      enrolledCourses.includes(searchText);
  });
}

function renderStudentProfileOptions() {
  const select = document.querySelector("#studentProfileSelect");
  const currentValue = select.value;
  const matchedStudents = getStudentProfileMatches();

  select.innerHTML = `
    <option value="">Select a student</option>
    ${matchedStudents.map((student) => `
      <option value="${student.id}">${escapeHtml(student.name)} (${escapeHtml(student.studentId)})</option>
    `).join("")}
  `;

  if (matchedStudents.some((student) => Number(student.id) === Number(currentValue))) {
    select.value = currentValue;
  }
}

function renderSubjectFilter() {
  const subjectFilter = document.querySelector("#subjectFilter");
  const currentValue = subjectFilter.value;
  const subjects = [...new Set(grades.map((grade) => grade.subject).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));

  subjectFilter.innerHTML = `
    <option value="all">All Subjects</option>
    ${subjects.map((subject) => `
      <option value="${escapeHtml(subject)}">${escapeHtml(subject)}</option>
    `).join("")}
  `;

  if (subjects.includes(currentValue)) subjectFilter.value = currentValue;
}

function renderCourseFilter() {
  const courseFilter = document.querySelector("#courseFilter");
  const currentValue = courseFilter.value;

  courseFilter.innerHTML = `
    <option value="all">All Courses</option>
    ${courses.map((course) => `
      <option value="${course.id}">${escapeHtml(course.name)}</option>
    `).join("")}
  `;

  if (courses.some((course) => Number(course.id) === Number(currentValue))) {
    courseFilter.value = currentValue;
  }
}

function getVisibleGrades() {
  const searchText = document.querySelector("#searchGrades").value.trim().toLowerCase();
  const statusFilter = document.querySelector("#statusFilter").value;
  const subjectFilter = document.querySelector("#subjectFilter").value;
  const courseFilter = document.querySelector("#courseFilter").value;
  const sortValue = document.querySelector("#sortGrades").value;

  const visibleGrades = grades.filter((grade) => {
    const student = findStudentById(grade.studentId);
    const course = findCourseById(grade.courseId);
    const studentName = student ? student.name.toLowerCase() : "";
    const studentCode = student ? student.studentId.toLowerCase() : "";
    const courseName = course ? `${course.name} ${course.code}`.toLowerCase() : "";
    const subject = grade.subject.toLowerCase();
    const gradeStatus = getPassFailStatus(Number(grade.score)).toLowerCase();

    const matchesSearch = !searchText ||
      studentName.includes(searchText) ||
      studentCode.includes(searchText) ||
      courseName.includes(searchText) ||
      subject.includes(searchText);
    const matchesStatus = statusFilter === "all" || gradeStatus === statusFilter;
    const matchesSubject = subjectFilter === "all" || grade.subject === subjectFilter;
    const matchesCourse = courseFilter === "all" || Number(grade.courseId) === Number(courseFilter);

    return matchesSearch && matchesStatus && matchesSubject && matchesCourse;
  });

  return visibleGrades.sort((a, b) => {
    if (sortValue === "highest") return Number(b.score) - Number(a.score);
    if (sortValue === "lowest") return Number(a.score) - Number(b.score);
    if (sortValue === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortValue === "student") {
      const studentA = findStudentById(a.studentId)?.name || "";
      const studentB = findStudentById(b.studentId)?.name || "";
      return studentA.localeCompare(studentB);
    }

    return new Date(b.date) - new Date(a.date);
  });
}

function renderGrades() {
  const gradeTable = document.querySelector("#gradeTable");
  const countLabel = document.querySelector("#gradeCountLabel");
  const visibleGrades = getVisibleGrades();

  countLabel.textContent = `${grades.length} ${grades.length === 1 ? "record" : "records"}`;

  if (grades.length === 0) {
    gradeTable.innerHTML = '<p class="empty-state">No grades recorded yet. Save the first grade above.</p>';
    return;
  }

  if (visibleGrades.length === 0) {
    gradeTable.innerHTML = '<p class="empty-state">No grades match the current search or filters.</p>';
    return;
  }

  gradeTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Course</th>
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
        ${visibleGrades.map((grade) => {
          const student = findStudentById(grade.studentId);
          const course = findCourseById(grade.courseId);
          const letter = getLetterGrade(Number(grade.score));
          const status = getPassFailStatus(Number(grade.score));

          return `
            <tr>
              <td>${student ? escapeHtml(student.name) : "Unknown Student"}</td>
              <td>${course ? escapeHtml(course.name) : "Unassigned"}</td>
              <td>${escapeHtml(grade.subject)}</td>
              <td>${escapeHtml(grade.type)}</td>
              <td>${Number(grade.score)}%</td>
              <td><span class="badge grade-${letter.toLowerCase()}">${letter}</span></td>
              <td><span class="badge ${status.toLowerCase()}">${status}</span></td>
              <td>${escapeHtml(grade.date)}</td>
              <td>
                <div class="actions">
                  <button class="ghost-button" type="button" data-action="edit-grade" data-id="${grade.id}">Edit</button>
                  <button class="danger-button" type="button" data-action="delete-grade" data-id="${grade.id}">Delete</button>
                </div>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function renderStudentProfile() {
  const container = document.querySelector("#studentProfile");
  const selectedId = document.querySelector("#studentProfileSelect").value;

  if (!selectedId) {
    container.innerHTML = '<p class="empty-state">Select a student to view their profile.</p>';
    return;
  }

  const student = findStudentById(selectedId);
  if (!student) return;

  const studentGrades = getGradesForStudent(student.id);
  const enrolledCourses = getCoursesForStudent(student.id);
  const average = calculateAverage(studentGrades);
  const passing = studentGrades.filter((g) => Number(g.score) >= 60).length;
  const failing = studentGrades.length - passing;
  const highest = studentGrades.length > 0 ? Math.max(...studentGrades.map((g) => Number(g.score))) : 0;
  const lowest = studentGrades.length > 0 ? Math.min(...studentGrades.map((g) => Number(g.score))) : 0;

  const strengthAreas = computeStudentStrengths(student.id);

  container.innerHTML = `
    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-avatar">${student.name.split(" ").map((n) => n[0]).join("").toUpperCase()}</div>
        <div>
          <h3>${escapeHtml(student.name)}</h3>
          <p>${escapeHtml(student.studentId)} &middot; ${escapeHtml(student.className)}</p>
          ${student.email ? `<p>${escapeHtml(student.email)}</p>` : ""}
          ${student.interests && student.interests.length > 0 ? `<p class="profile-tags">Interests: ${student.interests.map((t) => `<span class="tag-badge">${escapeHtml(t)}</span>`).join(" ")}</p>` : ""}
          ${student.careerGoal ? `<p class="profile-career">Career Goal: ${escapeHtml(student.careerGoal)}</p>` : ""}
        </div>
      </div>

      <div class="profile-stats">
        <article><span>Courses</span><strong>${enrolledCourses.length}</strong></article>
        <article><span>Grades</span><strong>${studentGrades.length}</strong></article>
        <article><span>Average</span><strong>${studentGrades.length ? `${average}%` : "N/A"}</strong></article>
        <article><span>Highest</span><strong>${studentGrades.length ? `${highest}%` : "N/A"}</strong></article>
        <article><span>Lowest</span><strong>${studentGrades.length ? `${lowest}%` : "N/A"}</strong></article>
        <article><span>Passing</span><strong class="success">${passing}</strong></article>
        <article><span>Failing</span><strong class="danger">${failing}</strong></article>
      </div>

      ${strengthAreas.length > 0 ? `
        <div class="strength-section">
          <h4>Strength Areas</h4>
          <div class="strength-badges">
            ${strengthAreas.map((s) => `
              <span class="strength-badge" title="Average: ${s.average}%">
                ${escapeHtml(s.category)} (${escapeHtml(s.average)}%)
              </span>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <h4>Enrolled Courses</h4>
      ${enrolledCourses.length ? `
        <div class="enrolled-courses">
          ${enrolledCourses.map((course) => `
            <div class="course-chip">
              <span>${escapeHtml(course.name)}</span>
              <span class="chip-meta">${escapeHtml(course.category)} &middot; ${escapeHtml(course.difficulty)}</span>
            </div>
          `).join("")}
        </div>
      ` : '<p class="empty-state">Not enrolled in any courses.</p>'}

      ${studentGrades.length > 0 ? `
        <h4>Grade History</h4>
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Subject</th>
              <th>Type</th>
              <th>Score</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${studentGrades.sort((a, b) => new Date(b.date) - new Date(a.date)).map((grade) => {
              const course = findCourseById(grade.courseId);
              const letter = getLetterGrade(Number(grade.score));
              const status = getPassFailStatus(Number(grade.score));

              return `
                <tr>
                  <td>${course ? escapeHtml(course.name) : "Unassigned"}</td>
                  <td>${escapeHtml(grade.subject)}</td>
                  <td>${escapeHtml(grade.type)}</td>
                  <td><strong>${grade.score}%</strong></td>
                  <td><span class="grade-badge grade-${letter.toLowerCase()}">${letter}</span></td>
                  <td><span class="status-badge ${status === "Pass" ? "pass" : "fail"}">${status}</span></td>
                  <td>${grade.date}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      ` : ""}
    </div>
  `;
}

function computeStudentStrengths(studentId) {
  const studentGrades = getGradesForStudent(studentId);
  if (studentGrades.length === 0) return [];

  const categoryScores = {};
  studentGrades.forEach((grade) => {
    const course = findCourseById(grade.courseId);
    if (!course) return;
    const cat = course.category || "General";
    if (!categoryScores[cat]) categoryScores[cat] = [];
    categoryScores[cat].push(Number(grade.score));
  });

  return Object.entries(categoryScores)
    .map(([category, scores]) => ({
      category,
      average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }))
    .sort((a, b) => b.average - a.average);
}

function renderCourseReport() {
  const report = document.querySelector("#courseReport");

  if (courses.length === 0) {
    report.innerHTML = '<p class="empty-state">No course data available yet.</p>';
    return;
  }

  report.innerHTML = `
    <div class="report-list">
      ${courses.map((course) => {
        const courseGrades = grades.filter((grade) => Number(grade.courseId) === Number(course.id));
        const average = calculateAverage(courseGrades);

        return `
          <div class="report-row">
            <strong>${escapeHtml(course.name)}</strong>
            <div class="meter"><span style="width: ${average}%"></span></div>
            <span>${courseGrades.length ? `${average}%` : "N/A"}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderSubjectReport() {
  const report = document.querySelector("#subjectReport");
  const subjects = [...new Set(grades.map((grade) => grade.subject))].sort((a, b) => a.localeCompare(b));

  if (subjects.length === 0) {
    report.innerHTML = '<p class="empty-state">No subject data available yet.</p>';
    return;
  }

  report.innerHTML = `
    <div class="report-list">
      ${subjects.map((subject) => {
        const subjectGrades = grades.filter((grade) => grade.subject === subject);
        const average = calculateAverage(subjectGrades);

        return `
          <div class="report-row">
            <strong>${escapeHtml(subject)}</strong>
            <div class="meter"><span style="width: ${average}%"></span></div>
            <span>${average}%</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderStudentReport() {
  const report = document.querySelector("#studentReport");

  if (students.length === 0) {
    report.innerHTML = '<p class="empty-state">No student data available yet.</p>';
    return;
  }

  report.innerHTML = `
    <div class="report-list">
      ${students.map((student) => {
        const studentGrades = getGradesForStudent(student.id);
        const average = calculateAverage(studentGrades);

        return `
          <div class="report-row">
            <strong>${escapeHtml(student.name)}</strong>
            <div class="meter"><span style="width: ${average}%"></span></div>
            <span>${studentGrades.length ? `${average}%` : "N/A"}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function generateCourseRecommendations(studentId, options) {
  const student = findStudentById(studentId);
  if (!student) return [];

  const studentGrades = getGradesForStudent(studentId);
  const enrolledCourseIds = getCoursesForStudent(studentId).map((c) => Number(c.id));
  const strengths = computeStudentStrengths(studentId);
  const studentInterests = (student.interests || []).map((i) => i.toLowerCase());
  const totalCredits = getCoursesForStudent(studentId).reduce((sum, c) => sum + (c.credits || 1), 0);

  const availableCourses = courses.filter((c) => !enrolledCourseIds.includes(Number(c.id)));

  const scored = availableCourses.map((course) => {
    let score = 0;
    const reasons = [];

    if (options.matchInterests) {
      const courseSkills = (course.skills || []).map((s) => s.toLowerCase());
      const matchingSkills = courseSkills.filter((s) => studentInterests.includes(s));
      if (matchingSkills.length > 0) {
        const interestScore = (matchingSkills.length / Math.max(courseSkills.length, 1)) * 30;
        score += interestScore;
        reasons.push(`Matches your interests: ${matchingSkills.join(", ")}`);
      }
    }

    if (options.checkPrereqs) {
      const prereqs = course.prerequisites || [];
      if (prereqs.length > 0) {
        const completedPrereqs = prereqs.filter((prereqId) => {
          return studentGrades.some((g) => Number(g.courseId) === prereqId && Number(g.score) >= 60);
        });
        if (completedPrereqs.length === prereqs.length) {
          score += 25;
          reasons.push("All prerequisites completed");
        } else if (completedPrereqs.length > 0) {
          score += 10;
          reasons.push(`${completedPrereqs.length}/${prereqs.length} prerequisites completed`);
        } else {
          score -= 20;
          reasons.push("Prerequisites not met");
        }
      } else {
        score += 5;
        reasons.push("No prerequisites required");
      }
    }

    if (options.usePerformance) {
      const courseCategoryGrades = strengths.find((s) => s.category === course.category);
      if (courseCategoryGrades) {
        if (courseCategoryGrades.average >= 85) {
          score += 20;
          reasons.push(`Strong performance in ${course.category} (${courseCategoryGrades.average}%)`);
        } else if (courseCategoryGrades.average >= 70) {
          score += 10;
          reasons.push(`Good performance in ${course.category} (${courseCategoryGrades.average}%)`);
        } else if (courseCategoryGrades.average >= 60) {
          score += 5;
          reasons.push(`Passing in ${course.category} (${courseCategoryGrades.average}%)`);
        }
      }

      const difficultyLevels = { Beginner: 1, Intermediate: 2, Advanced: 3 };
      const studentAvg = studentGrades.length > 0 ? calculateAverage(studentGrades) : 50;
      const courseDiffLevel = difficultyLevels[course.difficulty] || 1;

      if (studentAvg >= 85 && courseDiffLevel <= 3) {
        score += 15;
        reasons.push("Ready for advanced challenges");
      } else if (studentAvg >= 70 && courseDiffLevel <= 2) {
        score += 10;
        reasons.push("Good fit for your level");
      } else if (studentAvg < 60 && courseDiffLevel === 1) {
        score += 10;
        reasons.push("Beginner-friendly course to build foundation");
      }
    }

    if (options.balanceWorkload) {
      const maxCredits = 15;
      const projectedCredits = totalCredits + (course.credits || 1);
      if (projectedCredits <= maxCredits) {
        score += 10;
        reasons.push(`Fits within credit limit (${projectedCredits}/${maxCredits})`);
      } else {
        score -= 15;
        reasons.push("May overload your schedule");
      }

      const enrolledCategories = getCoursesForStudent(studentId).map((c) => c.category);
      if (!enrolledCategories.includes(course.category)) {
        score += 10;
        reasons.push("Adds diversity to your course mix");
      }
    }

    if (student.careerGoal) {
      const careerKeywords = {
        Engineer: ["STEM", "problem-solving", "algebra", "logical-thinking", "spatial-reasoning"],
        Scientist: ["STEM", "analysis", "scientific-method", "observation"],
        Journalist: ["Humanities", "writing", "critical-reading", "communication", "research"],
        Artist: ["Arts", "creativity", "visual-design", "fine-motor"],
        Doctor: ["STEM", "analysis", "scientific-method", "observation"],
        Lawyer: ["Humanities", "critical-thinking", "writing", "communication", "research"],
        Teacher: ["Humanities", "communication", "critical-thinking", "writing"]
      };

      const keywords = careerKeywords[student.careerGoal] || [];
      const courseTags = [course.category, ...(course.skills || [])].map((t) => t.toLowerCase());
      const careerMatches = keywords.filter((k) => courseTags.includes(k.toLowerCase()));
      if (careerMatches.length > 0) {
        score += 15;
        reasons.push(`Aligns with your career goal: ${student.careerGoal}`);
      }
    }

    return { course, score: Math.round(score), reasons };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

function renderRecommenderOptions() {
  const select = document.querySelector("#recommenderStudent");
  const currentValue = select.value;

  select.innerHTML = `
    <option value="">Choose a student</option>
    ${students.map((student) => `
      <option value="${student.id}">${escapeHtml(student.name)} (${escapeHtml(student.studentId)})</option>
    `).join("")}
  `;

  if (currentValue) select.value = currentValue;
}

function renderRecommenderResults() {
  const container = document.querySelector("#recommenderResults");
  const studentId = document.querySelector("#recommenderStudent").value;

  if (!studentId) {
    container.innerHTML = '<p class="empty-state">Select a student and click "Generate Recommendations" to see AI-powered course suggestions.</p>';
    return;
  }

  const student = findStudentById(studentId);
  if (!student) return;

  const options = {
    matchInterests: document.querySelector("#recMatchInterests").checked,
    checkPrereqs: document.querySelector("#recCheckPrereqs").checked,
    usePerformance: document.querySelector("#recUsePerformance").checked,
    balanceWorkload: document.querySelector("#recBalanceWorkload").checked
  };

  const recommendations = generateCourseRecommendations(studentId, options);

  if (recommendations.length === 0) {
    container.innerHTML = `
      <div class="recommender-summary">
        <h3>Results for ${escapeHtml(student.name)}</h3>
        <p class="empty-state">No course recommendations found. Try adjusting the recommendation options or add more courses.</p>
      </div>
    `;
    return;
  }

  const studentGrades = getGradesForStudent(studentId);
  const avg = studentGrades.length > 0 ? calculateAverage(studentGrades) : null;
  const strengths = computeStudentStrengths(studentId);

  container.innerHTML = `
    <div class="recommender-summary">
      <div class="summary-header">
        <h3>Results for ${escapeHtml(student.name)}</h3>
        <span class="summary-badge">${recommendations.length} course(s) recommended</span>
      </div>

      <div class="summary-stats">
        ${avg !== null ? `<div class="stat-item"><span>Current Average</span><strong>${avg}%</strong></div>` : ""}
        <div class="stat-item"><span>Enrolled Courses</span><strong>${getCoursesForStudent(studentId).length}</strong></div>
        ${strengths.length > 0 ? `<div class="stat-item"><span>Top Strength</span><strong>${escapeHtml(strengths[0].category)}</strong></div>` : ""}
        ${student.careerGoal ? `<div class="stat-item"><span>Career Goal</span><strong>${escapeHtml(student.careerGoal)}</strong></div>` : ""}
      </div>
    </div>

    <div class="recommendation-list">
      ${recommendations.map((rec, index) => `
        <article class="recommendation-card ${index === 0 ? "top-pick" : ""}">
          <div class="rec-header">
            <div class="rec-rank">#${index + 1}</div>
            <div class="rec-course-info">
              <h4>${escapeHtml(rec.course.name)} <span class="rec-code">${escapeHtml(rec.course.code)}</span></h4>
              <div class="rec-meta">
                <span class="rec-category">${escapeHtml(rec.course.category)}</span>
                <span class="rec-difficulty">${escapeHtml(rec.course.difficulty)}</span>
                <span class="rec-credits">${rec.course.credits} credit(s)</span>
                ${index === 0 ? '<span class="top-pick-badge">Top Pick</span>' : ''}
              </div>
            </div>
            <div class="rec-score">
              <div class="score-circle" style="--score: ${Math.min(rec.score, 100)}">
                <span>${rec.score}</span>
              </div>
              <small>Match Score</small>
            </div>
          </div>

          ${rec.course.description ? `<p class="rec-description">${escapeHtml(rec.course.description)}</p>` : ""}

          <div class="rec-reasons">
            <h5>Why this course?</h5>
            <ul>
              ${rec.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}
            </ul>
          </div>

          ${rec.course.teacher ? `<p class="rec-teacher">Teacher: ${escapeHtml(rec.course.teacher)} ${rec.course.period ? "&middot; " + escapeHtml(rec.course.period) : ""} ${rec.course.room ? "&middot; " + escapeHtml(rec.course.room) : ""}</p>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function renderReports() {
  renderCourseReport();
  renderSubjectReport();
  renderStudentReport();
}

function renderApp() {
  renderDashboard();
  renderCourseStudentOptions();
  renderCoursePrerequisiteOptions();
  renderCourses();
  renderStudents();
  renderStudentOptions();
  renderCourseOptions();
  renderStudentProfileOptions();
  renderSubjectFilter();
  renderCourseFilter();
  renderGrades();
  renderStudentProfile();
  renderReports();
  renderRecommenderOptions();
}

function resetCourseForm() {
  courseForm.reset();
  document.querySelector("#editingCourseId").value = "";
  document.querySelector("#saveCourseButton").textContent = "Add Course";
  document.querySelector("#cancelCourseEditButton").hidden = true;
  document.querySelector("#courseCredits").value = "3";
  renderCoursePrerequisiteOptions();
}

function resetStudentForm() {
  studentForm.reset();
  document.querySelector("#editingStudentId").value = "";
  document.querySelector("#saveStudentButton").textContent = "Add Student";
  document.querySelector("#cancelStudentEditButton").hidden = true;
}

function resetGradeForm() {
  gradeForm.reset();
  document.querySelector("#editingGradeId").value = "";
  document.querySelector("#saveGradeButton").textContent = "Save Grade";
  document.querySelector("#cancelGradeEditButton").hidden = true;
}

async function handleCourseSubmit(event) {
  event.preventDefault();

  const editingCourseId = document.querySelector("#editingCourseId").value;
  const name = document.querySelector("#courseName").value.trim();
  const code = document.querySelector("#courseCode").value.trim();
  const teacher = document.querySelector("#courseTeacher").value.trim();
  const period = document.querySelector("#coursePeriod").value.trim();
  const room = document.querySelector("#courseRoom").value.trim();
  const term = document.querySelector("#courseTerm").value.trim();
  const category = document.querySelector("#courseCategory").value;
  const difficulty = document.querySelector("#courseDifficulty").value;
  const credits = Number(document.querySelector("#courseCredits").value) || 3;
  const prerequisites = getSelectedValues(document.querySelector("#coursePrerequisites"));
  const description = document.querySelector("#courseDescription").value.trim();
  const skillsInput = document.querySelector("#courseSkills").value.trim();
  const skills = skillsInput ? skillsInput.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) : [];
  const studentIds = getSelectedValues(document.querySelector("#courseStudents"));

  if (!name || !code) {
    showToast("Please enter the course name and course code.");
    return;
  }

  try {
    if (editingCourseId) {
      const updated = await api.updateCourse(editingCourseId, {
        name, teacher, period, room, term, category, difficulty, credits,
        prerequisites, description, skills, studentIds,
      });
      courses = courses.map((course) =>
        Number(course.id) === Number(editingCourseId) ? { ...course, ...updated } : course
      );
      showToast("Course updated.");
    } else {
      const created = await api.createCourse({
        code, name, teacher, period, room, term, category, difficulty,
        credits, prerequisites, description, skills, studentIds,
      });
      courses.push(created);
      showToast("Course added.");
    }

    resetCourseForm();
    cacheToLocal();
    renderApp();
  } catch (err) {
    showToast(err.message);
  }
}

  const duplicateCode = courses.some((course) =>
    course.code.toLowerCase() === code.toLowerCase() &&
    Number(course.id) !== Number(editingCourseId)
  );

  if (duplicateCode) {
    showToast("That course code is already in use.");
    return;
  }

  if (editingCourseId) {
    courses = courses.map((course) => {
      if (Number(course.id) !== Number(editingCourseId)) return course;
      return { ...course, name, code, teacher, period, room, term, category, difficulty, credits, prerequisites, description, skills, studentIds };
    });
    showToast("Course updated.");
  } else {
    courses.push({ id: createId(), name, code, teacher, period, room, term, category, difficulty, credits, prerequisites, description, skills, studentIds });
    showToast("Course added.");
  }

  resetCourseForm();
  cacheToLocal();
  renderApp();
}

async function handleStudentSubmit(event) {
  event.preventDefault();

  const editingStudentId = document.querySelector("#editingStudentId").value;
  const name = document.querySelector("#studentName").value.trim();
  const studentId = document.querySelector("#studentCode").value.trim();
  const className = document.querySelector("#studentClass").value.trim();
  const email = document.querySelector("#studentEmail").value.trim();
  const interestsInput = document.querySelector("#studentInterests").value.trim();
  const interests = interestsInput ? interestsInput.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean) : [];
  const careerGoal = document.querySelector("#studentCareerGoal").value.trim();

  if (!name || !studentId || !className) {
    showToast("Please enter the student name, student ID, and grade level.");
    return;
  }

  try {
    if (editingStudentId) {
      const updated = await api.updateStudent(editingStudentId, {
        name, className, email, interests, careerGoal,
      });
      students = students.map((s) =>
        Number(s.id) === Number(editingStudentId) ? { ...s, ...updated } : s
      );
      showToast("Student updated.");
    } else {
      const created = await api.createStudent({
        studentId, name, className, email, interests, careerGoal,
      });
      students.push(created);
      showToast("Student added.");
    }

    resetStudentForm();
    cacheToLocal();
    renderApp();
  } catch (err) {
    showToast(err.message);
  }
}

  const duplicateStudentId = students.some((student) =>
    student.studentId.toLowerCase() === studentId.toLowerCase() &&
    Number(student.id) !== Number(editingStudentId)
  );

  if (duplicateStudentId) {
    showToast("That student ID is already in use.");
    return;
  }

  if (editingStudentId) {
    students = students.map((student) => {
      if (Number(student.id) !== Number(editingStudentId)) return student;
      return { ...student, name, studentId, className, email, interests, careerGoal };
    });
    showToast("Student updated.");
  } else {
    students.push({ id: createId(), studentId, name, className, email, interests, careerGoal });
    showToast("Student added.");
  }

  resetStudentForm();
  cacheToLocal();
  renderApp();
}

async function handleGradeSubmit(event) {
  event.preventDefault();

  const editingGradeId = document.querySelector("#editingGradeId").value;
  const studentId = Number(document.querySelector("#gradeStudent").value);
  const courseId = Number(document.querySelector("#gradeCourse").value);
  const subject = document.querySelector("#gradeSubject").value.trim();
  const type = document.querySelector("#gradeType").value;
  const score = Number(document.querySelector("#gradeScore").value);
  const date = document.querySelector("#gradeDate").value;

  if (!studentId) {
    showToast("Please select a student.");
    return;
  }

  if (!courseId) {
    showToast("Please select a course.");
    return;
  }

  if (!subject) {
    showToast("Please enter a subject.");
    return;
  }

  if (Number.isNaN(score) || score < 0 || score > 100) {
    showToast("Score must be a number from 0 to 100.");
    return;
  }

  if (!date) {
    showToast("Please select a date.");
    return;
  }

  if (!editingGradeId) {
    const course = findCourseById(courseId);
    if (course && !course.studentIds.map(Number).includes(studentId)) {
      course.studentIds.push(studentId);
    }
  }

  try {
    if (editingGradeId) {
      const updated = await api.updateGrade(editingGradeId, {
        studentId, courseId, subject, type, score, date,
      });
      grades = grades.map((g) =>
        Number(g.id) === Number(editingGradeId) ? { ...g, ...updated } : g
      );
      showToast("Grade updated.");
    } else {
      const created = await api.createGrade({
        studentId, courseId, subject, type, score, date,
      });
      grades.push(created);

      const course = findCourseById(courseId);
      if (course && !course.studentIds.map(Number).includes(studentId)) {
        course.studentIds.push(studentId);
      }

      showToast("Grade saved.");
    }

    resetGradeForm();
    cacheToLocal();
    renderApp();
  } catch (err) {
    showToast(err.message);
  }
}

  if (!courseId) {
    showToast("Please select a course.");
    return;
  }

  if (!subject) {
    showToast("Please enter a subject.");
    return;
  }

  if (Number.isNaN(score) || score < 0 || score > 100) {
    showToast("Score must be a number from 0 to 100.");
    return;
  }

  if (!date) {
    showToast("Please select a date.");
    return;
  }

  const course = findCourseById(courseId);

  if (course && !course.studentIds.map(Number).includes(studentId)) {
    course.studentIds.push(studentId);
  }

  if (editingGradeId) {
    grades = grades.map((grade) => {
      if (Number(grade.id) !== Number(editingGradeId)) return grade;
      return { ...grade, studentId, courseId, subject, type, score, date };
    });
    showToast("Grade updated.");
  } else {
    grades.push({ id: createId(), studentId, courseId, subject, type, score, date });
    showToast("Grade saved.");
  }

  resetGradeForm();
  cacheToLocal();
  renderApp();
}

function editCourse(courseId) {
  const course = findCourseById(courseId);

  if (!course) {
    showToast("Course not found.");
    return;
  }

  renderCoursePrerequisiteOptions(courseId);

  document.querySelector("#editingCourseId").value = course.id;
  document.querySelector("#courseName").value = course.name;
  document.querySelector("#courseCode").value = course.code;
  document.querySelector("#courseTeacher").value = course.teacher || "";
  document.querySelector("#coursePeriod").value = course.period || "";
  document.querySelector("#courseRoom").value = course.room || "";
  document.querySelector("#courseTerm").value = course.term || "";
  document.querySelector("#courseCategory").value = course.category || "General";
  document.querySelector("#courseDifficulty").value = course.difficulty || "Beginner";
  document.querySelector("#courseCredits").value = course.credits || 3;
  document.querySelector("#courseDescription").value = course.description || "";
  document.querySelector("#courseSkills").value = (course.skills || []).join(", ");
  Array.from(document.querySelector("#coursePrerequisites").options).forEach((option) => {
    option.selected = (course.prerequisites || []).map(Number).includes(Number(option.value));
  });
  Array.from(document.querySelector("#courseStudents").options).forEach((option) => {
    option.selected = course.studentIds.map(Number).includes(Number(option.value));
  });
  document.querySelector("#saveCourseButton").textContent = "Update Course";
  document.querySelector("#cancelCourseEditButton").hidden = false;
  document.querySelector("#courseName").focus();
}

async function deleteCourse(courseId) {
  const course = findCourseById(courseId);

  if (!course) {
    showToast("Course not found.");
    return;
  }

  const relatedGrades = grades.filter((grade) => Number(grade.courseId) === Number(courseId)).length;

  if (relatedGrades > 0) {
    showToast("Delete or reassign this course's grades before deleting the course.");
    return;
  }

  if (!window.confirm(`Delete ${course.name}?`)) return;

  try {
    await api.deleteCourse(courseId);
    courses = courses.filter((item) => Number(item.id) !== Number(courseId));
    resetCourseForm();
    cacheToLocal();
    renderApp();
    showToast("Course deleted.");
  } catch (err) {
    showToast(err.message);
  }
}

  const relatedGrades = grades.filter((grade) => Number(grade.courseId) === Number(courseId)).length;

  if (relatedGrades > 0) {
    showToast("Delete or reassign this course's grades before deleting the course.");
    return;
  }

  if (!window.confirm(`Delete ${course.name}?`)) return;

  courses = courses.filter((item) => Number(item.id) !== Number(courseId));
  resetCourseForm();
  cacheToLocal();
  renderApp();
  showToast("Course deleted.");
}

function editStudent(studentId) {
  const student = findStudentById(studentId);

  if (!student) {
    showToast("Student not found.");
    return;
  }

  document.querySelector("#editingStudentId").value = student.id;
  document.querySelector("#studentName").value = student.name;
  document.querySelector("#studentCode").value = student.studentId;
  document.querySelector("#studentClass").value = student.className;
  document.querySelector("#studentEmail").value = student.email || "";
  document.querySelector("#studentInterests").value = (student.interests || []).join(", ");
  document.querySelector("#studentCareerGoal").value = student.careerGoal || "";
  document.querySelector("#saveStudentButton").textContent = "Update Student";
  document.querySelector("#cancelStudentEditButton").hidden = false;
  document.querySelector("#studentName").focus();
}

async function deleteStudent(studentId) {
  const student = findStudentById(studentId);

  if (!student) {
    showToast("Student not found.");
    return;
  }

  const relatedGrades = getGradesForStudent(studentId).length;
  const message = relatedGrades > 0
    ? `Delete ${student.name} and ${relatedGrades} related grade record(s)?`
    : `Delete ${student.name}?`;

  if (!window.confirm(message)) return;

  try {
    await api.deleteStudent(studentId);
    students = students.filter((item) => Number(item.id) !== Number(studentId));
    grades = grades.filter((grade) => Number(grade.studentId) !== Number(studentId));
    courses = courses.map((course) => ({
      ...course,
      studentIds: course.studentIds.filter((id) => Number(id) !== Number(studentId))
    }));
    resetStudentForm();
    resetGradeForm();
    cacheToLocal();
    renderApp();
    showToast("Student deleted.");
  } catch (err) {
    showToast(err.message);
  }
}

function editGrade(gradeId) {
  const grade = grades.find((item) => Number(item.id) === Number(gradeId));

  if (!grade) {
    showToast("Grade not found.");
    return;
  }

  document.querySelector("#editingGradeId").value = grade.id;
  document.querySelector("#gradeStudent").value = grade.studentId;
  document.querySelector("#gradeCourse").value = grade.courseId || "";
  document.querySelector("#gradeSubject").value = grade.subject;
  document.querySelector("#gradeType").value = grade.type;
  document.querySelector("#gradeScore").value = grade.score;
  document.querySelector("#gradeDate").value = grade.date;
  document.querySelector("#saveGradeButton").textContent = "Update Grade";
  document.querySelector("#cancelGradeEditButton").hidden = false;
  document.querySelector("#gradeCourse").focus();
}

async function deleteGrade(gradeId) {
  const grade = grades.find((item) => Number(item.id) === Number(gradeId));

  if (!grade) {
    showToast("Grade not found.");
    return;
  }

  if (!window.confirm("Delete this grade?")) return;

  try {
    await api.deleteGrade(gradeId);
    grades = grades.filter((item) => Number(item.id) !== Number(gradeId));
    resetGradeForm();
    cacheToLocal();
    renderApp();
    showToast("Grade deleted.");
  } catch (err) {
    showToast(err.message);
  }
}

async function seedDemoData() {
  try {
    for (const s of demoStudents) {
      const created = await api.createStudent(s);
      const idx = students.findIndex(st => Number(st.id) === Number(s.id) || st.studentId === s.studentId);
      if (idx >= 0) students[idx] = created;
      else students.push(created);
    }
    const idMap = {};
    demoCourses.forEach((dc, i) => { idMap[dc.id] = i + 1; });
    for (const c of demoCourses) {
      const mapped = {
        ...c,
        prerequisites: (c.prerequisites || []).map(p => demoCourses.find(dc => dc.id === p)?.id || p),
        studentIds: (c.studentIds || []).map(sid => {
          const s = demoStudents.find(ds => ds.id === sid);
          const match = students.find(st => st.studentId === s?.studentId);
          return match ? match.id : sid;
        }),
      };
      const created = await api.createCourse(mapped);
      courses.push(created);
    }
    for (const g of demoGrades) {
      const studentMatch = students.find(s => s.studentId === demoStudents.find(ds => ds.id === g.studentId)?.studentId);
      const courseMatch = courses.find(c => c.code === demoCourses.find(dc => dc.id === g.courseId)?.code);
      const created = await api.createGrade({
        studentId: studentMatch?.id || g.studentId,
        courseId: courseMatch?.id || g.courseId,
        subject: g.subject,
        type: g.type,
        score: g.score,
        date: g.date,
      });
      grades.push(created);
    }
    cacheToLocal();
    renderApp();
    showToast("Demo data loaded.");
  } catch (err) {
    showToast("Error seeding data: " + err.message);
  }
}

function resetDemoData() {
  if (!window.confirm("Reset the app back to demo data? This replaces current records.")) return;
  students = [];
  courses = [];
  grades = [];
  cacheToLocal();
  seedDemoData();
}

function switchPage(pageId, shouldUpdateHash = true) {
  const fallbackPage = "dashboard-page";
  const targetPage = document.querySelector(`[data-page="${pageId}"]`) ? pageId : fallbackPage;

  document.querySelectorAll("[data-page]").forEach((page) => {
    page.classList.toggle("active", page.dataset.page === targetPage);
  });

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === targetPage);
  });

  if (shouldUpdateHash && window.location.hash !== `#${targetPage}`) {
    history.pushState(null, "", `#${targetPage}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getPageFromHash() {
  const hash = window.location.hash.replace("#", "");
  return document.querySelector(`[data-page="${hash}"]`) ? hash : "dashboard-page";
}

// ====== Auth ======
function showAuthPage() {
  document.getElementById("authPage").style.display = "";
  document.getElementById("appRoot").style.display = "none";
}

function showAppPage() {
  document.getElementById("authPage").style.display = "none";
  document.getElementById("appRoot").style.display = "";
}

function setServerUrl(url) {
  localStorage.setItem('api_base_url', url);
}

async function initializeAuth() {
  const urlInput = document.getElementById("authServerUrl");
  const storedUrl = localStorage.getItem('api_base_url');
  if (urlInput && storedUrl) urlInput.value = storedUrl;

  if (!api.token) {
    showAuthPage();
    return false;
  }

  try {
    const user = await api.getCurrentUser();
    const nameEl = document.getElementById("headerUsername");
    if (nameEl) nameEl.textContent = user.full_name || user.username;
    const termEl = document.getElementById("headerTerm");
    if (termEl) termEl.textContent = `Spring Term 2026 · ${user.username}`;
    return true;
  } catch {
    api.token = null;
    localStorage.removeItem('api_token');
    showAuthPage();
    return false;
  }
}

function isDemoDataEmpty() {
  return !students.length && !courses.length && !grades.length;
}

async function initializeApp() {
  const authed = await initializeAuth();
  if (!authed) return;

  const loaded = await fetchFromApi();
  if (!loaded) loadFromCacheOrDemo();

  showAppPage();
}

// ====== Auth Event Handlers ======
document.addEventListener("DOMContentLoaded", () => {
  const authPage = document.getElementById("authPage");
  const appRoot = document.getElementById("appRoot");

  if (!authPage || !appRoot) return;

  // Toggle login/register
  const toggleLogin = document.getElementById("authToggleLogin");
  const toggleRegister = document.getElementById("authToggleRegister");
  const loginFields = document.getElementById("authLoginFields");
  const registerFields = document.getElementById("authRegisterFields");
  const authError = document.getElementById("authError");

  if (toggleLogin) {
    toggleLogin.addEventListener("click", () => {
      toggleLogin.classList.add("active");
      toggleRegister.classList.remove("active");
      loginFields.style.display = "";
      registerFields.style.display = "none";
      authError.classList.remove("visible");
    });
  }

  if (toggleRegister) {
    toggleRegister.addEventListener("click", () => {
      toggleRegister.classList.add("active");
      toggleLogin.classList.remove("active");
      loginFields.style.display = "none";
      registerFields.style.display = "";
      authError.classList.remove("visible");
    });
  }

  // Server URL
  const serverUrlInput = document.getElementById("authServerUrl");
  if (serverUrlInput) {
    serverUrlInput.addEventListener("change", () => setServerUrl(serverUrlInput.value));
  }

  // Auth form (handles both login and register)
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const isRegister = registerFields.style.display !== "none";
      const urlInput = document.getElementById("authServerUrl");
      setServerUrl(urlInput.value);

      try {
        if (isRegister) {
          const name = document.getElementById("registerName").value.trim();
          const username = document.getElementById("registerUsername").value.trim();
          const email = document.getElementById("registerEmail").value.trim();
          const password = document.getElementById("registerPassword").value;
          if (!username || !email || !password) return;
          await api.register(username, email, password, name);
          await api.login(username, password);
        } else {
          const username = document.getElementById("loginUsername").value.trim();
          const password = document.getElementById("loginPassword").value;
          if (!username || !password) return;
          await api.login(username, password);
        }
        authError.classList.remove("visible");
        await initializeApp();
        if (isRegister && !students.length && !courses.length && !grades.length) {
          seedDemoData();
        }
      } catch (err) {
        authError.textContent = err.message;
        authError.classList.add("visible");
      }
    });
  }

  // Logout
  const logoutBtn = document.getElementById("logoutButton");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      api.logout();
      showAuthPage();
    });
  }

  // Unauthorized handler
  window._onUnauthorized = () => {
    showAuthPage();
  };
});

courseForm.addEventListener("submit", handleCourseSubmit);
studentForm.addEventListener("submit", handleStudentSubmit);
gradeForm.addEventListener("submit", handleGradeSubmit);

document.querySelector("#cancelCourseEditButton").addEventListener("click", resetCourseForm);
document.querySelector("#cancelStudentEditButton").addEventListener("click", resetStudentForm);
document.querySelector("#cancelGradeEditButton").addEventListener("click", resetGradeForm);
document.querySelector("#resetDemoButton").addEventListener("click", resetDemoData);

document.querySelectorAll("[data-page-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    switchPage(link.dataset.pageLink);
  });
});

window.addEventListener("hashchange", () => {
  switchPage(getPageFromHash(), false);
});

document.querySelector("#courseTable").addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  if (button.dataset.action === "edit-course") editCourse(id);
  if (button.dataset.action === "delete-course") await deleteCourse(id);
});

document.querySelector("#studentTable").addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  if (button.dataset.action === "edit-student") editStudent(id);
  if (button.dataset.action === "view-student") {
    document.querySelector("#studentProfileSearch").value = "";
    renderStudentProfileOptions();
    document.querySelector("#studentProfileSelect").value = id;
    renderStudentProfile();
    switchPage("students-page");
    document.querySelector("#studentProfile").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (button.dataset.action === "delete-student") await deleteStudent(id);
});

document.querySelector("#gradeTable").addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  if (button.dataset.action === "edit-grade") editGrade(id);
  if (button.dataset.action === "delete-grade") await deleteGrade(id);
});

document.querySelector("#searchGrades").addEventListener("input", renderGrades);
document.querySelector("#statusFilter").addEventListener("change", renderGrades);
document.querySelector("#subjectFilter").addEventListener("change", renderGrades);
document.querySelector("#courseFilter").addEventListener("change", renderGrades);
document.querySelector("#sortGrades").addEventListener("change", renderGrades);
document.querySelector("#studentProfileSearch").addEventListener("input", () => {
  const matchedStudents = getStudentProfileMatches();
  const select = document.querySelector("#studentProfileSelect");

  renderStudentProfileOptions();
  select.value = matchedStudents.length >= 1 && document.querySelector("#studentProfileSearch").value.trim()
    ? matchedStudents[0].id
    : "";
  renderStudentProfile();
});
document.querySelector("#studentProfileSelect").addEventListener("change", renderStudentProfile);

document.querySelector("#generateRecommendations").addEventListener("click", renderRecommenderResults);
document.querySelector("#recommenderStudent").addEventListener("change", renderRecommenderResults);

// Init app
(async () => {
  await initializeApp();

  if (api.token) {
    renderApp();
    switchPage(getPageFromHash(), false);

    const aiChat = createAIChat(() => ({ students, courses, grades }));
    aiChat.init({ mobile: false });
  }
})();
