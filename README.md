# ⛅ Weather Dashboard — CI/CD DevOps Pipeline

> **Cummins College of Engineering for Women, Pune**
> 20PECE 601A : DevOps Fundamentals | Semester II, 2025–2026

---

## 🌐 Live Application

**👉 [https://weather-dashboard-devops.onrender.com](https://weather-dashboard-devops.onrender.com)**

> Note: Free tier may take 30–60 seconds to wake up after inactivity. This is expected behavior.

---

## 📌 Problem Statement

Build and deploy a weather information web application using a **complete DevOps CI/CD pipeline** that automates the entire software delivery lifecycle — from writing code to deploying a live application on the cloud — without any manual intervention after a code push.

---

## 🔄 Pipeline Flow

```
Push Code → GitHub → Webhook → Jenkins → Build → ESLint → Jest → Docker → Render → LIVE
```

Every time code is pushed to the `main` branch, the entire pipeline triggers **automatically**:

| Step | Tool | What Happens |
|------|------|-------------|
| 1 | Git + GitHub | Developer pushes code to main branch |
| 2 | GitHub Webhook + ngrok | GitHub sends signal to Jenkins automatically |
| 3 | Jenkins — Checkout | Jenkins pulls latest code from GitHub |
| 4 | Jenkins — npm install | All dependencies installed and verified |
| 5 | Jenkins — ESLint | Code quality checked, zero errors required |
| 6 | Jenkins — Jest | 4 automated tests must pass |
| 7 | Jenkins — Docker | App packaged into Docker container |
| 8 | Render | Live app auto-redeployed from GitHub |

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| **GitHub** | Version control, branching, webhook trigger |
| **Jenkins** | CI/CD automation server — runs all pipeline stages |
| **Node.js + Express** | Backend web server and REST API |
| **npm** | Package manager and build scripts |
| **ESLint** | Static code analysis and style enforcement |
| **Jest + Supertest** | Automated API testing framework |
| **Docker** | Containerization for consistent deployment |
| **Render** | Cloud hosting with auto-deploy on push |
| **ngrok** | Exposes local Jenkins to internet for webhooks |

---

## 📁 Project Structure

```
weather-dashboard-devops/
├── server.js              # Node.js + Express backend (3 API endpoints)
├── package.json           # npm config, dependencies, and scripts
├── Jenkinsfile            # CI/CD pipeline definition (6 stages)
├── Dockerfile             # Container build instructions
├── .dockerignore          # Files excluded from Docker image
├── .eslintrc.json         # ESLint rules configuration
├── .eslintignore          # Folders ESLint skips
├── .gitignore             # Files excluded from Git
├── README.md              # Project documentation
├── public/
│   └── index.html         # Aether Weather — frontend UI
└── __tests__/
    └── app.test.js        # Jest automated test cases (4 tests)
```

---

## 🚀 API Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/` | GET | Serves the frontend Weather Dashboard page | HTML |
| `/health` | GET | Health check — used by Jest tests | `{ status: "OK" }` |
| `/api/weather?city=Pune` | GET | Returns weather data for the city | JSON weather object |

### Sample API Response
```json
{
  "city": "Pune",
  "temperature": "28 C",
  "humidity": "65%",
  "condition": "Partly Cloudy"
}
```

---

## 🧪 Automated Tests

4 Jest tests run automatically in the Jenkins pipeline on every push:

```
PASS __tests__/app.test.js
  Weather Dashboard Tests
    ✓ GET /health returns status 200
    ✓ GET /health returns status OK in body
    ✓ GET /api/weather returns city data
    ✓ GET /api/weather has temperature field

Tests: 4 passed, 4 total
Coverage: 82.35% statements
```

---

## 🐳 Docker

### Build Image
```bash
docker build -t weather-dashboard .
```

### Run Container
```bash
docker run -p 3001:3000 weather-dashboard
```

Then open: **http://localhost:3001**

### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## ⚙️ Jenkins Pipeline — 6 Stages

```groovy
pipeline {
  agent any
  tools { nodejs 'NodeJS-18' }
  stages {
    stage('Checkout')            { steps { checkout scm } }
    stage('Build - npm Install') { steps { bat 'npm install' } }
    stage('Static Analysis')     { steps { bat 'npm run lint' } }
    stage('Test - Jest')          { steps { bat 'npm test' } }
    stage('Docker Build')         { steps { bat 'docker build -t weather-dashboard .' } }
    stage('Deploy Notification') { steps { echo 'Pipeline complete!' } }
  }
}
```

If **any stage fails**, the pipeline stops and nothing gets deployed — protecting the live app from broken code.

---

## 🌿 Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production branch — Jenkins and Render watch this branch |
| `dev` | Development branch — new features developed here before merging |

---

## 💻 Run Locally

### Prerequisites
- Node.js 18+
- npm
- Docker Desktop (for Docker steps)

### Steps
```bash
# Clone the repository
git clone https://github.com/vrunani/weather-dashboard-devops.git
cd weather-dashboard-devops

# Install dependencies
npm install

# Run ESLint
npm run lint

# Run tests
npm test

# Start the server
node server.js
```

Open **http://localhost:3000** in your browser.

---

## 👥 Team Members & Contributions

| Member | Role | Responsibilities |
|--------|------|-----------------|
| Member 1 | Repository Manager | GitHub repo setup, branches, webhook, README |
| Member 2 | Application Developer | server.js, package.json, ESLint config, frontend UI |
| Member 3 | DevOps Engineer | Jenkins setup, Jenkinsfile, Jest test cases, ngrok |
| Member 4 | Infrastructure & Deployment | Dockerfile, .dockerignore, Render deployment |

---

## 📊 Evaluation Rubric — 25 Marks

| S.N | Criteria | Marks | Status |
|-----|----------|-------|--------|
| 1 | Problem Definition & Planning | 2 | ✅ |
| 2 | Version Control — Git | 4 | ✅ |
| 3 | Automated Build Process | 4 | ✅ |
| 4 | CI & Testing | 5 | ✅ |
| 5 | Containerization (Docker) | 3 | ✅ |
| 6 | Deployment to Cloud | 3 | ✅ |
| 7 | Demo & Q&A | 4 | ✅ |
| **Total** | | **25** | **✅** |

---

## 📝 npm Scripts

```bash
npm start       # Start the server (node server.js)
npm run build   # Install all dependencies (npm install)
npm test        # Run Jest tests with coverage (jest --coverage)
npm run lint    # Run ESLint static analysis
```

---

*Weather Dashboard — DevOps CI/CD Pipeline | Cummins College of Engineering for Women, Pune*
