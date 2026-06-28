# ⚡ CodeForge — Next-Gen DSA & Interview Preparation Platform

![CodeForge Banner](https://img.shields.io/badge/CodeForge-DSA%20Platform-0284C7?style=for-the-badge&logo=codeforces&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Cloud-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**CodeForge** is an advanced, high-performance web platform designed for software engineers and DSA warriors to practice Data Structures & Algorithms, explore company-specific interview questions, track real-time progress analytics, and execute code instantly with isolated sandboxed runners.

---

## 📋 Table of Contents
1. [🌟 Key Features](#-key-features)
2. [💻 Tech Stack (A-Z)](#-tech-stack-a-z)
3. [⚙️ Code Execution Architecture](#%EF%B8%8F-code-execution-architecture)
4. [🌐 External APIs & Integrations](#-external-apis--integrations)
5. [🗄️ Database Schema & Data Models](#%EF%B8%8F-database-schema--data-models)
6. [🚀 Installation & Setup Guide](#-installation--setup-guide)
7. [📡 Complete REST API Documentation](#-complete-rest-api-documentation)

---

## 🌟 Key Features

- **🛸 3D Animated Dashboard & Landing Page**: Futuristic glassmorphic UI with light/dark theme toggling, floating holograms, and interactive cards (*Problems Solved*, *LeetCode Heatmap*, *Contest Rating*, *Difficulty Distribution*, and *Current Streak*).
- **📝 Monaco Code Editor Integration**: Integrated VS Code-like coding environment supporting **Java 17**, **Python 3**, and **C++ 17** with 6 specialized tools:
  1. `Format Code`: High-speed AST formatting.
  2. `Retrieve Last Submitted Code`: Instant memory and database code sync.
  3. `Reset Code Definition`: Restore standard starter code template.
  4. `Submission History & Charts`: LeetCode-style runtime & memory percentile bar charts.
  5. `Full Editor Mode`: Expand code area and hide description.
  6. `Exam Fullscreen`: Fullscreen mode for distraction-free practice.
- **📚 382+ Curated DSA Problems**: Complete problem database categorized by difficulty (*Easy*, *Medium*, *Hard*), topics (*Arrays*, *Trees*, *Dynamic Programming*, *Graphs*), and company tags (*Google*, *Amazon*, *Microsoft*, *Meta*, *Uber*, *Atlassian*).
- **💡 Multi-Paragraph Explanations & Official Hints**: Comprehensive problem statements with parsed multi-line examples, input/output samples, constraints, and revealable hints.
- **📊 Real-Time Analytics & Heatmaps**: Annual submission contribution grids, active streak tracking, and daily activity metrics.
- **🔒 Secure JWT Authentication**: End-to-end user authentication with encrypted passwords and stateless authorization tokens.

---

## 💻 Tech Stack (A-Z)

### **Frontend Architecture**
- **Core Framework**: React 19 (`react`, `react-dom`) with TypeScript 6.0.
- **Build Tool & Dev Server**: Vite 8.0.
- **Code Editor**: Monaco Editor React (`@monaco-editor/react`).
- **Styling & UI**: Vanilla CSS + TailwindCSS 3.4 with custom 3D glassmorphism and keyframe utilities.
- **Icons & Animations**: Lucide React (`lucide-react`) and Framer Motion (`framer-motion`).
- **Data Visualization**: Recharts (`recharts`) for performance distribution and activity tracking.
- **HTTP Client**: Axios (`axios`) configured with request/response interceptors for automatic JWT handling.

### **Backend Architecture**
- **Core Framework**: Java 17 with Spring Boot 3.x (`spring-boot-starter-web`).
- **Security & Auth**: Spring Security + JJWT (Java JWT) for stateless authentication.
- **Persistence Layer**: Spring Data JPA + Hibernate ORM.
- **Boilerplate Reduction**: Project Lombok (`@Getter`, `@Setter`, `@Builder`, `@Slf4j`).
- **Build Tool**: Apache Maven (`mvnw`).

### **Database Infrastructure**
- **Database Engine**: Neon Serverless Cloud PostgreSQL (`postgresql://...aws.neon.tech/neondb`).
- **JSON Serializers**: Jackson Databind for mapping JSON arrays (`sample_test_cases`, `hints`, `starter_code`).

---

## ⚙️ Code Execution Architecture

CodeForge implements a high-speed, isolated execution engine (`CodeExecutionService.java`) capable of compiling and running user solutions across multiple languages with sub-second latency.

```
+-------------------+      Base64 Encoded Source       +--------------------+
|   Monaco Editor   | -------------------------------> |  Spring Boot API   |
|   (Frontend)      |                                  |  (CodeExecution)   |
+-------------------+                                  +--------------------+
                                                                 |
                                                                 v
                                                       +--------------------+
                                                       | Base64 Decoder &   |
                                                       | Test Harness Wrap  |
                                                       +--------------------+
                                                                 |
                                                                 v
                                                       +--------------------+
                                                       | Temp Dir Sandbox   |
                                                       | (ProcessBuilder)   |
                                                       +--------------------+
                                                                 |
                                             +-------------------+-------------------+
                                             |                                       |
                                             v                                       v
                                   +-------------------+                   +-------------------+
                                   |  javac / g++ / py |                   |  Stdout / Stderr  |
                                   |  Compilation      |                   |  3s Execution TLE |
                                   +-------------------+                   +-------------------+
                                             |                                       |
                                             +-------------------+-------------------+
                                                                 |
                                                                 v
                                                       +--------------------+
                                                       | Evaluate Pass/Fail |
                                                       | & Return JSON DTO  |
                                                       +--------------------+
```

### **Step-by-Step Execution Workflow**:

1. **Client Code Submission**:
   - User writes solution code in Monaco Editor.
   - Upon clicking **Run** or **Submit**, the source code and language ID are Base64 encoded (`btoa(encodeURIComponent(code))`) to prevent encoding issues with special characters and newline breaks.
   - Sent via `POST /api/problems/{id}/run` or `POST /api/problems/{id}/submit`.

2. **Language ID Mapping (Judge0 Compatible)**:
   - **Java 17**: `LanguageId = 62 / 91` -> Compiled via `javac Main.java` and executed via `java Main`.
   - **Python 3**: `LanguageId = 71 / 92` -> Executed via `python3 Main.py`.
   - **C++ 17**: `LanguageId = 54 / 75` -> Compiled via `g++ -O3 Main.cpp -o Main` and executed via `./Main`.

3. **Sandboxed File Creation**:
   - Spring Boot creates an isolated temporary working directory: `Files.createTempDirectory("codeforge-local-exec-")`.
   - Source code is written into a clean source file inside the temp folder (`Main.java`, `Main.py`, or `Main.cpp`).

4. **Test Harness Injection**:
   - For problem submissions, the execution engine wraps the user's function inside a custom test harness driver that feeds inputs from `sample_test_cases` into standard input (`stdin`) and parses standard output (`stdout`).

5. **Subprocess Spawning & Timeouts**:
   - Spawns an isolated native OS process using `ProcessBuilder`.
   - Enforces strict execution timeouts (3.0 seconds maximum) to catch infinite loops and return **Time Limit Exceeded (TLE)**.
   - Intercepts error streams (`getErrorStream`) to return clean **Compile Error** or **Runtime Error** stack traces.

6. **Result Evaluation & Cleanup**:
   - Compares actual execution output against expected outputs.
   - Cleans up temporary directory and temporary files immediately upon completion.
   - Returns detailed JSON response with runtime, memory consumption, passed test case counts, and status badges.

---

## 🌐 External APIs & Integrations

### 1. **LeetCode GraphQL API**
- **Endpoint**: `https://leetcode.com/graphql`
- **Purpose**: Used by backend data enrichment scripts (`fetch_leetcode_data.py`, `enrich_all_problems.py`) to parse problem statements, sample test cases, multi-paragraph explanations, official hints, and company tags.

### 2. **Neon Serverless PostgreSQL Cloud**
- **Endpoint**: `ep-bitter-bonus-aqt125cn.c-8.us-east-1.aws.neon.tech`
- **Purpose**: High-availability cloud PostgreSQL instance hosting production problem records, user accounts, submission history logs, and solution notes.

### 3. **Judge0 API Conventions**
- **Convention**: Adheres to Judge0 RapidAPI standard status IDs and language mapping codes, ensuring modular compatibility with cloud execution engines.

---

## 🗄️ Database Schema & Data Models

| Entity Table | Primary Key | Description & Main Attributes |
| :--- | :--- | :--- |
| **`users`** | `id` (Long) | User accounts (`name`, `email`, `password`, `problems_solved`, `current_streak`, `max_streak`, `created_at`). |
| **`problems`** | `id` (Long) | Problem details (`title`, `slug`, `difficulty`, `problem_statement`, `sample_test_cases`, `starter_code`, `constraints`, `hints`). |
| **`submissions`** | `id` (Long) | User problem submissions (`user_id`, `problem_id`, `source_code`, `language`, `status`, `runtime`, `memory`, `solved`, `submitted_at`). |
| **`topics`** | `id` (Long) | Major DSA categories (*Arrays*, *Dynamic Programming*, *Trees*). |
| **`companies`** | `id` (Long) | Product company profiles (*Google*, *Amazon*, *Microsoft*, *Meta*). |
| **`daily_activity`**| `id` (Long) | Daily solve counts for contribution heatmaps (`user_id`, `activity_date`, `count`). |
| **`bookmarks`** | `id` (Long) | User bookmarked problems (`user_id`, `problem_id`, `created_at`). |
| **`notes`** | `id` (Long) | Persistent personal problem solution notes (`user_id`, `problem_id`, `content`, `updated_at`). |

---

## 🚀 Installation & Setup Guide

### **Prerequisites**
- **Java Development Kit (JDK)**: Java 17 or higher
- **Node.js**: v18.x or higher
- **Package Manager**: npm or yarn
- **Git**

### **1. Clone Repository**
```bash
git clone https://github.com/Vijaybabu9194/Codeforge-Application.git
cd Codeforge-Application
```

### **2. Backend Setup (Spring Boot)**
```bash
cd backend
# Build and run backend dev server
./mvnw spring-boot:run
```
*Backend will start on `http://localhost:8080`*

### **3. Frontend Setup (React + Vite)**
```bash
cd ../frontend
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*Frontend will start on `http://localhost:5173`*

---

## 📡 Complete REST API Documentation

### **Authentication (`/api/auth`)**
- `POST /api/auth/register` — Register new developer account.
- `POST /api/auth/login` — Authenticate and retrieve JWT bearer token.
- `GET /api/auth/me` — Retrieve current logged-in user profile.

### **Problems (`/api/problems`)**
- `GET /api/problems` — Fetch paginated problems list with filter options (`topicId`, `companyId`, `difficulty`, `search`, `status`).
- `GET /api/problems/{id}` — Fetch full details for a specific problem.
- `POST /api/problems/{id}/run` — Run user code against sample test cases.
- `POST /api/problems/{id}/submit` — Formally submit solution, execute tests, update streak & submission history.

### **Submissions & Profile (`/api/profile`, `/api/problems`)**
- `GET /api/problems/{id}/submissions` — Fetch submission history for a problem.
- `GET /api/problems/{id}/last-submission` — Retrieve last submitted source code.
- `GET /api/profile/activity` — Fetch daily activity contribution heatmap data.
- `GET /api/profile/stats` — Fetch solved statistics breakdown by difficulty.

### **Notes & Bookmarks**
- `GET /api/problems/{id}/notes` — Retrieve saved note for a problem.
- `POST /api/problems/{id}/notes` — Save/update note for a problem.
- `POST /api/problems/{id}/bookmark` — Toggle bookmark status for a problem.

---

<p center="align">
  <b>Built with ❤️ for Software Engineers & DSA Warriors.</b>
</p>
