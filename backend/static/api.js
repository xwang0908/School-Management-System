const API_BASE_URL = localStorage.getItem('api_base_url') || 'http://localhost:8000';

const api = {
  token: localStorage.getItem('api_token') || null,

  _headers(hasBody) {
    const h = {};
    if (hasBody) h['Content-Type'] = 'application/json';
    if (this.token) h['Authorization'] = `Bearer ${this.token}`;
    return h;
  },

  async _req(method, path, body) {
    const opts = { method, headers: this._headers(body != null) };
    if (body != null) opts.body = JSON.stringify(body);
    const res = await fetch(`${API_BASE_URL}${path}`, opts);
    if (res.status === 401) {
      this.token = null;
      localStorage.removeItem('api_token');
      if (window._onUnauthorized) window._onUnauthorized();
      throw new Error('Unauthorized');
    }
    if (res.status === 204) return null;
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || `Request failed (${res.status})`);
    return data;
  },

  // === Auth ===
  async login(username, password) {
    const params = new URLSearchParams({ username, password });
    const res = await fetch(`${API_BASE_URL}/api/auth/login?${params}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    this.token = data.access_token;
    localStorage.setItem('api_token', data.access_token);
    return data;
  },

  async register(username, email, password, fullName) {
    const data = await this._req('POST', '/api/auth/register', {
      username, email, password, full_name: fullName || '',
    });
    return data;
  },

  async getCurrentUser() {
    return this._req('GET', '/api/auth/me');
  },

  logout() {
    this.token = null;
    localStorage.removeItem('api_token');
    if (window._onUnauthorized) window._onUnauthorized();
  },

  // === Students ===
  async getStudents() {
    const data = await this._req('GET', '/api/students/');
    return data.map(s => ({
      id: s.id,
      studentId: s.student_id,
      name: s.name,
      className: s.class_name,
      email: s.email || '',
      interests: s.interests ? s.interests.split(',').filter(Boolean) : [],
      careerGoal: s.career_goal || '',
    }));
  },

  async createStudent(data) {
    const res = await this._req('POST', '/api/students/', {
      student_id: data.studentId,
      name: data.name,
      class_name: data.className,
      email: data.email || '',
      interests: (data.interests || []).join(','),
      career_goal: data.careerGoal || '',
    });
    return { ...res, studentId: res.student_id, className: res.class_name, careerGoal: res.career_goal };
  },

  async updateStudent(id, data) {
    const body = {};
    if (data.name != null) body.name = data.name;
    if (data.className != null) body.class_name = data.className;
    if (data.email != null) body.email = data.email;
    if (data.interests != null) body.interests = data.interests.join(',');
    if (data.careerGoal != null) body.career_goal = data.careerGoal;
    const res = await this._req('PUT', `/api/students/${id}`, body);
    return { ...res, studentId: res.student_id, className: res.class_name, careerGoal: res.career_goal };
  },

  async deleteStudent(id) {
    return this._req('DELETE', `/api/students/${id}`);
  },

  // === Courses ===
  async getCourses() {
    const data = await this._req('GET', '/api/courses/');
    return data.map(c => ({
      id: c.id,
      code: c.code,
      name: c.name,
      teacher: c.teacher || '',
      period: c.period || '',
      room: c.room || '',
      term: c.term || 'Spring 2026',
      category: c.category || 'General',
      difficulty: c.difficulty || 'Beginner',
      credits: c.credits || 3,
      description: c.description || '',
      skills: c.skills ? c.skills.split(',').filter(Boolean) : [],
      studentIds: (c.enrolled_student_ids || []).map(Number),
      prerequisites: (c.prerequisite_ids || []).map(Number),
    }));
  },

  async createCourse(data) {
    const res = await this._req('POST', '/api/courses/', {
      code: data.code,
      name: data.name,
      teacher: data.teacher || '',
      period: data.period || '',
      room: data.room || '',
      term: data.term || 'Spring 2026',
      category: data.category || 'General',
      difficulty: data.difficulty || 'Beginner',
      credits: data.credits || 3,
      description: data.description || '',
      skills: (data.skills || []).join(','),
      enrolled_student_ids: (data.studentIds || []).map(Number),
      prerequisite_ids: (data.prerequisites || []).map(Number),
    });
    return {
      ...res,
      skills: res.skills ? res.skills.split(',').filter(Boolean) : [],
      studentIds: (res.enrolled_student_ids || []).map(Number),
      prerequisites: (res.prerequisite_ids || []).map(Number),
    };
  },

  async updateCourse(id, data) {
    const body = {};
    if (data.name != null) body.name = data.name;
    if (data.teacher != null) body.teacher = data.teacher;
    if (data.period != null) body.period = data.period;
    if (data.room != null) body.room = data.room;
    if (data.term != null) body.term = data.term;
    if (data.category != null) body.category = data.category;
    if (data.difficulty != null) body.difficulty = data.difficulty;
    if (data.credits != null) body.credits = data.credits;
    if (data.description != null) body.description = data.description;
    if (data.skills != null) body.skills = data.skills.join(',');
    if (data.studentIds != null) body.enrolled_student_ids = data.studentIds.map(Number);
    if (data.prerequisites != null) body.prerequisite_ids = data.prerequisites.map(Number);
    const res = await this._req('PUT', `/api/courses/${id}`, body);
    return {
      ...res,
      skills: res.skills ? res.skills.split(',').filter(Boolean) : [],
      studentIds: (res.enrolled_student_ids || []).map(Number),
      prerequisites: (res.prerequisite_ids || []).map(Number),
    };
  },

  async deleteCourse(id) {
    return this._req('DELETE', `/api/courses/${id}`);
  },

  // === Grades ===
  async getGrades(studentId, courseId) {
    let path = '/api/grades/';
    const params = [];
    if (studentId) params.push(`student_id=${studentId}`);
    if (courseId) params.push(`course_id=${courseId}`);
    if (params.length) path += '?' + params.join('&');
    const data = await this._req('GET', path);
    return data.map(g => ({
      id: g.id,
      studentId: g.student_id,
      courseId: g.course_id,
      subject: g.subject,
      type: g.type,
      score: g.score,
      date: g.date,
    }));
  },

  async createGrade(data) {
    const res = await this._req('POST', '/api/grades/', {
      student_id: data.studentId,
      course_id: data.courseId,
      subject: data.subject,
      type: data.type,
      score: data.score,
      date: data.date,
    });
    return { ...res, studentId: res.student_id, courseId: res.course_id };
  },

  async updateGrade(id, data) {
    const body = {};
    if (data.studentId != null) body.student_id = data.studentId;
    if (data.courseId != null) body.course_id = data.courseId;
    if (data.subject != null) body.subject = data.subject;
    if (data.type != null) body.type = data.type;
    if (data.score != null) body.score = data.score;
    if (data.date != null) body.date = data.date;
    const res = await this._req('PUT', `/api/grades/${id}`, body);
    return { ...res, studentId: res.student_id, courseId: res.course_id };
  },

  async deleteGrade(id) {
    return this._req('DELETE', `/api/grades/${id}`);
  },

  // === AI ===
  async getRecommendations(studentId, options) {
    return this._req('POST', '/api/ai/recommendations', {
      student_id: studentId,
      match_interests: options.matchInterests ?? true,
      check_prereqs: options.checkPrereqs ?? true,
      use_performance: options.usePerformance ?? true,
      balance_workload: options.balanceWorkload ?? true,
    });
  },

  async getDashboardInsights() {
    return this._req('GET', '/api/ai/dashboard-insights');
  },
};
