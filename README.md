# ⛅ Aether Weather Dashboard

A full-stack weather web application with a complete **CI/CD DevOps pipeline**  automatically built, tested, containerized, and deployed to the cloud on every code push.

---

## 🌐 Live Demo

**👉 [https://weather-dashboard-devops.onrender.com](https://weather-dashboard-devops.onrender.com)**

> Free tier may take 30-60 seconds to wake up after inactivity.

---

## 🔄 Pipeline Flow

```
Push Code → GitHub → Webhook → Jenkins → Build → ESLint → Jest → Docker → Render → LIVE
```

Every push to `main` triggers the entire pipeline **automatically**  no manual steps.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| **Node.js + Express** | Backend server and REST API |
| **GitHub** | Version control and webhook trigger |
| **Jenkins** | CI/CD automation server |
| **ESLint** | Static code analysis |
| **Jest + Supertest** | Automated API testing |
| **Docker** | Containerization |
| **Render** | Cloud deployment |
| **ngrok** | Webhook tunnel for local Jenkins |

---

## 📁 Project Structure

```
weather-dashboard-devops/
├── server.js              # Express backend — 3 API endpoints
├── package.json           # Dependencies and npm scripts
├── Jenkinsfile            # CI/CD pipeline — 6 stages
├── Dockerfile             # Container build instructions
├── .dockerignore
├── .eslintrc.json
├── public/
│   └── index.html         # Aether Weather frontend UI
└── __tests__/
    └── app.test.js        # Jest test cases
```

---

## 🚀 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Serves the frontend page |
| `GET /health` | Health check — returns `{ status: "OK" }` |
| `GET /api/weather?city=Pune` | Returns weather data for the city |

---

## 🧪 Tests

```
✓ GET /health returns status 200
✓ GET /health returns status OK in body
✓ GET /api/weather returns city data
✓ GET /api/weather has temperature field

Tests: 4 passed, 4 total — Coverage: 82.35%
```

---

## 🐳 Run with Docker

```bash
docker build -t weather-dashboard .
docker run -p 3001:3000 weather-dashboard
```

Open **http://localhost:3001**

---

## 💻 Run Locally

```bash
git clone https://github.com/vrunani/weather-dashboard-devops.git
cd weather-dashboard-devops
npm install
node server.js
```

Open **http://localhost:3000**

---

## 📝 Scripts

```bash
npm start        # Start the server
npm test         # Run Jest tests with coverage
npm run lint     # Run ESLint
```
