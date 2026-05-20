function createAIChat(dataProvider) {
  let msgId = 0;
  const messages = [];
  let isOpen = false;
  let container, bubble, panel, msgList, inputEl, sendBtn;
  let isMobile = false;

  function getData() {
    try { return dataProvider(); } catch { return { students: [], courses: [], grades: [] }; }
  }

  let _typingTimer = null;

  function toggleTyping(show) {
    const existing = msgList?.querySelector(".chat-typing");
    if (existing) existing.remove();
    if (!show) return;
    const div = document.createElement("div");
    div.className = "chat-msg chat-msg-bot chat-typing";
    div.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
    msgList.appendChild(div);
    scrollToBottom();
  }

  function addMessage(content, isUser) {
    messages.push({ id: ++msgId, content, isUser });
  }

  function renderMessage(msg) {
    const div = document.createElement("div");
    div.className = `chat-msg ${msg.isUser ? "chat-msg-user" : "chat-msg-bot"}`;
    div.innerHTML = msg.content;
    return div;
  }

  function scrollToBottom() {
    if (msgList) requestAnimationFrame(() => { msgList.scrollTop = msgList.scrollHeight; });
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    inputEl.value = "";
    addMessage(text, true);
    msgList.appendChild(renderMessage(messages[messages.length - 1]));
    scrollToBottom();
    const reply = ruleBasedReply(text);
    setTimeout(() => {
      addMessage(reply, false);
      msgList.appendChild(renderMessage(messages[messages.length - 1]));
      scrollToBottom();
    }, 300);
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function ruleBasedReply(input) {
    const d = getData();
    const { students, courses, grades } = d;
    const text = input.toLowerCase().trim();
    if (students.length || courses.length || grades.length) {
      const sc = students.length, cc = courses.length, gc = grades.length;
      const a = gc ? Math.round(grades.reduce((s, g) => s + Number(g.score), 0) / gc) : null;
      const passing = gc ? grades.filter(g => Number(g.score) >= 60).length : 0;
      const failing = gc ? gc - passing : 0;

      if (/^(hi|hello|hey|howdy)/.test(text)) return pick(["Hi! I'm your AI assistant. Ask me about students, grades, or courses!", "Hello! Try asking \"give me a summary\" or \"who is at risk?\"", "Hey there! I can help you track performance. What would you like to know?"]);
      if (/help|what can you do/.test(text) || text === "?") return "I can answer questions like:<br>• <b>Summary</b> — class overview<br>• <b>How is [student] doing?</b> — individual performance<br>• <b>Tell me about [course]</b> — course details<br>• <b>Who is at risk?</b> — failing students<br>• <b>Trends/Predictions</b> — class analysis<br>• <b>Stats</b> — counts and averages";

      if (/^(give me a |show me |)?summary|overview|how are things|status|report|class overview/.test(text)) {
        let r = `📊 <b>${sc}</b> student${sc === 1 ? "" : "s"}, <b>${cc}</b> course${cc === 1 ? "" : "s"}, <b>${gc}</b> grade${gc === 1 ? "" : "s"}`;
        if (a !== null) r += `<br>📈 Average: <b>${a}%</b> — ${a >= 80 ? "✅ Strong" : a >= 60 ? "⚠️ Needs attention" : "🚨 Concerning"} (${passing} passing, ${failing} failing)`;
        const enrolled = [...new Set(courses.flatMap(c => c.studentIds || []))];
        const unenrolled = students.filter(s => !enrolled.includes(Number(s.id)));
        if (unenrolled.length) r += `<br>⚠️ ${unenrolled.length} not enrolled`;
        return r;
      }

      if (/average|mean/.test(text) && !/student|course/.test(text)) {
        if (!gc) return "No grades yet.";
        return `📈 <b>Class Average:</b> ${a}%<br>Passing: ${passing}/${gc} (${Math.round(passing / gc * 100)}%)`;
      }

      if (/at.?risk|failing|who.*fail|struggling|need help/.test(text)) {
        if (!students.length || !gc) return "Not enough data.";
        const risk = [];
        students.forEach(s => {
          const sg = grades.filter(g => Number(g.studentId) === Number(s.id));
          const f = sg.filter(g => Number(g.score) < 60);
          if (f.length) risk.push({ name: s.name, count: f.length, avg: sg.length ? Math.round(sg.reduce((a, b) => a + Number(b.score), 0) / sg.length) : 0 });
        });
        if (!risk.length) return "✅ No at-risk students. Everyone is passing!";
        return `⚠️ <b>${risk.length} at-risk student${risk.length === 1 ? "" : "s"}</b><br>${risk.map(r => `• <b>${r.name}</b> — ${r.count} failing, avg ${r.avg}%`).join("<br>")}`;
      }

      if (/alert|notification|issue/.test(text)) {
        const alertList = [];
        const enrolled = [...new Set(courses.flatMap(c => c.studentIds ? c.studentIds.map(Number) : []))];
        students.filter(s => !enrolled.includes(Number(s.id))).forEach(s => alertList.push(`⚠️ ${s.name} not enrolled`));
        students.forEach(s => {
          const sg = grades.filter(g => Number(g.studentId) === Number(s.id));
          if (!sg.length) { alertList.push(`ℹ️ ${s.name} has no grades`); return; }
          const f = sg.filter(g => Number(g.score) < 60);
          if (f.length) alertList.push(`🚨 ${s.name}: ${f.length} failing`);
        });
        if (!alertList.length) return "✅ No alerts.";
        return `📋 ${alertList.length} alert${alertList.length === 1 ? "" : "s"}<br>${alertList.join("<br>")}`;
      }

      if (/predict|outlook|forecast|future/.test(text)) {
        if (!gc || !students.length) return "Not enough data.";
        let r = "🎯 <b>Predictions</b><br>";
        students.forEach(s => {
          const sg = grades.filter(g => Number(g.studentId) === Number(s.id));
          if (!sg.length) return;
          const av = Math.round(sg.reduce((a, b) => a + Number(b.score), 0) / sg.length);
          const status = av >= 90 ? "✅ Honors" : av >= 80 ? "✅ Good" : av >= 60 ? "⚠️ Needs support" : "🚨 At risk";
          r += `<br>• <b>${s.name}</b>: ${av}% — ${status}`;
        });
        return r;
      }

      if (/trend|over time|progress|improving|declining/.test(text)) {
        if (gc < 2) return "Need at least 2 grades.";
        const sorted = [...grades].sort((a, b) => new Date(a.date) - new Date(b.date));
        const mid = Math.floor(sorted.length / 2);
        const early = sorted.slice(0, mid), late = sorted.slice(mid);
        const eA = Math.round(early.reduce((s, g) => s + Number(g.score), 0) / early.length);
        const lA = Math.round(late.reduce((s, g) => s + Number(g.score), 0) / late.length);
        const ch = lA - eA;
        let r = `📈 <b>Trend</b><br>Earlier: ${eA}% → Recent: ${lA}%`;
        if (ch > 0) r += `<br>✅ Improving by ${Math.round(ch)}%`;
        else if (ch < 0) r += `<br>📉 Declining by ${Math.abs(Math.round(ch))}%`;
        else r += `<br>➡️ Steady`;
        return r;
      }

      // Student match
      const sMatches = students.filter(s => {
        const nameParts = s.name.toLowerCase().split(/\s+/);
        return text.includes(s.name.toLowerCase()) || text.includes(s.studentId.toLowerCase()) || nameParts.some(p => text.includes(p));
      });
      if (sMatches.length > 1 && !text.includes("recommend")) return `I found multiple students matching that name:<br>${sMatches.map(s => `• <b>${s.name}</b> (${s.studentId})`).join("<br>")}<br><br>Which one would you like to know about?`;
      const sMatch = sMatches[0];
      if (sMatch && !text.includes("recommend")) {
        const sg = grades.filter(g => Number(g.studentId) === Number(sMatch.id));
        const enrolled = courses.filter(c => (c.studentIds || []).map(Number).includes(Number(sMatch.id)));
        let r = `👤 <b>${sMatch.name}</b> (${sMatch.studentId})`;
        if (sMatch.className) r += `<br>📋 ${sMatch.className}`;
        if (sMatch.interests && sMatch.interests.length) r += `<br>🏷️ ${sMatch.interests.join(", ")}`;
        if (sMatch.careerGoal) r += `<br>🎯 Goal: ${sMatch.careerGoal}`;
        r += `<br>📚 ${enrolled.length} course${enrolled.length === 1 ? "" : "s"} · 📝 ${sg.length} grade${sg.length === 1 ? "" : "s"}`;
        if (sg.length) {
          const av = Math.round(sg.reduce((a, b) => a + Number(b.score), 0) / sg.length);
          const f = sg.filter(g => Number(g.score) < 60);
          r += `<br>📈 Average: <b>${av}%</b>${f.length ? ` ⚠️ ${f.length} failing` : av >= 80 ? " ✅ Doing great" : ""}`;
        }
        if (enrolled.length) r += `<br><br><b>Courses:</b><br>${enrolled.map(c => `• ${c.name}`).join("<br>")}`;
        return r;
      }

      // Course match
      const cMatches = courses.filter(c => {
        const nameParts = c.name.toLowerCase().split(/\s+/);
        return text.includes(c.name.toLowerCase()) || text.includes(c.code.toLowerCase()) || nameParts.some(p => text.includes(p));
      });
      if (cMatches.length > 1) return `I found multiple courses matching that name:<br>${cMatches.map(c => `• <b>${c.name}</b> (${c.code})`).join("<br>")}<br><br>Which one would you like to know about?`;
      const cMatch = cMatches[0];
      if (cMatch) {
        const cg = grades.filter(g => Number(g.courseId) === Number(cMatch.id));
        let r = `📚 <b>${cMatch.name}</b> (${cMatch.code})<br>📂 ${cMatch.category} · ${cMatch.difficulty} · ${cMatch.credits} cr`;
        if (cMatch.teacher) r += `<br>👩‍🏫 ${cMatch.teacher}`;
        r += `<br>👤 ${cMatch.studentIds?.length || 0} students · 📝 ${cg.length} grades`;
        if (cg.length) {
          const av = Math.round(cg.reduce((s, g) => s + Number(g.score), 0) / cg.length);
          r += `<br>📈 Average: <b>${av}%</b>`;
        }
        return r;
      }

      if (/recommend|suggest|what should.*take/.test(text)) {
        const mentioned = students.find(s => text.includes(s.name.toLowerCase()) || text.includes(s.studentId.toLowerCase()));
        if (!mentioned) return "Which student? Try: \"What courses should Ava take?\"";
        const sg = grades.filter(g => Number(g.studentId) === Number(mentioned.id));
        const enrolledIds = courses.filter(c => (c.studentIds || []).map(Number).includes(Number(mentioned.id))).map(c => Number(c.id));
        const avail = courses.filter(c => !enrolledIds.includes(Number(c.id)));
        if (!avail.length) return `${mentioned.name} is in all available courses!`;
        const scored = avail.map(c => {
          let score = 0, reasons = [];
          const interests = (mentioned.interests || []).map(i => i.toLowerCase());
          const cs = (c.skills || []).map(s => s.toLowerCase());
          const match = cs.filter(s => interests.includes(s));
          if (match.length) { score += 10; reasons.push("matches interests"); }
          if (mentioned.careerGoal) {
            const kw = { Engineer: ["STEM","problem-solving","algebra"], Scientist: ["STEM","analysis","scientific"], Journalist: ["Humanities","writing","critical-reading"] };
            const words = kw[mentioned.careerGoal] || [];
            if (words.some(w => [c.category.toLowerCase(), ...cs].includes(w.toLowerCase()))) { score += 15; reasons.push("aligns with career goal"); }
          }
          return { course: c, score, reasons };
        });
        const top = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
        if (!top.length) return `No strong matches for ${mentioned.name}.`;
        return `🎯 <b>For ${mentioned.name}</b><br><br>${top.map((r, i) => `${i + 1}. <b>${r.course.name}</b> — ${r.reasons.join(", ")}`).join("<br>")}`;
      }
    }

    if (/^(how many|count|stats|total)/.test(text)) {
      if (text.includes("student")) return `${students.length} student${students.length === 1 ? "" : "s"}`;
      if (text.includes("course")) return `${courses.length} course${courses.length === 1 ? "" : "s"}`;
      if (text.includes("grade")) return `${grades.length} grade${grades.length === 1 ? "" : "s"}`;
      return `${students.length} students, ${courses.length} courses, ${grades.length} grades`;
    }

    if (/list.*student|show.*student/.test(text) && students.length) {
      return `👤 <b>All Students</b><br><br>${students.map(s => `• ${s.name} (${s.studentId})`).join("<br>")}`;
    }
    if (/list.*course|show.*course/.test(text) && courses.length) {
      return `📚 <b>All Courses</b><br><br>${courses.map(c => `• ${c.name} (${c.code})`).join("<br>")}`;
    }

    return pick(["I'm not sure I understand. Try \"help\" to see what I can do!", "Hmm, I didn't catch that. Type \"help\" for options.", "Not sure what you mean. Try asking about a student or course!"]);
  }

  function addSuggested(text) {
    const chip = document.createElement("button");
    chip.className = "chat-chip";
    chip.textContent = text;
    chip.addEventListener("click", () => sendMessage(text));
    return chip;
  }

  function buildPanel() {
    panel = document.createElement("div");
    panel.className = isMobile ? "chat-panel chat-panel-mobile" : "chat-panel";

    const header = document.createElement("div");
    header.className = "chat-header";
    header.innerHTML = `<div class="chat-header-info"><span class="chat-dot"></span><span><b>AI Assistant</b><br><span class="chat-status" id="chatStatus">Ready to help</span></span></div>
      <div style="display:flex;gap:6px">
        <button class="chat-close-btn" id="chatCloseBtn" aria-label="Minimize">—</button>
      </div>`;
    panel.appendChild(header);
    panel.querySelector("#chatCloseBtn").addEventListener("click", toggle);

    msgList = document.createElement("div");
    msgList.className = "chat-msgs";
    panel.appendChild(msgList);

    const chips = document.createElement("div");
    chips.className = "chat-chips";
    ["Give me a summary", "Who is at risk?", "How is Ava doing?", "Show me trends"].forEach(t => chips.appendChild(addSuggested(t)));
    panel.appendChild(chips);

    const footer = document.createElement("div");
    footer.className = "chat-footer";
    inputEl = document.createElement("input");
    inputEl.type = "text";
    inputEl.placeholder = "Ask me anything...";
    inputEl.className = "chat-input";
    inputEl.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(inputEl.value); });
    sendBtn = document.createElement("button");
    sendBtn.className = "chat-send-btn";
    sendBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
    sendBtn.addEventListener("click", () => sendMessage(inputEl.value));
    footer.appendChild(inputEl);
    footer.appendChild(sendBtn);
    panel.appendChild(footer);

    panel.style.display = "none";
    return panel;
  }

  function init(options = {}) {
    isMobile = options.mobile || false;

    container = document.createElement("div");
    container.className = "chat-container";

    bubble = document.createElement("button");
    bubble.className = "chat-bubble";
    bubble.setAttribute("aria-label", "Open AI Assistant");
    bubble.id = "chatBubbleBtn";
    bubble.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    bubble.addEventListener("click", toggle);

    panel = buildPanel();
    container.appendChild(panel);
    container.appendChild(bubble);
    document.body.appendChild(container);

    setTimeout(() => {
      const greeting = "Hi! I'm your AI teaching assistant. Ask me about students, grades, or courses!";
      addMessage(greeting, false);
      msgList.appendChild(renderMessage(messages[messages.length - 1]));
    }, 400);
  }

  function toggle() {
    isOpen = !isOpen;
    panel.style.display = isOpen ? "flex" : "none";
    bubble.style.display = isOpen ? "none" : "flex";
    if (isOpen) setTimeout(scrollToBottom, 50);
    if (!isOpen && inputEl) inputEl.blur();
  }

  return { init, toggle, sendMessage };
}
