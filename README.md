# ⚡ DevPulse AI Code Review Studio (Windows Edition)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20GenAI-gemini--3.8--flash-orange.svg)](https://ai.google.dev/)
[![Platform](https://img.shields.io/badge/Platform-Windows%2011%20%7C%20Web-0078D6.svg)](https://microsoft.com/windows)

A desktop-grade, AI-powered code review platform that simulates feedback from a **Senior Software Engineer**, **Senior QA Engineer (SDET Lead)**, and **Engineering Manager** across four core engineering pillars:

1. 🐛 **Bugs & Logic Flaws**
2. 🛡️ **Security Vulnerabilities (OWASP & CVEs)**
3. ⚡ **Performance Bottlenecks & Concurrency Races**
4. 🏗️ **Architecture & Technical Debt**

---

## 🌟 Key Features

- **Windows 11 Fluent App Design**: Native Windows title bar controls, Mica/dark glassmorphic surfaces, workspace breadcrumbs, and split/editor/review layout toggling.
- **Smart Source Editor**: Line-numbered gutter, synced scroll, tab indentation (2 spaces), character & line counters, and direct **`[ ↺ Resubmit Code (Ctrl+Enter) ]`** action.
- **Interactive Line Navigation**: Clicking any issue line pill in the review dashboard automatically highlights and scrolls to that line in the source editor.
- **Three-Persona Committee Simulation**:
  - **Senior Software Engineer**: Clean code patterns, TypeScript strictness, code smells, idiomatic conventions, and inline syntax advice.
  - **Senior QA Engineer (SDET Lead)**: Edge cases, boundary failures, chaos scenarios, structured test matrix, and copyable automated unit test suite.
  - **Engineering Manager (Director of Eng)**: Architectural coupling, OWASP security posture, scalability thresholds, technical debt scoring, and PR merge verdict (**Critical Blocker**, **Changes Requested**, **Approved with Comments**, or **Approved**).
- **Production Refactoring & Diff Engine**: 1-click **"Apply to Editor"** to immediately update your source code with the hardened, refactored version.
- **Interactive "Ask the Reviewers" Q&A Chat**: Follow-up chat thread allowing you to query the Senior SWE, QA Engineer, Eng Manager, or the joint panel with markdown code blocks.
- **Export Hub**: Copy or download formatted GitHub/GitLab PR review comments in Markdown, structured JSON audit reports, or clean refactored files.
- **Windows .exe Packaging Ready**: Configured with `electron-main.cjs` to build native Windows standalone `.exe` installers.

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/devpulse-code-review-studio.git
cd devpulse-code-review-studio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure your API key
Create a `.env` file in the project root:
```bash
cp .env.example .env
```
Inside `.env`, set:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

### 4. Start the application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Packaging as a Windows `.exe` Desktop Application

### Option A: Direct Web App / PWA Install (No Compiler Required)
1. Open [http://localhost:3000](http://localhost:3000) in **Google Chrome** or **Microsoft Edge**.
2. Click the **Install App icon** in the address bar (or menu `⋮` → **Apps** → **Install DevPulse Review Studio**).
3. Select **"Pin to Taskbar"** and **"Create Desktop Shortcut"**.

### Option B: Build a Standalone `.exe` via Nativefier
```powershell
npx nativefier --name "DevPulse Studio" --platform "windows" --arch "x64" --single-instance "http://localhost:3000"
```

### Option C: Build a Complete Electron `.exe` Installer
```bash
npm install -D electron electron-builder
npm run build
npx electron-builder --win
```
The installer wizard will be generated in `dist/DevPulse Setup.exe`.

---

## 📁 Project Structure

```
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore rules
├── electron-main.cjs        # Native Electron desktop wrapper
├── index.html               # Main HTML entry point
├── package.json             # NPM dependencies & scripts
├── server.ts                # Express backend with Gemini API proxy & Vite middleware
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── src/
    ├── App.tsx              # Main studio workspace container
    ├── index.css            # Tailwind CSS & Windows styling
    ├── main.tsx             # React entry point
    ├── components/
    │   ├── CodeEditor.tsx        # Source code editor with line numbers & Resubmit button
    │   ├── EngManagerTab.tsx     # Engineering Manager architectural & security view
    │   ├── ExportModal.tsx       # Export Markdown, JSON, and refactored artifacts
    │   ├── IssuesList.tsx        # Filterable issues matrix (Pillar & Severity)
    │   ├── PrContextModal.tsx    # PR SLA, constraints, and context settings
    │   ├── RefactoredCodeView.tsx# Production refactored code viewer & diff applier
    │   ├── ReviewOverview.tsx    # PR verdict banner, score, and vector metrics
    │   ├── ReviewerChat.tsx      # Interactive follow-up Q&A with personas
    │   ├── SeniorQaTab.tsx       # Senior QA test cases and unit test suite
    │   ├── SeniorSweTab.tsx      # Senior SWE clean code and line-by-line feedback
    │   ├── TitleBar.tsx          # Windows 11 Fluent title bar & controls
    │   ├── Toolbar.tsx           # Command ribbon with language, presets & resubmit
    │   └── WindowsExeModal.tsx   # Windows .exe packaging modal
    ├── data/
    │   └── samples.ts            # Realistic vulnerability presets (Node, React, Python, Go, SQL)
    └── types/
        └── review.ts             # TypeScript domain types & API schemas
```

---

## 📜 Available Scripts

- `npm run dev` - Starts the full-stack development server on port 3000.
- `npm run build` - Compiles the client application to the `dist/` directory.
- `npm run lint` - Runs TypeScript compilation checks (`tsc --noEmit`).
- `npm start` - Launches the production Express server.

---

## 📄 License
MIT License. Feel free to use and adapt for your engineering team!
