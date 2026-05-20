# 学校成绩管理系统 — 快速上手指南

本文一步步教你从零开始运行学校成绩管理系统。

**不需要编程经验。** 只要会复制粘贴和点击，就能完成。

同时支持 **Windows** 和 **Mac**。

---

## 这是什么？

一个给老师用的网页应用，可以管理学生、课程、成绩，还有 AI 智能分析功能。包含：

- **电脑版**（在浏览器中运行）
- **手机版**（手机上也能用）
- **后端服务器**（存储所有数据）
- **AI 助手**（智能聊天机器人）

---

## 快速启动（5 分钟）

只想马上看到效果？不需要后端，直接用演示数据：

### Windows

```powershell
# 1. 按 Windows 键，输入 "PowerShell"，打开 PowerShell
# 2. 复制粘贴这行命令，按回车：
cd "C:\Users\desktop\OneDrive\Desktop\CodeX Generated\Projects2"
python -m http.server 8000 --bind 0.0.0.0
# 3. 打开 Chrome 或 Edge，访问：
#    http://127.0.0.1:8000/index.html
```

### Mac

```bash
# 1. 打开终端（Finder → 应用程序 → 实用工具 → 终端）
# 2. 进入项目文件夹：
cd ~/Desktop/Projects2
# 3. 启动服务器：
python3 -m http.server 8000 --bind 0.0.0.0
# 4. 打开 Safari 或 Chrome，访问：
#    http://127.0.0.1:8000/index.html
```

这样就启动了！页面会直接加载演示数据，**不需要登录**。

---

## 完整安装（含后端 + 登录功能）

完整安装后，你可以注册账号、保存数据、使用 AI 功能。

---

### 第一步：安装 Python

Python 是运行后端服务器必需的。

#### Windows

1. 打开 https://www.python.org/downloads/
2. 点击黄色 **Download Python** 按钮
3. 运行下载的安装程序
4. **重要：** 勾选 **"Add Python to PATH"**（在安装器底部）
5. 点击 **Install Now**
6. 安装完成后关闭

**验证是否安装成功：** 打开 PowerShell，运行：

```powershell
python --version
```

应该看到类似 `Python 3.12.x` 的信息。

#### Mac

Mac 通常自带 Python。先检查：

```bash
python3 --version
```

如果没有安装或想更新：

1. 打开 https://www.python.org/downloads/
2. 点击黄色 **Download Python** 按钮
3. 运行安装程序，按提示操作

**验证：**

```bash
python3 --version
```

应该看到类似 `Python 3.12.x`。

---

### 第二步：打开终端

#### Windows — PowerShell

1. 按键盘上的 **Windows 键**
2. 输入 **PowerShell**
3. 点击 **Windows PowerShell**（蓝色图标）
4. 出现蓝色窗口 — 这就是终端

#### Mac — 终端

1. 点击 Dock 中的 **Finder**
2. 点击 **应用程序**
3. 点击 **实用工具**
4. 双击 **终端**
5. 出现白色（或黑色）窗口 — 这就是终端

---

### 第三步：进入项目文件夹

告诉终端项目文件在哪里。

#### Windows

复制粘贴以下命令，按回车：

```powershell
cd "C:\Users\desktop\OneDrive\Desktop\CodeX Generated\Projects2"
```

**如果报错**说找不到路径，说明文件夹在其他位置。在文件资源管理器中找到 `Projects2` 文件夹，右键点击 → **复制文件地址**。然后输入：

```powershell
cd "
```

右键粘贴，再输入 `"`，按回车。

#### Mac

如果项目在桌面上：

```bash
cd ~/Desktop/Projects2
```

如果在其他位置，输入 `cd `（加空格），然后把 `Projects2` 文件夹从 Finder 拖进终端窗口，按回车。

**确认位置正确：**

```bash
ls
```

（Windows 用：`dir`）

应该能看到 `index.html`、`script.js` 等文件和 `backend` 文件夹。

---

### 第四步：配置后端

#### 4a. 进入 backend 文件夹

**Windows:**

```powershell
cd backend
```

**Mac:**

```bash
cd backend
```

#### 4b. 创建配置文件

在 `backend` 文件夹中创建一个叫 `.env` 的文件。

**Windows (PowerShell):**

```powershell
New-Item -ItemType File -Path ".env"
```

然后用记事本打开：

```powershell
notepad .env
```

**Mac:**

```bash
touch .env
open -e .env
```

**把以下内容复制粘贴进去：**

```
SECRET_KEY=my-super-secret-key-change-this-later
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
DATABASE_URL=sqlite:///./school_grading.db
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
```

保存并关闭文件。

> **注意：** `OPENAI_API_KEY` 是可选的。没有的话留空即可 — 应用仍然可以正常运行，只是没有 AI 功能。如果需要 AI 功能，去 https://platform.openai.com/api-keys 获取密钥。

#### 4c. 安装所需软件包

**Windows:**

```powershell
pip install -r requirements.txt
```

**Mac:**

```bash
pip3 install -r requirements.txt
```

这会自动下载安装所有依赖。可能需要一两分钟。

**如果报错** "pip 不是可识别的命令"，试试：

**Windows:** `python -m pip install -r requirements.txt`
**Mac:** `python3 -m pip install -r requirements.txt`

---

### 第五步：启动后端服务器

运行以下命令：

**Windows:**

```powershell
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Mac:**

```bash
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**保持这个终端窗口打开。** 服务器正在运行中。

你应该看到类似：

```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

---

### 第六步：打开应用

打开浏览器（Chrome、Edge、Safari、Firefox），访问：

```
http://127.0.0.1:8000
```

你应该看到 **学校成绩管理系统** 的登录界面。

**开始使用：**

1. 点击顶部的 **注册**
2. 填写：
   - **姓名：** 任意名字（如 "张三"）
   - **用户名：** 任意用户名（如 "zhangsan"）
   - **邮箱：** 任意邮箱（如 "zhangsan@test.com"）
   - **密码：** 任意密码（如 "123456"）
3. 点击 **创建账号**
4. 登录成功后会自动加载演示数据，尽情探索吧！

---

### 第七步：尝试各项功能

登录后，你可以：

- **仪表盘** — 查看统计、AI 摘要、智能提醒、趋势分析和预测
- **学生管理** — 添加、编辑、删除学生；点击"查看"查看学生完整档案
- **课程管理** — 添加课程、分配学生、设置先修课程
- **成绩管理** — 记录学生的各科成绩
- **报表** — 按课程、科目、学生查看平均分
- **AI 推荐** — 选择学生，获取课程推荐
- **AI 聊天** — 点击右下角的蓝色聊天气泡，可以问：
  - "给我一个总结"
  - "谁有挂科风险？"
  - "Ava 的表现怎么样？"

---

## 手机版

应用也可以在手机上使用！

**在手机上**（需要和电脑连接同一个 Wi-Fi）：

1. 打开手机浏览器
2. 访问 `http://[你的电脑IP]:8000/mobile-app/`

查看你的电脑 IP 地址：

**Windows:** 打开 PowerShell，输入 `ipconfig`。在"无线局域网适配器 Wi-Fi"下找到 **IPv4 地址**。
**Mac:** 打开终端，输入 `ipconfig getifaddr en0`。

**示例：** 如果你的 IP 是 `192.168.1.100`，在手机上打开 `http://192.168.1.100:8000/mobile-app/`

**小技巧：** 在 iPhone 上，可以点击分享按钮 → **添加到主屏幕**，把它安装成独立应用！

---

## 常见问题

### "Python 不是可识别的命令"

Python 没有安装或没有添加到 PATH。重新运行 Python 安装程序，**勾选"Add Python to PATH"**（Windows）。Mac 用户请用 `python3` 代替 `python`。

### "pip 不是可识别的命令"

试试长格式命令：

- Windows：`python -m pip install -r requirements.txt`
- Mac：`python3 -m pip install -r requirements.txt`

### "端口 8000 已被占用"

有其他程序在使用 8000 端口。可以用其他端口：

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

然后在浏览器中打开 `http://127.0.0.1:8001`。

### "找不到模块 / No module named..."

有软件包没有安装成功。重新运行安装命令：

```bash
pip install -r requirements.txt
```

### 页面加载了但没有样式

请确保访问的是 `http://127.0.0.1:8000`（后端服务器），而不是直接双击打开 `index.html` 文件。样式需要通过服务器才能正常加载。

### 无法登录 / "凭据无效"

先注册一个新账号。如果注册过但忘了密码，可以删除数据库文件（`backend/school_grading.db`），然后重启服务器，从头开始。

---

## 常用命令速查

### 启动后端服务器

```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 仅启动前端（无后端，仅演示数据）

```bash
python -m http.server 8000 --bind 0.0.0.0
```
然后访问 `http://127.0.0.1:8000/index.html`。

### 停止服务器

在运行服务器的终端窗口中按 **`Ctrl + C`**。

### 重置全部数据

删除 `backend/school_grading.db` 文件，然后重启后端服务器。数据库会自动重新创建。

---

## 更多资料

- `TECHNICAL_REPORT.md` — 详细的技术架构说明（英文）
- `getstarted.md` — 英文版入门指南
- `backend/routers/` 文件夹 — 查看 API 接口是如何工作的
- `script.js` — 前端核心逻辑
