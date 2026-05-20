const CACHE_KEY = "schoolGradingSystemData";

const demoStudents = [
  { id: 1, studentId: "S001", name: "Ava Johnson", className: "Grade 8", email: "ava@example.com", interests: ["problem-solving", "creativity"], careerGoal: "Engineer" },
  { id: 2, studentId: "S002", name: "Noah Smith", className: "Grade 8", email: "noah@example.com", interests: ["analysis", "scientific-method"], careerGoal: "Scientist" },
  { id: 3, studentId: "S003", name: "Mia Chen", className: "Grade 7", email: "mia@example.com", interests: ["writing", "critical-reading"], careerGoal: "Journalist" }
];

const demoCourses = [
  { id: 201, code: "MATH-801", name: "Algebra 1", teacher: "Ms. Rivera", period: "Period 2", room: "Room 204", term: "Spring 2026", category: "STEM", difficulty: "Intermediate", credits: 3, prerequisites: [], description: "Introduction to algebraic concepts including equations, inequalities, and functions.", skills: ["problem-solving", "logical-thinking", "algebra"], studentIds: [1, 2] },
  { id: 202, code: "SCI-801", name: "Life Science", teacher: "Mr. Bennett", period: "Period 4", room: "Lab 3", term: "Spring 2026", category: "STEM", difficulty: "Beginner", credits: 3, prerequisites: [], description: "Study of living organisms, ecosystems, and biological processes.", skills: ["analysis", "observation", "scientific-method"], studentIds: [2, 3] },
  { id: 203, code: "ELA-701", name: "English Language Arts", teacher: "Mrs. Patel", period: "Period 1", room: "Room 118", term: "Spring 2026", category: "Humanities", difficulty: "Intermediate", credits: 2, prerequisites: [], description: "Reading comprehension, writing, grammar, and literature analysis.", skills: ["writing", "critical-reading", "communication"], studentIds: [1, 3] },
  { id: 204, code: "MATH-802", name: "Geometry", teacher: "Ms. Rivera", period: "Period 3", room: "Room 204", term: "Spring 2026", category: "STEM", difficulty: "Advanced", credits: 3, prerequisites: [201], description: "Study of shapes, angles, proofs, and spatial reasoning.", skills: ["spatial-reasoning", "proofs", "algebra"], studentIds: [] },
  { id: 205, code: "ART-701", name: "Visual Arts", teacher: "Ms. Torres", period: "Period 5", room: "Art Studio", term: "Spring 2026", category: "Arts", difficulty: "Beginner", credits: 1, prerequisites: [], description: "Introduction to drawing, painting, and creative expression.", skills: ["creativity", "visual-design", "fine-motor"], studentIds: [1] },
  { id: 206, code: "SOC-701", name: "World History", teacher: "Mr. Davis", period: "Period 6", room: "Room 310", term: "Spring 2026", category: "Social Science", difficulty: "Beginner", credits: 2, prerequisites: [], description: "Survey of major world civilizations and historical events.", skills: ["research", "critical-thinking", "writing"], studentIds: [] }
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

function cloneData(data) { return JSON.parse(JSON.stringify(data)); }
function createId() { return Date.now() + Math.floor(Math.random() * 1000); }

function escapeHtml(v) {
  return String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove("show"), 2200);
}

function cacheToLocal() { try { localStorage.setItem(CACHE_KEY, JSON.stringify({ students, courses, grades })); } catch {} }

function loadFromLocalCache() {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) normalizeLoaded(JSON.parse(saved));
  } catch {}
}

function findStudent(id) { return students.find(s => Number(s.id) === Number(id)); }
function findCourse(id) { return courses.find(c => Number(c.id) === Number(id)); }
function gradesForStudent(sid) { return grades.filter(g => Number(g.studentId) === Number(sid)); }
function coursesForStudent(sid) { return courses.filter(c => c.studentIds.map(Number).includes(Number(sid))); }

function letterGrade(s) { if (s >= 90) return "A"; if (s >= 80) return "B"; if (s >= 70) return "C"; if (s >= 60) return "D"; return "F"; }
function passFail(s) { return s >= 60 ? "Pass" : "Fail"; }
function avg(items) { if (!items.length) return 0; return Math.round(items.reduce((a, b) => a + Number(b.score), 0) / items.length); }

function normalizeLoaded(parsed) {
  students = Array.isArray(parsed.students) ? parsed.students : cloneData(demoStudents);
  courses = Array.isArray(parsed.courses) && parsed.courses.length ? parsed.courses : cloneData(demoCourses);
  grades = Array.isArray(parsed.grades) ? parsed.grades : cloneData(demoGrades);
  courses = courses.map(c => ({ ...c, prerequisites: Array.isArray(c.prerequisites) ? c.prerequisites.map(Number) : [], skills: Array.isArray(c.skills) ? c.skills : [], studentIds: Array.isArray(c.studentIds) ? c.studentIds.map(Number) : [] }));
  students = students.map(s => ({ ...s, interests: Array.isArray(s.interests) ? s.interests : [], careerGoal: s.careerGoal || "" }));
  grades.forEach(g => { const c = findCourse(g.courseId); if (c && !c.studentIds.map(Number).includes(Number(g.studentId))) c.studentIds.push(Number(g.studentId)); });
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
  } catch { return false; }
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

function computeStrengths(sid) {
  const sg = gradesForStudent(sid);
  if (!sg.length) return [];
  const cats = {};
  sg.forEach(g => { const c = findCourse(g.courseId); if (!c) return; const cat = c.category || "General"; if (!cats[cat]) cats[cat] = []; cats[cat].push(Number(g.score)); });
  return Object.entries(cats).map(([cat, scores]) => ({ category: cat, average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) })).sort((a, b) => b.average - a.average);
}

// ====== Data Analysis ======
function dashboardSummary() {
  if (!students.length && !courses.length && !grades.length) return { text: "No data yet.", type: "empty" };
  const a = grades.length ? avg(grades) : null;
  const passing = grades.filter(g => Number(g.score) >= 60).length;
  const failing = grades.length - passing;
  const rate = grades.length ? Math.round((passing / grades.length) * 100) : 0;
  const enrolled = [...new Set(courses.flatMap(c => c.studentIds))];
  const unenrolled = students.filter(s => !enrolled.includes(Number(s.id)));
  let t = `${students.length} student${students.length === 1 ? "" : "s"}, ${courses.length} course${courses.length === 1 ? "" : "s"}, ${grades.length} grade${grades.length === 1 ? "" : "s"}.`;
  if (a !== null) {
    const tone = a >= 80 ? "strong" : a >= 70 ? "solid" : a >= 60 ? "moderate" : "concerning";
    t += ` Average ${a}% (${tone}) with ${rate}% pass rate.`;
  }
  if (unenrolled.length) t += ` ${unenrolled.length} student${unenrolled.length === 1 ? "" : "s"} not enrolled.`;
  return { text: t, type: a !== null && a < 60 ? "warning" : "normal" };
}

function smartAlerts() {
  const alerts = [];
  const atRisk = [];
  students.forEach(s => {
    const sg = gradesForStudent(s.id);
    if (!sg.length) { alerts.push({ type: "info", message: `${s.name} has no grades yet.` }); return; }
    const failing = sg.filter(g => Number(g.score) < 60);
    if (failing.length) {
      const names = [...new Set(failing.map(g => { const c = findCourse(g.courseId); return c ? c.name : g.subject; }))];
      atRisk.push({ name: s.name, count: failing.length, courses: names });
    }
  });
  atRisk.forEach(s => alerts.push({ type: "danger", message: `${s.name} — ${s.count} failing grade(s) in ${s.courses.join(", ")}.` }));
  courses.forEach(c => {
    const cg = grades.filter(g => Number(g.courseId) === Number(c.id));
    if (!cg.length) return;
    const fr = cg.filter(g => Number(g.score) < 60).length / cg.length;
    if (fr > 0.5) alerts.push({ type: "danger", message: `${c.name} has ${Math.round(fr * 100)}% failure rate.` });
  });
  const enrolled = [...new Set(courses.flatMap(c => c.studentIds.map(Number)))];
  students.filter(s => !enrolled.includes(Number(s.id))).forEach(s => alerts.push({ type: "warning", message: `${s.name} not enrolled in any courses.` }));
  const recent = grades.filter(g => (new Date() - new Date(g.date)) / (1000 * 60 * 60 * 24) <= 7);
  if (recent.length) alerts.push({ type: "info", message: `${recent.length} grade(s) in last 7 days.` });
  students.forEach(s => {
    const sg = gradesForStudent(s.id).sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sg.length < 2) return;
    const mid = Math.ceil(sg.length / 2);
    const first = sg.slice(0, mid), second = sg.slice(mid);
    const fAvg = avg(first), sAvg = avg(second);
    const drop = fAvg - sAvg;
    if (drop >= 15) alerts.push({ type: "danger", message: `${s.name}'s grades dropped ${Math.round(drop)}% (${fAvg}% → ${sAvg}%).` });
    else if (drop >= 5) alerts.push({ type: "warning", message: `${s.name} slight decline (${fAvg}% → ${sAvg}%).` });
    else if (sAvg - fAvg >= 10) alerts.push({ type: "success", message: `${s.name} improving! Up ${Math.round(sAvg - fAvg)}%.` });
  });
  return alerts;
}

function trendAnalysis() {
  if (!grades.length) return [];
  const trends = [];
  const catData = {};
  grades.forEach(g => { const c = findCourse(g.courseId); if (!c) return; const cat = c.category || "General"; if (!catData[cat]) catData[cat] = []; catData[cat].push(Number(g.score)); });
  if (Object.keys(catData).length) {
    const cats = Object.entries(catData).map(([cat, scores]) => ({ category: cat, average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length), count: scores.length })).sort((a, b) => b.average - a.average);
    trends.push({ type: "category", data: cats });
  }
  const typeData = {};
  grades.forEach(g => { if (!typeData[g.type]) typeData[g.type] = []; typeData[g.type].push(Number(g.score)); });
  if (Object.keys(typeData).length) {
    const types = Object.entries(typeData).map(([t, scores]) => ({ type: t, average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) })).sort((a, b) => b.average - a.average);
    trends.push({ type: "gradeType", data: types });
  }
  const sorted = [...grades].sort((a, b) => new Date(a.date) - new Date(b.date));
  if (sorted.length >= 2) {
    const mid = Math.floor(sorted.length / 2);
    const e = sorted.slice(0, mid), l = sorted.slice(mid);
    trends.push({ type: "overTime", earlier: avg(e), later: avg(l), change: avg(l) - avg(e) });
  }
  return trends;
}

function generatePredictions() {
  if (!grades.length) return [];
  const preds = [];
  students.forEach(s => {
    const sg = gradesForStudent(s.id);
    if (!sg.length) return;
    const a = avg(sg);
    if (a >= 90) preds.push({ student: s.name, message: `${s.name} on track for honors (${a}%).`, level: "success" });
    else if (a >= 80) preds.push({ student: s.name, message: `${s.name} performing well (${a}%).`, level: "info" });
    else if (a >= 60) preds.push({ student: s.name, message: `${s.name} passing (${a}%) but needs support.`, level: "warning" });
    else preds.push({ student: s.name, message: `${s.name} at risk (${a}%). Intervention needed.`, level: "danger" });
    const worst = sg.reduce((min, g) => Number(g.score) < Number(min.score) ? g : min);
    if (Number(worst.score) < 60) {
      const c = findCourse(worst.courseId);
      preds.push({ student: s.name, message: `${s.name} needs improvement in ${c ? c.name : worst.subject}.`, level: "danger" });
    }
  });
  return preds;
}

function recommendations(studentId, opts) {
  const student = findStudent(studentId);
  if (!student) return [];
  const sg = gradesForStudent(studentId);
  const enrolledIds = coursesForStudent(studentId).map(c => Number(c.id));
  const strengths = computeStrengths(studentId);
  const interests = (student.interests || []).map(i => i.toLowerCase());
  const totalCredits = coursesForStudent(studentId).reduce((s, c) => s + (c.credits || 1), 0);
  const available = courses.filter(c => !enrolledIds.includes(Number(c.id)));

  const scored = available.map(course => {
    let score = 0;
    const reasons = [];
    if (opts.matchInterests) {
      const cs = (course.skills || []).map(s => s.toLowerCase());
      const match = cs.filter(s => interests.includes(s));
      if (match.length) { score += (match.length / Math.max(cs.length, 1)) * 30; reasons.push(`Matches interests: ${match.join(", ")}`); }
    }
    if (opts.checkPrereqs) {
      const prereqs = course.prerequisites || [];
      if (prereqs.length) {
        const done = prereqs.filter(pid => sg.some(g => Number(g.courseId) === pid && Number(g.score) >= 60));
        if (done.length === prereqs.length) { score += 25; reasons.push("All prerequisites completed"); }
        else if (done.length) { score += 10; reasons.push(`${done.length}/${prereqs.length} prerequisites done`); }
        else { score -= 20; reasons.push("Prerequisites not met"); }
      } else { score += 5; reasons.push("No prerequisites required"); }
    }
    if (opts.usePerformance) {
      const catS = strengths.find(s => s.category === course.category);
      if (catS) { if (catS.average >= 85) { score += 20; reasons.push(`Strong in ${course.category} (${catS.average}%)`); } else if (catS.average >= 70) { score += 10; reasons.push(`Good in ${course.category} (${catS.average}%)`); } else if (catS.average >= 60) { score += 5; reasons.push(`Passing in ${course.category} (${catS.average}%)`); } }
      const diff = { Beginner: 1, Intermediate: 2, Advanced: 3 };
      const sAvg = sg.length ? avg(sg) : 50;
      const cDiff = diff[course.difficulty] || 1;
      if (sAvg >= 85 && cDiff <= 3) { score += 15; reasons.push("Ready for advanced challenges"); }
      else if (sAvg >= 70 && cDiff <= 2) { score += 10; reasons.push("Good fit for your level"); }
      else if (sAvg < 60 && cDiff === 1) { score += 10; reasons.push("Beginner-friendly course"); }
    }
    if (opts.balanceWorkload) {
      const max = 15;
      const proj = totalCredits + (course.credits || 1);
      if (proj <= max) { score += 10; reasons.push(`Fits within credit limit (${proj}/${max})`); }
      else { score -= 15; reasons.push("May overload schedule"); }
      const enrolledCats = coursesForStudent(studentId).map(c => c.category);
      if (!enrolledCats.includes(course.category)) { score += 10; reasons.push("Adds diversity to course mix"); }
    }
    if (student.careerGoal) {
      const keywords = { Engineer: ["STEM", "problem-solving", "algebra", "logical-thinking", "spatial-reasoning"], Scientist: ["STEM", "analysis", "scientific-method", "observation"], Journalist: ["Humanities", "writing", "critical-reading", "communication", "research"], Artist: ["Arts", "creativity", "visual-design", "fine-motor"], Doctor: ["STEM", "analysis", "scientific-method", "observation"], Lawyer: ["Humanities", "critical-thinking", "writing", "communication", "research"], Teacher: ["Humanities", "communication", "critical-thinking", "writing"] };
      const kw = keywords[student.careerGoal] || [];
      const tags = [course.category, ...(course.skills || [])].map(t => t.toLowerCase());
      if (kw.some(k => tags.includes(k.toLowerCase()))) { score += 15; reasons.push(`Aligns with career goal: ${student.careerGoal}`); }
    }
    return { course, score: Math.round(score), reasons };
  });

  return scored.filter(i => i.score > 0).sort((a, b) => b.score - a.score);
}

// ====== UI State ======
let currentPage = "dashboard";
let formContext = null;
let editingId = null;
let gradeSearch = "";
let gradeFilters = { status: "all", subject: "all", course: "all", sort: "newest" };
let studentSearch = "";
let courseSearch = "";
let recommenderStudentId = "";

// ====== Navigation ======
function switchPage(page) {
  currentPage = page;
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const el = document.querySelector(`[data-page="${page}"]`);
  if (el) el.classList.add("active");
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === page);
    b.setAttribute("aria-selected", b.dataset.tab === page ? "true" : "false");
  });
  const titles = { dashboard: "Dashboard", students: "Students", courses: "Courses", grades: "Grades", more: "More" };
  document.getElementById("headerTitle").textContent = titles[page] || "Dashboard";

  const showFab = page === "students" || page === "courses" || page === "grades";
  document.getElementById("fabContainer").style.display = showFab ? "block" : "none";

  document.getElementById("appContent").scrollTop = 0;

  if (page === "dashboard") renderDashboard();
  else if (page === "students") renderStudents();
  else if (page === "courses") renderCourses();
  else if (page === "grades") renderGrades();
  else if (page === "more") renderMore();
}

// ====== Modal ======
function openModal(title, bodyHtml, context) {
  formContext = context;
  editingId = null;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalBody").innerHTML = bodyHtml;
  document.getElementById("modalOverlay").classList.remove("modal-hidden");
  document.getElementById("appContent").style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("modal-hidden");
  document.getElementById("appContent").style.overflow = "";
  formContext = null;
  editingId = null;
}

// ====== Dashboard ======
function renderDashboard() {
  const page = document.getElementById("page-dashboard");

  const passing = grades.filter(g => Number(g.score) >= 60).length;
  const failing = grades.length - passing;
  const average = avg(grades);
  const high = grades.length ? Math.max(...grades.map(g => Number(g.score))) : 0;
  const low = grades.length ? Math.min(...grades.map(g => Number(g.score))) : 0;

  let html = `<div class="stat-grid">
    <div class="stat-card"><p>Students</p><strong>${students.length}</strong></div>
    <div class="stat-card"><p>Courses</p><strong>${courses.length}</strong></div>
    <div class="stat-card"><p>Grades</p><strong>${grades.length}</strong></div>
    <div class="stat-card"><p>Average</p><strong>${average}%</strong></div>
    <div class="stat-card" style="border-left-color:var(--success)"><p>Passing</p><strong>${passing}</strong></div>
    <div class="stat-card" style="border-left-color:var(--danger)"><p>Failing</p><strong>${failing}</strong></div>
    <div class="stat-card"><p>Highest</p><strong>${high}%</strong></div>
    <div class="stat-card"><p>Lowest</p><strong>${low}%</strong></div>
  </div>`;

  const summary = dashboardSummary();
  html += `<div class="ai-card"><h3>AI Summary</h3><p>${escapeHtml(summary.text)}</p></div>`;

  const alerts = smartAlerts();
  if (alerts.length) {
    html += `<div class="section-label"><h2>Smart Alerts</h2><span class="count-badge">${alerts.length}</span></div>`;
    alerts.forEach(a => {
      html += `<div class="alert-item alert-${a.type}">${escapeHtml(a.message)}</div>`;
    });
  }

  const trends = trendAnalysis();
  if (trends.length) {
    html += `<div class="section-label" style="margin-top:16px"><h2>Trends</h2></div><div class="card">`;
    trends.forEach(t => {
      if (t.type === "category" || t.type === "gradeType") {
        const label = t.type === "category" ? "Performance by Category" : "Average by Type";
        html += `<div class="trend-section"><h4>${label}</h4>`;
        t.data.forEach(d => {
          const name = d.category || d.type;
          const val = d.average;
          const color = val >= 80 ? "var(--success)" : val >= 60 ? "var(--warning)" : "var(--danger)";
          html += `<div class="trend-row"><span class="trend-label">${escapeHtml(name)}</span><div class="trend-track"><div class="trend-fill" style="width:${val}%;background:${color}"></div></div><span class="trend-value">${val}%</span></div>`;
        });
        html += `</div>`;
      } else if (t.type === "overTime") {
        const arrow = t.change >= 0 ? "↑" : "↓";
        const color = t.change >= 0 ? "var(--success)" : "var(--danger)";
        html += `<div class="trend-section"><h4>Overall Trend</h4><div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:var(--surface-soft);border-radius:8px"><div style="text-align:center"><span style="font-size:11px;color:var(--text-secondary)">Earlier</span><br><strong style="font-size:20px">${t.earlier}%</strong></div><span style="font-size:20px;font-weight:800;color:${color}">${arrow} ${Math.abs(Math.round(t.change))}%</span><div style="text-align:center"><span style="font-size:11px;color:var(--text-secondary)">Recent</span><br><strong style="font-size:20px">${t.later}%</strong></div></div></div>`;
      }
    });
    html += `</div>`;
  }

  const preds = generatePredictions();
  if (preds.length) {
    html += `<div class="section-label" style="margin-top:16px"><h2>Predictions</h2></div>`;
    preds.forEach(p => {
      html += `<div class="prediction-item prediction-${p.level}">${escapeHtml(p.message)}</div>`;
    });
  }

  if (!students.length && !courses.length && !grades.length) {
    html = `<div class="empty-state"><span class="empty-state-icon">📊</span>No data yet. Add students, courses, and grades using the buttons below.</div>`;
  }

  page.innerHTML = html;
}

// ====== Students ======
function renderStudents() {
  const page = document.getElementById("page-students");
  const search = studentSearch.toLowerCase().trim();
  const filtered = search ? students.filter(s =>
    s.name.toLowerCase().includes(search) || s.studentId.toLowerCase().includes(search) || s.className.toLowerCase().includes(search) || (s.email || "").toLowerCase().includes(search)
  ) : students;

  let html = `<div class="search-bar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;color:var(--text-tertiary)"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input type="search" placeholder="Search students..." id="studentSearchInput" value="${escapeHtml(studentSearch)}"></div>`;

  html += `<div class="section-label"><h2>All Students</h2><span class="count-badge">${students.length}</span></div>`;

  if (!students.length) {
    html += `<div class="empty-state"><span class="empty-state-icon">👤</span>No students yet. Tap + to add one.</div>`;
  } else if (!filtered.length) {
    html += `<div class="empty-state">No students matching "${escapeHtml(search)}"</div>`;
  } else {
    filtered.forEach(s => {
      const gc = gradesForStudent(s.id).length;
      const cc = coursesForStudent(s.id).length;
      html += `<div class="list-item" data-student-id="${s.id}">
        <div style="width:40px;height:40px;border-radius:50%;background:var(--primary);color:#fff;display:grid;place-items:center;font-weight:800;font-size:15px;flex-shrink:0">${s.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}</div>
        <div class="list-item-content">
          <div class="list-item-title">${escapeHtml(s.name)}</div>
          <div class="list-item-sub">${escapeHtml(s.studentId)} · ${escapeHtml(s.className)}${s.email ? ` · ${escapeHtml(s.email)}` : ""}</div>
        </div>
        <div class="list-item-right">
          <span class="list-item-badge badge-pass">${gc} grade${gc === 1 ? "" : "s"}</span>
        </div>
        <div class="list-item-actions">
          <button class="list-action-btn edit-student" data-id="${s.id}" aria-label="Edit">✎</button>
          <button class="list-action-btn delete-student" data-id="${s.id}" aria-label="Delete" style="color:var(--danger)">✕</button>
        </div>
      </div>`;
    });
  }

  page.innerHTML = html;

  const input = document.getElementById("studentSearchInput");
  if (input) {
    input.addEventListener("input", () => { studentSearch = input.value; renderStudents(); });
  }

  page.querySelectorAll("[data-student-id]").forEach(el => {
    el.addEventListener("click", e => {
      if (e.target.closest("button")) return;
      const id = Number(el.dataset.studentId);
      showStudentProfile(id);
    });
  });

  page.querySelectorAll(".edit-student").forEach(b => {
    b.addEventListener("click", e => { e.stopPropagation(); editStudentForm(Number(b.dataset.id)); });
  });
  page.querySelectorAll(".delete-student").forEach(b => {
    b.addEventListener("click", e => { e.stopPropagation(); deleteStudent(Number(b.dataset.id)); });
  });
}

function showStudentProfile(id) {
  const s = findStudent(id);
  if (!s) return;
  const sg = gradesForStudent(s.id);
  const ec = coursesForStudent(s.id);
  const a = avg(sg);
  const passing = sg.filter(g => Number(g.score) >= 60).length;
  const failing = sg.length - passing;
  const high = sg.length ? Math.max(...sg.map(g => Number(g.score))) : 0;
  const low = sg.length ? Math.min(...sg.map(g => Number(g.score))) : 0;
  const strengths = computeStrengths(s.id);

  let html = `<div class="profile-header">
    <div class="profile-avatar">${s.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}</div>
    <div class="profile-info">
      <h3>${escapeHtml(s.name)}</h3>
      <p>${escapeHtml(s.studentId)} · ${escapeHtml(s.className)}</p>
      ${s.email ? `<p>${escapeHtml(s.email)}</p>` : ""}
    </div>
  </div>
  <div class="profile-stats">
    <div class="profile-stat"><span>Courses</span><strong>${ec.length}</strong></div>
    <div class="profile-stat"><span>Grades</span><strong>${sg.length}</strong></div>
    <div class="profile-stat"><span>Average</span><strong>${sg.length ? `${a}%` : "N/A"}</strong></div>
  </div>`;

  if (s.interests && s.interests.length) {
    html += `<div class="profile-interests">${s.interests.map(i => `<span class="tag">${escapeHtml(i)}</span>`).join("")}</div>`;
  }
  if (s.careerGoal) {
    html += `<div style="font-size:14px;font-weight:600;color:var(--success);margin:8px 0">Career: ${escapeHtml(s.careerGoal)}</div>`;
  }

  if (strengths.length) {
    html += `<div class="section-label" style="margin-top:12px"><h2>Strengths</h2></div>`;
    strengths.forEach(st => {
      html += `<div class="strength-row"><span>${escapeHtml(st.category)}</span><span>${st.average}%</span></div>`;
    });
  }

  html += `<div class="section-label" style="margin-top:12px"><h2>Courses</h2></div>`;
  if (ec.length) {
    ec.forEach(c => {
      html += `<div class="card" style="padding:12px;margin-bottom:6px">
        <div style="font-weight:600;font-size:14px">${escapeHtml(c.name)}</div>
        <div style="font-size:12px;color:var(--text-secondary)">${escapeHtml(c.code)} · ${escapeHtml(c.category)}</div>
      </div>`;
    });
  } else {
    html += `<p style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">Not enrolled in any courses.</p>`;
  }

  if (sg.length) {
    html += `<div class="section-label" style="margin-top:12px"><h2>Grade History</h2><span class="count-badge">${sg.length}</span></div>`;
    sg.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(g => {
      const c = findCourse(g.courseId);
      const letter = letterGrade(Number(g.score));
      const status = passFail(Number(g.score));
      html += `<div class="list-item" style="padding:10px 12px;margin-bottom:6px;cursor:default">
        <div class="list-item-content">
          <div class="list-item-title" style="font-size:13px">${c ? escapeHtml(c.name) : "Unassigned"} · ${escapeHtml(g.subject)}</div>
          <div class="list-item-sub">${escapeHtml(g.type)} · ${escapeHtml(g.date)}</div>
        </div>
        <div class="list-item-right">
          <div><span class="list-item-badge badge-grade-${letter.toLowerCase()}">${letter}</span></div>
          <div><span class="list-item-badge ${status === "Pass" ? "badge-pass" : "badge-fail"}">${status}</span></div>
        </div>
      </div>`;
    });
  }

  openModal(`Student Profile`, html);
}

function editStudentForm(id) {
  editingId = id;
  const s = id ? findStudent(id) : null;
  openModal(s ? "Edit Student" : "Add Student", `
    <div class="form-group"><label>Student Name</label><input id="fStudentName" type="text" placeholder="Ava Johnson" value="${s ? escapeHtml(s.name) : ""}" required></div>
    <div class="form-group"><label>Student ID</label><input id="fStudentCode" type="text" placeholder="S001" value="${s ? escapeHtml(s.studentId) : ""}" required></div>
    <div class="form-row"><div class="form-group"><label>Grade Level</label><input id="fStudentClass" type="text" placeholder="Grade 8" value="${s ? escapeHtml(s.className) : ""}" required></div>
    <div class="form-group"><label>Email</label><input id="fStudentEmail" type="email" placeholder="ava@example.com" value="${s ? escapeHtml(s.email || "") : ""}"></div></div>
    <div class="form-group"><label>Interests (comma-separated)</label><input id="fStudentInterests" type="text" placeholder="problem-solving, creativity" value="${s ? escapeHtml((s.interests || []).join(", ")) : ""}"></div>
    <div class="form-group"><label>Career Goal</label><input id="fStudentCareer" type="text" placeholder="Engineer" value="${s ? escapeHtml(s.careerGoal || "") : ""}"></div>
    <div class="form-actions">
      <button class="btn btn-primary" id="saveStudentBtn">${s ? "Update" : "Add"} Student</button>
      <button class="btn btn-secondary" id="cancelStudentBtn">Cancel</button>
    </div>`, "student");
}

async function handleStudentSave() {
  const name = document.getElementById("fStudentName").value.trim();
  const code = document.getElementById("fStudentCode").value.trim();
  const cls = document.getElementById("fStudentClass").value.trim();
  const email = document.getElementById("fStudentEmail").value.trim();
  const interests = document.getElementById("fStudentInterests").value.trim().split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const career = document.getElementById("fStudentCareer").value.trim();
  if (!name || !code || !cls) { toast("Name, ID, and Grade Level required"); return; }
  try {
    if (editingId) {
      const updated = await api.updateStudent(editingId, { name, className: cls, email, interests, careerGoal: career });
      students = students.map(s => Number(s.id) === Number(editingId) ? { ...s, ...updated } : s);
      toast("Student updated");
    } else {
      const created = await api.createStudent({ studentId: code, name, className: cls, email, interests, careerGoal: career });
      students.push(created);
      toast("Student added");
    }
    cacheToLocal(); closeModal(); renderAll();
  } catch (err) { toast(err.message); }
}
  cacheToLocal(); closeModal(); renderAll();
}

async function deleteStudent(id) {
  const s = findStudent(id);
  if (!s) return;
  const related = gradesForStudent(id).length;
  const msg = related ? `Delete ${s.name} and ${related} grade record(s)?` : `Delete ${s.name}?`;
  if (!confirm(msg)) return;
  try {
    await api.deleteStudent(id);
    students = students.filter(st => Number(st.id) !== Number(id));
    grades = grades.filter(g => Number(g.studentId) !== Number(id));
    courses = courses.map(c => ({ ...c, studentIds: c.studentIds.filter(sid => Number(sid) !== Number(id)) }));
    cacheToLocal(); toast("Student deleted"); renderAll();
  } catch (err) { toast(err.message); }
}

// ====== Courses ======
function renderCourses() {
  const page = document.getElementById("page-courses");
  const search = courseSearch.toLowerCase().trim();
  const filtered = search ? courses.filter(c =>
    c.name.toLowerCase().includes(search) || c.code.toLowerCase().includes(search) || (c.teacher || "").toLowerCase().includes(search)
  ) : courses;

  let html = `<div class="search-bar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;color:var(--text-tertiary)"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input type="search" placeholder="Search courses..." id="courseSearchInput" value="${escapeHtml(courseSearch)}"></div>`;

  html += `<div class="section-label"><h2>All Courses</h2><span class="count-badge">${courses.length}</span></div>`;

  if (!courses.length) {
    html += `<div class="empty-state"><span class="empty-state-icon">📚</span>No courses yet. Tap + to add one.</div>`;
  } else if (!filtered.length) {
    html += `<div class="empty-state">No courses matching "${escapeHtml(search)}"</div>`;
  } else {
    filtered.forEach(c => {
      const cg = grades.filter(g => Number(g.courseId) === Number(c.id));
      html += `<div class="card course-card" data-course-id="${c.id}" style="cursor:pointer">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:15px;color:var(--text)">${escapeHtml(c.name)}</div>
            <div style="font-size:12px;color:var(--text-secondary)">${escapeHtml(c.code)}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0">
            <button class="list-action-btn edit-course" data-id="${c.id}" aria-label="Edit">✎</button>
            <button class="list-action-btn delete-course" data-id="${c.id}" aria-label="Delete" style="color:var(--danger)">✕</button>
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">
          <span class="list-item-badge badge-category">${escapeHtml(c.category)}</span>
          <span class="list-item-badge badge-difficulty">${escapeHtml(c.difficulty)}</span>
          <span class="list-item-badge badge-pass">${c.credits} cr</span>
        </div>
        <div style="display:flex;gap:12px;font-size:12px;color:var(--text-secondary)">
          <span>👤 ${c.studentIds.length} student${c.studentIds.length === 1 ? "" : "s"}</span>
          <span>📝 ${cg.length} grade${cg.length === 1 ? "" : "s"}</span>
          ${c.teacher ? `<span>👩‍🏫 ${escapeHtml(c.teacher)}</span>` : ""}
          ${c.period ? `<span>${escapeHtml(c.period)}</span>` : ""}
        </div>
      </div>`;
    });
  }

  page.innerHTML = html;

  const input = document.getElementById("courseSearchInput");
  if (input) { input.addEventListener("input", () => { courseSearch = input.value; renderCourses(); }); }

  page.querySelectorAll(".edit-course").forEach(b => {
    b.addEventListener("click", e => { e.stopPropagation(); editCourseForm(Number(b.dataset.id)); });
  });
  page.querySelectorAll(".delete-course").forEach(b => {
    b.addEventListener("click", e => { e.stopPropagation(); deleteCourse(Number(b.dataset.id)); });
  });
  page.querySelectorAll(".course-card").forEach(el => {
    el.addEventListener("click", e => {
      if (e.target.closest("button")) return;
      showCourseDetail(Number(el.dataset.courseId));
    });
  });
}

function showCourseDetail(id) {
  const c = findCourse(id);
  if (!c) return;
  const cg = grades.filter(g => Number(g.courseId) === Number(id));
  const enrolled = c.studentIds.map(sid => findStudent(sid)).filter(Boolean);
  const average = cg.length ? avg(cg) : null;

  let html = `<div style="margin-bottom:12px">
    <div style="font-size:20px;font-weight:700;color:var(--ink);margin-bottom:2px">${escapeHtml(c.name)}</div>
    <div style="font-size:13px;color:var(--text-secondary)">${escapeHtml(c.code)}</div>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px">
    <span class="list-item-badge badge-category">${escapeHtml(c.category)}</span>
    <span class="list-item-badge badge-difficulty">${escapeHtml(c.difficulty)}</span>
    <span class="list-item-badge badge-pass">${c.credits} cr</span>
  </div>`;

  if (c.description) html += `<p style="font-size:14px;color:var(--text);margin-bottom:12px;line-height:1.5">${escapeHtml(c.description)}</p>`;

  html += `<div class="profile-stats" style="margin-bottom:12px">
    <div class="profile-stat"><span>Students</span><strong>${enrolled.length}</strong></div>
    <div class="profile-stat"><span>Grades</span><strong>${cg.length}</strong></div>
    <div class="profile-stat"><span>Average</span><strong>${average !== null ? `${average}%` : "N/A"}</strong></div>
  </div>`;

  if (c.teacher || c.period || c.room) {
    html += `<div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">`;
    if (c.teacher) html += `Teacher: ${escapeHtml(c.teacher)}<br>`;
    if (c.period) html += `Period: ${escapeHtml(c.period)}<br>`;
    if (c.room) html += `Room: ${escapeHtml(c.room)}<br>`;
    html += `Term: ${escapeHtml(c.term)}`;
    html += `</div>`;
  }

  if (enrolled.length) {
    html += `<div class="section-label"><h2>Enrolled Students</h2></div>`;
    enrolled.forEach(s => {
      html += `<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--surface-soft);border-radius:var(--radius-sm);margin-bottom:4px;font-size:13px"><span style="font-weight:600">${escapeHtml(s.name)}</span><span style="color:var(--text-secondary)">${escapeHtml(s.studentId)}</span></div>`;
    });
  }

  if (c.skills && c.skills.length) {
    html += `<div class="section-label" style="margin-top:12px"><h2>Skills</h2></div><div class="profile-interests">${c.skills.map(sk => `<span class="tag">${escapeHtml(sk)}</span>`).join("")}</div>`;
  }

  openModal("Course Detail", html);
}

function editCourseForm(id) {
  editingId = id;
  const c = id ? findCourse(id) : null;
  const allStudents = students;
  const allCourses = courses.filter(co => Number(co.id) !== Number(id));
  openModal(c ? "Edit Course" : "Add Course", `
    <div class="form-row">
      <div class="form-group"><label>Course Name</label><input id="fCourseName" type="text" value="${c ? escapeHtml(c.name) : ""}" required></div>
      <div class="form-group"><label>Course Code</label><input id="fCourseCode" type="text" value="${c ? escapeHtml(c.code) : ""}" required></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Teacher</label><input id="fCourseTeacher" type="text" value="${c ? escapeHtml(c.teacher || "") : ""}"></div>
      <div class="form-group"><label>Period</label><input id="fCoursePeriod" type="text" value="${c ? escapeHtml(c.period || "") : ""}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Room</label><input id="fCourseRoom" type="text" value="${c ? escapeHtml(c.room || "") : ""}"></div>
      <div class="form-group"><label>Term</label><input id="fCourseTerm" type="text" value="${c ? escapeHtml(c.term || "Spring 2026") : "Spring 2026"}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Category</label><select id="fCourseCategory">${["General","STEM","Humanities","Arts","Social Science","Language","Physical Education","Technology"].map(cat => `<option value="${cat}" ${c && c.category === cat ? "selected" : ""}>${cat}</option>`).join("")}</select></div>
      <div class="form-group"><label>Difficulty</label><select id="fCourseDifficulty">${["Beginner","Intermediate","Advanced"].map(d => `<option value="${d}" ${c && c.difficulty === d ? "selected" : ""}>${d}</option>`).join("")}</select></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Credits</label><input id="fCourseCredits" type="number" min="1" max="6" value="${c ? c.credits : 3}"></div>
    </div>
    <div class="form-group"><label>Description</label><textarea id="fCourseDescription" rows="2">${c ? escapeHtml(c.description || "") : ""}</textarea></div>
    <div class="form-group"><label>Skills (comma-separated)</label><input id="fCourseSkills" type="text" value="${c ? escapeHtml((c.skills || []).join(", ")) : ""}"></div>
    <div class="form-group"><label>Enrolled Students</label><select id="fCourseStudents" multiple size="3">${allStudents.map(s => `<option value="${s.id}" ${c && c.studentIds.map(Number).includes(Number(s.id)) ? "selected" : ""}>${escapeHtml(s.name)} (${escapeHtml(s.studentId)})</option>`).join("")}</select></div>
    <div class="form-group"><label>Prerequisites</label><select id="fCoursePrereqs" multiple size="3">${allCourses.map(co => `<option value="${co.id}" ${c && (c.prerequisites || []).map(Number).includes(Number(co.id)) ? "selected" : ""}>${escapeHtml(co.name)} (${escapeHtml(co.code)})</option>`).join("")}</select></div>
    <div class="form-actions">
      <button class="btn btn-primary" id="saveCourseBtn">${c ? "Update" : "Add"} Course</button>
      <button class="btn btn-secondary" id="cancelCourseBtn">Cancel</button>
    </div>`, "course");
}

async function handleCourseSave() {
  const name = document.getElementById("fCourseName").value.trim();
  const code = document.getElementById("fCourseCode").value.trim();
  if (!name || !code) { toast("Course name and code required"); return; }
  const data = {
    name, code,
    teacher: document.getElementById("fCourseTeacher").value.trim(),
    period: document.getElementById("fCoursePeriod").value.trim(),
    room: document.getElementById("fCourseRoom").value.trim(),
    term: document.getElementById("fCourseTerm").value.trim(),
    category: document.getElementById("fCourseCategory").value,
    difficulty: document.getElementById("fCourseDifficulty").value,
    credits: Number(document.getElementById("fCourseCredits").value) || 3,
    description: document.getElementById("fCourseDescription").value.trim(),
    skills: document.getElementById("fCourseSkills").value.trim().split(",").map(s => s.trim().toLowerCase()).filter(Boolean),
    studentIds: Array.from(document.getElementById("fCourseStudents").selectedOptions).map(o => Number(o.value)),
    prerequisites: Array.from(document.getElementById("fCoursePrereqs").selectedOptions).map(o => Number(o.value))
  };
  try {
    if (editingId) {
      const updated = await api.updateCourse(editingId, data);
      courses = courses.map(c => Number(c.id) === Number(editingId) ? { ...c, ...updated } : c);
      toast("Course updated");
    } else {
      const created = await api.createCourse(data);
      courses.push(created);
      toast("Course added");
    }
    cacheToLocal(); closeModal(); renderAll();
  } catch (err) { toast(err.message); }
}

async function deleteCourse(id) {
  const c = findCourse(id);
  if (!c) return;
  const related = grades.filter(g => Number(g.courseId) === Number(id)).length;
  if (related) { toast("Delete or reassign grades before deleting course"); return; }
  if (!confirm(`Delete ${c.name}?`)) return;
  try {
    await api.deleteCourse(id);
    courses = courses.filter(co => Number(co.id) !== Number(id));
    cacheToLocal(); toast("Course deleted"); renderAll();
  } catch (err) { toast(err.message); }
}

// ====== Grades ======
function renderGrades() {
  const page = document.getElementById("page-grades");
  const search = gradeSearch.toLowerCase().trim();
  const visible = grades.filter(g => {
    const s = findStudent(g.studentId);
    const c = findCourse(g.courseId);
    const sn = s ? s.name.toLowerCase() : "";
    const sc = s ? s.studentId.toLowerCase() : "";
    const cn = c ? `${c.name} ${c.code}`.toLowerCase() : "";
    const sub = g.subject.toLowerCase();
    const matchesSearch = !search || sn.includes(search) || sc.includes(search) || cn.includes(search) || sub.includes(search);
    const matchesStatus = gradeFilters.status === "all" || passFail(Number(g.score)).toLowerCase() === gradeFilters.status;
    const matchesSubject = gradeFilters.subject === "all" || g.subject === gradeFilters.subject;
    const matchesCourse = gradeFilters.course === "all" || Number(g.courseId) === Number(gradeFilters.course);
    return matchesSearch && matchesStatus && matchesSubject && matchesCourse;
  });

  visible.sort((a, b) => {
    if (gradeFilters.sort === "highest") return Number(b.score) - Number(a.score);
    if (gradeFilters.sort === "lowest") return Number(a.score) - Number(b.score);
    if (gradeFilters.sort === "oldest") return new Date(a.date) - new Date(b.date);
    if (gradeFilters.sort === "student") { const sa = findStudent(a.studentId)?.name || ""; const sb = findStudent(b.studentId)?.name || ""; return sa.localeCompare(sb); }
    return new Date(b.date) - new Date(a.date);
  });

  const subjects = [...new Set(grades.map(g => g.subject).filter(Boolean))].sort();
  const uniqueCourses = [...new Set(grades.map(g => g.courseId))].map(id => findCourse(id)).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));

  let html = `<div class="search-bar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;color:var(--text-tertiary)"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input type="search" placeholder="Search student, course, subject..." id="gradeSearchInput" value="${escapeHtml(gradeSearch)}"></div>`;

  html += `<div class="filter-row" id="gradeFilterRow">
    <button class="filter-chip ${gradeFilters.status === "all" ? "active" : ""}" data-filter-type="status" data-filter-value="all">All</button>
    <button class="filter-chip ${gradeFilters.status === "pass" ? "active" : ""}" data-filter-type="status" data-filter-value="pass">Passing</button>
    <button class="filter-chip ${gradeFilters.status === "fail" ? "active" : ""}" data-filter-type="status" data-filter-value="fail">Failing</button>
    <button class="filter-chip ${gradeFilters.subject === "all" ? "active" : ""}" data-filter-type="subject" data-filter-value="all">Subject</button>
    ${subjects.map(s => `<button class="filter-chip ${gradeFilters.subject === s ? "active" : ""}" data-filter-type="subject" data-filter-value="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join("")}
    <button class="filter-chip ${gradeFilters.sort === "newest" ? "active" : ""}" data-filter-type="sort" data-filter-value="newest">New</button>
    <button class="filter-chip ${gradeFilters.sort === "oldest" ? "active" : ""}" data-filter-type="sort" data-filter-value="oldest">Old</button>
    <button class="filter-chip ${gradeFilters.sort === "highest" ? "active" : ""}" data-filter-type="sort" data-filter-value="highest">High</button>
    <button class="filter-chip ${gradeFilters.sort === "lowest" ? "active" : ""}" data-filter-type="sort" data-filter-value="lowest">Low</button>
  </div>`;

  html += `<div class="section-label"><h2>All Grades</h2><span class="count-badge">${grades.length}</span></div>`;

  if (!grades.length) {
    html += `<div class="empty-state"><span class="empty-state-icon">📝</span>No grades yet. Tap + to record one.</div>`;
  } else if (!visible.length) {
    html += `<div class="empty-state">No matching grades</div>`;
  } else {
    visible.forEach(g => {
      const s = findStudent(g.studentId);
      const c = findCourse(g.courseId);
      const letter = letterGrade(Number(g.score));
      const status = passFail(Number(g.score));
      html += `<div class="list-item" style="padding:12px;margin-bottom:6px;cursor:default">
        <div style="width:38px;height:38px;border-radius:50%;background:var(--primary-soft);color:var(--primary);display:grid;place-items:center;font-weight:700;font-size:14px;flex-shrink:0">${letter}</div>
        <div class="list-item-content">
          <div class="list-item-title" style="font-size:14px">${s ? escapeHtml(s.name) : "Unknown"} · ${escapeHtml(g.subject)}</div>
          <div class="list-item-sub">${c ? escapeHtml(c.name) : "Unassigned"} · ${escapeHtml(g.type)} · ${escapeHtml(g.date)}</div>
        </div>
        <div class="list-item-right">
          <div style="font-size:18px;font-weight:800;color:${Number(g.score) >= 60 ? "var(--success)" : "var(--danger)"}">${Number(g.score)}%</div>
          <span class="list-item-badge ${status === "Pass" ? "badge-pass" : "badge-fail"}">${status}</span>
        </div>
        <div class="list-item-actions">
          <button class="list-action-btn edit-grade" data-id="${g.id}" aria-label="Edit">✎</button>
          <button class="list-action-btn delete-grade" data-id="${g.id}" aria-label="Delete" style="color:var(--danger)">✕</button>
        </div>
      </div>`;
    });
  }

  page.innerHTML = html;

  const input = document.getElementById("gradeSearchInput");
  if (input) { input.addEventListener("input", () => { gradeSearch = input.value; renderGrades(); }); }

  page.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const type = chip.dataset.filterType;
      const value = chip.dataset.filterValue;
      gradeFilters[type] = value;
      renderGrades();
    });
  });

  page.querySelectorAll(".edit-grade").forEach(b => {
    b.addEventListener("click", () => editGradeForm(Number(b.dataset.id)));
  });
  page.querySelectorAll(".delete-grade").forEach(b => {
    b.addEventListener("click", () => deleteGrade(Number(b.dataset.id)));
  });
}

function editGradeForm(id) {
  editingId = id;
  const g = id ? grades.find(gr => Number(gr.id) === Number(id)) : null;
  openModal(g ? "Edit Grade" : "Record Grade", `
    <div class="form-group"><label>Student</label><select id="fGradeStudent">${students.map(s => `<option value="${s.id}" ${g && Number(g.studentId) === Number(s.id) ? "selected" : ""}>${escapeHtml(s.name)} (${escapeHtml(s.studentId)})</option>`).join("")}</select></div>
    <div class="form-group"><label>Course</label><select id="fGradeCourse">${courses.map(c => `<option value="${c.id}" ${g && Number(g.courseId) === Number(c.id) ? "selected" : ""}>${escapeHtml(c.name)} (${escapeHtml(c.code)})</option>`).join("")}</select></div>
    <div class="form-row">
      <div class="form-group"><label>Subject</label><input id="fGradeSubject" type="text" value="${g ? escapeHtml(g.subject) : ""}"></div>
      <div class="form-group"><label>Type</label><select id="fGradeType">${["Homework","Quiz","Exam","Project"].map(t => `<option value="${t}" ${g && g.type === t ? "selected" : ""}>${t}</option>`).join("")}</select></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Score (0-100)</label><input id="fGradeScore" type="number" min="0" max="100" value="${g ? g.score : ""}"></div>
      <div class="form-group"><label>Date</label><input id="fGradeDate" type="date" value="${g ? g.date : ""}"></div>
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" id="saveGradeBtn">${g ? "Update" : "Save"} Grade</button>
      <button class="btn btn-secondary" id="cancelGradeBtn">Cancel</button>
    </div>`, "grade");
}

async function handleGradeSave() {
  const studentId = Number(document.getElementById("fGradeStudent").value);
  const courseId = Number(document.getElementById("fGradeCourse").value);
  const subject = document.getElementById("fGradeSubject").value.trim();
  const type = document.getElementById("fGradeType").value;
  const score = Number(document.getElementById("fGradeScore").value);
  const date = document.getElementById("fGradeDate").value;
  if (!studentId) { toast("Select a student"); return; }
  if (!courseId) { toast("Select a course"); return; }
  if (!subject) { toast("Enter a subject"); return; }
  if (isNaN(score) || score < 0 || score > 100) { toast("Score must be 0-100"); return; }
  if (!date) { toast("Select a date"); return; }
  try {
    if (!editingId) {
      const c = findCourse(courseId);
      if (c && !c.studentIds.map(Number).includes(studentId)) c.studentIds.push(studentId);
    }
    if (editingId) {
      const updated = await api.updateGrade(editingId, { studentId, courseId, subject, type, score, date });
      grades = grades.map(g => Number(g.id) === Number(editingId) ? { ...g, ...updated } : g);
      toast("Grade updated");
    } else {
      const created = await api.createGrade({ studentId, courseId, subject, type, score, date });
      grades.push(created);
      toast("Grade saved");
    }
    cacheToLocal(); closeModal(); renderAll();
  } catch (err) { toast(err.message); }
}

async function deleteGrade(id) {
  if (!confirm("Delete this grade?")) return;
  try {
    await api.deleteGrade(id);
    grades = grades.filter(g => Number(g.id) !== Number(id));
    cacheToLocal(); toast("Grade deleted"); renderAll();
  } catch (err) { toast(err.message); }
}

// ====== More Page (Reports, Recommender, Reset) ======
function renderMore() {
  const page = document.getElementById("page-more");
  let html = "";

  // Reports
  html += `<div class="reports-section">
    <h3>Course Averages</h3>
    <div class="reports-grid" id="reportCourses">`;
  if (!courses.length) { html += `<p class="empty-state" style="padding:16px">No courses</p>`; }
  else {
    courses.forEach(c => {
      const cg = grades.filter(g => Number(g.courseId) === Number(c.id));
      const a = cg.length ? avg(cg) : null;
      html += `<div class="report-row"><strong>${escapeHtml(c.name)}</strong><div class="meter"><span style="width:${a || 0}%"></span></div><span class="report-value">${a !== null ? `${a}%` : "N/A"}</span></div>`;
    });
  }
  html += `</div></div>`;

  html += `<div class="reports-section">
    <h3>Subject Averages</h3>
    <div class="reports-grid">`;
  const subjects = [...new Set(grades.map(g => g.subject).filter(Boolean))].sort();
  if (!subjects.length) { html += `<p class="empty-state" style="padding:16px">No subjects</p>`; }
  else {
    subjects.forEach(sub => {
      const sg = grades.filter(g => g.subject === sub);
      const a = avg(sg);
      html += `<div class="report-row"><strong>${escapeHtml(sub)}</strong><div class="meter"><span style="width:${a}%"></span></div><span class="report-value">${a}%</span></div>`;
    });
  }
  html += `</div></div>`;

  html += `<div class="reports-section">
    <h3>Student Averages</h3>
    <div class="reports-grid">`;
  if (!students.length) { html += `<p class="empty-state" style="padding:16px">No students</p>`; }
  else {
    students.forEach(s => {
      const sg = gradesForStudent(s.id);
      const a = sg.length ? avg(sg) : null;
      html += `<div class="report-row"><strong>${escapeHtml(s.name)}</strong><div class="meter"><span style="width:${a || 0}%"></span></div><span class="report-value">${a !== null ? `${a}%` : "N/A"}</span></div>`;
    });
  }
  html += `</div></div>`;

  // AI Recommender
  html += `<div class="section-label" style="margin-top:20px"><h2>AI Course Recommender</h2></div>`;
  html += `<div class="card" style="margin-bottom:12px">
    <div class="form-group"><label>Select Student</label>
      <select id="recStudentSelect">` +
    `<option value="">Choose a student</option>` +
    students.map(s => `<option value="${s.id}" ${recommenderStudentId === String(s.id) ? "selected" : ""}>${escapeHtml(s.name)} (${escapeHtml(s.studentId)})</option>`).join("") +
    `</select></div>
    <div style="margin:12px 0">
      <div class="checkbox-row"><input type="checkbox" id="recMatchInterests" checked><label for="recMatchInterests">Match Interests</label></div>
      <div class="checkbox-row"><input type="checkbox" id="recCheckPrereqs" checked><label for="recCheckPrereqs">Check Prerequisites</label></div>
      <div class="checkbox-row"><input type="checkbox" id="recUsePerformance" checked><label for="recUsePerformance">Use Performance Data</label></div>
      <div class="checkbox-row"><input type="checkbox" id="recBalanceWorkload" checked><label for="recBalanceWorkload">Balance Workload</label></div>
    </div>
    <button class="btn btn-primary" id="generateRecsBtn" style="width:100%">Generate Recommendations</button>
  </div>`;
  html += `<div id="recResults"></div>`;

  // Reset
  html += `<div style="margin-top:20px;text-align:center;padding-bottom:20px">
    <button class="btn btn-danger-outline" id="resetDataBtn" style="flex:none;padding:12px 24px">Reset Demo Data</button>
  </div>`;

  page.innerHTML = html;

  document.getElementById("recStudentSelect")?.addEventListener("change", () => {
    recommenderStudentId = document.getElementById("recStudentSelect").value;
  });

  document.getElementById("generateRecsBtn")?.addEventListener("click", renderRecommendations);
  document.getElementById("resetDataBtn")?.addEventListener("click", resetDemo);

  // Pre-render recs if student is selected
  if (recommenderStudentId) renderRecommendations();
}

function renderRecommendations() {
  const container = document.getElementById("recResults");
  if (!container) return;
  const sid = document.getElementById("recStudentSelect").value;
  if (!sid) { container.innerHTML = ""; return; }
  const s = findStudent(sid);
  if (!s) return;
  const opts = {
    matchInterests: document.getElementById("recMatchInterests").checked,
    checkPrereqs: document.getElementById("recCheckPrereqs").checked,
    usePerformance: document.getElementById("recUsePerformance").checked,
    balanceWorkload: document.getElementById("recBalanceWorkload").checked
  };
  const recs = recommendations(sid, opts);
  if (!recs.length) {
    container.innerHTML = `<div class="rec-summary"><h3>Results for ${escapeHtml(s.name)}</h3><p class="empty-state" style="padding:10px">No recommendations found. Try adjusting options or add more courses.</p></div>`;
    return;
  }
  const sg = gradesForStudent(s.id);
  const a = sg.length ? avg(sg) : null;
  const strengths = computeStrengths(s.id);

  let html = `<div class="rec-summary">
    <h3>Results for ${escapeHtml(s.name)}</h3>
    <div class="rec-summary-stats">
      ${a !== null ? `<div class="rec-summary-stat">Average<strong>${a}%</strong></div>` : ""}
      <div class="rec-summary-stat">Enrolled<strong>${coursesForStudent(s.id).length}</strong></div>
      ${strengths.length ? `<div class="rec-summary-stat">Top<strong>${escapeHtml(strengths[0].category)}</strong></div>` : ""}
      ${s.careerGoal ? `<div class="rec-summary-stat">Goal<strong>${escapeHtml(s.careerGoal)}</strong></div>` : ""}
    </div>
  </div>`;

  recs.forEach((rec, i) => {
    html += `<div class="rec-card ${i === 0 ? "top" : ""}">
      <div class="rec-header">
        <div class="rec-rank">#${i + 1}</div>
        <div class="rec-info">
          <h4>${escapeHtml(rec.course.name)} <span style="font-weight:400;font-size:13px;color:var(--text-secondary)">${escapeHtml(rec.course.code)}</span>${i === 0 ? '<span class="rec-badge-top">Top Pick</span>' : ""}</h4>
          <div class="rec-meta">
            <span style="background:var(--primary-surface);color:var(--primary)">${escapeHtml(rec.course.category)}</span>
            <span style="background:var(--warning-surface);color:var(--warning)">${escapeHtml(rec.course.difficulty)}</span>
            <span style="background:var(--success-surface);color:var(--success)">${rec.course.credits} cr</span>
          </div>
        </div>
        <div class="rec-score">
          <div class="rec-score-circle" style="--score:${Math.min(rec.score, 100)}"><span>${rec.score}</span></div>
          <small>Match</small>
        </div>
      </div>
      ${rec.course.description ? `<p style="font-size:13px;color:var(--text);margin-bottom:8px;line-height:1.5">${escapeHtml(rec.course.description)}</p>` : ""}
      <div class="rec-reasons">
        <h5>Why this course?</h5>
        <ul>${rec.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join("")}</ul>
      </div>
      ${rec.course.teacher ? `<p style="font-size:12px;color:var(--text-secondary);margin-top:8px">Teacher: ${escapeHtml(rec.course.teacher)}${rec.course.period ? ` · ${escapeHtml(rec.course.period)}` : ""}</p>` : ""}
    </div>`;
  });

  container.innerHTML = html;
}

async function seedDemoData() {
  try {
    for (const s of demoStudents) {
      const created = await api.createStudent(s);
      const idx = students.findIndex(st => Number(st.id) === Number(s.id) || st.studentId === s.studentId);
      if (idx >= 0) students[idx] = created;
      else students.push(created);
    }
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
    renderAll();
    toast("Demo data loaded.");
  } catch (err) {
    toast("Error seeding data: " + err.message);
  }
}

function resetDemo() {
  if (!confirm("Reset to demo data? This replaces all current records.")) return;
  students = [];
  courses = [];
  grades = [];
  cacheToLocal();
  seedDemoData();
}

// ====== Global event handlers ======
function handleFab() {
  if (currentPage === "students") editStudentForm(null);
  else if (currentPage === "courses") editCourseForm(null);
  else if (currentPage === "grades") editGradeForm(null);
}

async function handleModalAction(e) {
  const target = e.target;
  if (target.id === "saveStudentBtn") await handleStudentSave();
  else if (target.id === "cancelStudentBtn") closeModal();
  else if (target.id === "saveCourseBtn") await handleCourseSave();
  else if (target.id === "cancelCourseBtn") closeModal();
  else if (target.id === "saveGradeBtn") await handleGradeSave();
  else if (target.id === "cancelGradeBtn") closeModal();
}

function renderAll() {
  if (currentPage === "dashboard") renderDashboard();
  else if (currentPage === "students") renderStudents();
  else if (currentPage === "courses") renderCourses();
  else if (currentPage === "grades") renderGrades();
  else if (currentPage === "more") renderMore();
}

// ====== Shared Auth & Init ======
async function initializeAuth() {
  const storedUrl = localStorage.getItem('api_base_url');
  const urlInput = document.getElementById("authServerUrl");
  if (urlInput && storedUrl) urlInput.value = storedUrl;

  if (!api.token) {
    document.getElementById("authPage").style.display = "flex";
    document.getElementById("appShell").style.display = "none";
    return false;
  }

  try {
    await api.getCurrentUser();
    document.getElementById("authPage").style.display = "none";
    document.getElementById("appShell").style.display = "";
    return true;
  } catch {
    api.token = null;
    localStorage.removeItem('api_token');
    document.getElementById("authPage").style.display = "flex";
    document.getElementById("appShell").style.display = "none";
    return false;
  }
}

async function initializeApp() {
  const authed = await initializeAuth();
  if (!authed) return;

  const loaded = await fetchFromApi();
  if (!loaded) loadFromCacheOrDemo();
}

// ====== Init ======
document.addEventListener("DOMContentLoaded", () => {
  // Auth UI
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
      if (authError) authError.style.display = "none";
    });
  }

  if (toggleRegister) {
    toggleRegister.addEventListener("click", () => {
      toggleRegister.classList.add("active");
      toggleLogin.classList.remove("active");
      loginFields.style.display = "none";
      registerFields.style.display = "";
      if (authError) authError.style.display = "none";
    });
  }

  const serverUrlInput = document.getElementById("authServerUrl");
  if (serverUrlInput) {
    serverUrlInput.addEventListener("change", () => {
      localStorage.setItem('api_base_url', serverUrlInput.value);
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const isRegister = registerFields.style.display !== "none";
      const urlInput = document.getElementById("authServerUrl");
      if (urlInput) localStorage.setItem('api_base_url', urlInput.value);

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
        if (authError) authError.style.display = "none";
        document.getElementById("authPage").style.display = "none";
        document.getElementById("appShell").style.display = "";

        const loaded = await fetchFromApi();
        if (!loaded) loadFromCacheOrDemo();

        if (isRegister && !students.length && !courses.length && !grades.length) {
          await seedDemoData();
        }

        renderAll();
        const aiChat = createAIChat(() => ({ students, courses, grades }));
        aiChat.init({ mobile: true });
      } catch (err) {
        if (authError) { authError.textContent = err.message; authError.style.display = "block"; }
        else toast(err.message);
      }
    });
  }

  window._onUnauthorized = () => {
    api.token = null;
    localStorage.removeItem('api_token');
    document.getElementById("authPage").style.display = "flex";
    document.getElementById("appShell").style.display = "none";
  };

  // Navigation
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => switchPage(btn.dataset.tab));
  });

  // FAB
  document.getElementById("fabBtn").addEventListener("click", handleFab);

  // Modal
  document.querySelector(".modal-scrim").addEventListener("click", closeModal);
  document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
  document.getElementById("modalBody").addEventListener("click", handleModalAction);

  // Toast auto-hide handled in toast()

  // Init app
  (async () => {
    await initializeApp();

    if (api.token) {
      switchPage("dashboard");
      renderAll();

      const aiChat = createAIChat(() => ({ students, courses, grades }));
      aiChat.init({ mobile: true });
    }
  })();
});
