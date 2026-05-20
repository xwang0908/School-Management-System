# School-Management-System
A full-stack school grading system for Windows (desktop browser) and mobile (PWA) with a shared FastAPI+SQLite backend. Supports student/course/grade CRUD, JWT auth, offline caching, AI chat, course recommendations, and analytics — deployed standalone or served by the API.


# Get Started Guide

This guide walks you through **everything** from zero to running the School Grading System on your computer.

**No coding experience needed.** If you can copy-paste and click, you can do this.

We cover **Windows** and **Mac**.

---

## What You're Building

A web app for teachers to manage students, courses, grades, and get AI-powered insights. It has:

- A **desktop version** (works in any browser)
- A **mobile version** (works on your phone)
- A **backend server** that stores all data
- An **AI assistant** chat bot

---

## Quick Start (5 minutes)

If you want to run it **right now** without the backend (just the frontend with demo data):

### Windows

```powershell
# 1. Open PowerShell (press Windows key, type "powershell", press Enter)
# 2. Copy-paste this and press Enter:
cd "C:\Users\desktop\OneDrive\Desktop\CodeX Generated\Projects2"
python -m http.server 8000 --bind 0.0.0.0
# 3. Open Chrome/Firefox and go to:
#    http://127.0.0.1:8000/index.html
```

### Mac

```bash
# 1. Open Terminal (Finder → Applications → Utilities → Terminal)
# 2. Navigate to the project folder:
cd /path/to/Projects2
# 3. Start the server:
python3 -m http.server 8000 --bind 0.0.0.0
# 4. Open Safari/Chrome and go to:
#    http://127.0.0.1:8000/index.html
```

That's it. The app loads with demo data — no login needed.

---

## Full Setup (With Backend + Login)

This gives you the full experience: user accounts, saved data that persists, and AI features.

---

### Step 1: Install Python

Python is needed to run the backend server.

#### Windows

1. Go to https://www.python.org/downloads/
2. Click the big yellow **Download Python** button
3. Run the installer
4. **IMPORTANT:** Check the box that says **"Add Python to PATH"** (at the bottom of the installer)
5. Click **Install Now**
6. Close the installer

**Verify it worked:** Open PowerShell and run:

```powershell
python --version
```

You should see something like `Python 3.12.x`.

#### Mac

Mac usually comes with Python already. Check:

```bash
python3 --version
```

If you don't have it (or want the latest):

1. Go to https://www.python.org/downloads/
2. Click the big yellow **Download Python** button
3. Run the installer
4. Follow the steps

**Verify it worked:**

```bash
python3 --version
```

You should see something like `Python 3.12.x`.

---

### Step 2: Open the Right Terminal

#### Windows — PowerShell

1. Press the **Windows key** on your keyboard
2. Type **PowerShell**
3. Click **Windows PowerShell** (the blue icon)
4. A blue window opens — this is your terminal

#### Mac — Terminal

1. Click the **Finder** icon in the dock
2. Click **Applications** in the sidebar
3. Click **Utilities**
4. Double-click **Terminal**
5. A white (or dark) window opens — this is your terminal

---

### Step 3: Navigate to the Project

You need to tell the terminal where the project files are.

#### Windows

Copy and paste this **exact command** into PowerShell, then press Enter:

```powershell
cd "C:\Users\desktop\OneDrive\Desktop\CodeX Generated\Projects2"
```

**If you get an error** like "cannot find path", the folder might be in a different location. Find the `Projects2` folder in File Explorer, right-click it, and select **Copy as path**. Then type:

```powershell
cd "
```

then right-click to paste, then type `"` and press Enter.

#### Mac

If you put the project on your Desktop:

```bash
cd ~/Desktop/Projects2
```

If it's somewhere else, type `cd ` (with a space) and drag the `Projects2` folder from Finder into the Terminal window, then press Enter.

**To check you're in the right place:**

```bash
ls
```

(On Windows: `dir`)

You should see files like `index.html`, `script.js`, and a folder called `backend`.

---

### Step 4: Set Up the Backend

The backend is a Python server that stores your data in a database.

#### 4a. Go into the backend folder

**Windows:**

```powershell
cd backend
```

**Mac:**

```bash
cd backend
```

#### 4b. Create a configuration file

Create a file called `.env` in the `backend` folder.

**Windows (PowerShell):**

```powershell
New-Item -ItemType File -Path ".env"
```

Then open it in Notepad:

```powershell
notepad .env
```

**Mac:**

```bash
touch .env
open -e .env
```

**Paste this into the file:**

```
SECRET_KEY=my-super-secret-key-change-this-later
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
DATABASE_URL=sqlite:///./school_grading.db
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
```

Save and close the file.

> **Note:** `OPENAI_API_KEY` is optional. Leave it blank if you don't have one — the app still works, just without AI features. If you want AI, get a key from https://platform.openai.com/api-keys and paste it there.

#### 4c. Install the required packages

**Windows:**

```powershell
pip install -r requirements.txt
```

**Mac:**

```bash
pip3 install -r requirements.txt
```

This downloads and installs everything the backend needs. It might take a minute.

**If you get an error** like "pip is not recognized", try:

**Windows:** `python -m pip install -r requirements.txt`
**Mac:** `python3 -m pip install -r requirements.txt`

---

### Step 5: Start the Backend Server

Run this command:

**Windows:**

```powershell
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Mac:**

```bash
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Leave this terminal window open.** The server is now running.

You should see something like:

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

---

### Step 6: Open the App

Open your web browser (Chrome, Edge, Safari, Firefox) and go to:

```
http://127.0.0.1:8000
```

You should see the **School Grading System** login screen.

**To get started with the app:**

1. Click **Register** at the top
2. Enter:
   - **Full Name:** Any name (e.g., "Jane Smith")
   - **Username:** Pick any username (e.g., "jane")
   - **Email:** Any email (e.g., "jane@test.com")
   - **Password:** Any password (e.g., "password123")
3. Click **Create Account**
4. You're now logged in with demo data ready to explore!

---

### Step 7: Try It Out

Once logged in, here's what you can do:

- **Dashboard** — See stats, AI summary, alerts, trends, and predictions
- **Students** — Add, edit, delete students; click "View" to see a student's full profile
- **Courses** — Add courses, assign students, set prerequisites
- **Grades** — Record grades for students in courses
- **Reports** — See grade averages by course, subject, and student
- **AI Recommender** — Select a student and get course recommendations
- **AI Chat** — Click the blue chat bubble in the bottom-right corner and ask questions like:
  - "Give me a summary"
  - "Who is at risk?"
  - "How is Ava doing?"

---

## Mobile Version

The app also works on your phone!

**On your phone** (same Wi-Fi network as your computer):

1. Open the browser
2. Go to `http://[YOUR-COMPUTER-IP]:8000/mobile-app/`

To find your computer's IP:

**Windows:** Open PowerShell and type `ipconfig`. Look for `IPv4 Address` under your Wi-Fi adapter.
**Mac:** Open Terminal and type `ipconfig getifaddr en0`.

**Example:** If your IP is `192.168.1.100`, open `http://192.168.1.100:8000/mobile-app/` on your phone.

**Pro tip:** On iPhone, you can tap the Share button → **Add to Home Screen** to install it as a standalone app!

---

## Need Help? Troubleshooting

### "Python is not recognized" / "command not found"

Python isn't installed or not in PATH. Re-run the Python installer and check **"Add Python to PATH"** (Windows) or use `python3` instead of `python` (Mac).

### "pip is not recognized" / "command not found"

Try using the longer form:

- Windows: `python -m pip install -r requirements.txt`
- Mac: `python3 -m pip install -r requirements.txt`

### "Address already in use" / "port 8000 already in use"

Something else is using port 8000. You can use a different port:

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

Then open `http://127.0.0.1:8001` in your browser.

### "No module named..."

Some packages didn't install. Run the install command again:

```bash
pip install -r requirements.txt
```

### The app loads but looks plain / no styles

Make sure you're accessing `http://127.0.0.1:8000` (the backend server) and not opening the `index.html` file directly from your file system. The styles need the server to load correctly.

### Can't log in / "Invalid credentials"

Try registering a new account first. If you already registered but forgot your password, you can delete the database file (`backend/school_grading.db`) and restart the server to start fresh.

---

## Quick Reference: Common Commands

### Start the backend server

```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Start just the frontend (no backend, demo data only)

```bash
python -m http.server 8000 --bind 0.0.0.0
```
Then open `http://127.0.0.1:8000/index.html`.

### Stop a running server

Press `Ctrl + C` in the terminal window where the server is running.

### Reset everything

Delete the database file `backend/school_grading.db`, then restart the backend server. The database will be recreated automatically.

---

## What's Next?

- Read `TECHNICAL_REPORT.md` for a deep dive into the architecture
- Read `Start_README.md` (Chinese) for basic server startup instructions
- Check the `backend/routers/` folder to see how the API endpoints work
- Check `script.js` to understand the frontend logic
