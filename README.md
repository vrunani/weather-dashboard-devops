# ⛅ NOVA — Atmospheric Data System

A full-stack weather dashboard with a complete **CI/CD DevOps pipeline**.
Built, tested, containerized, and deployed automatically on every push.

---

## 🌐 Live Demo

**👉 [https://weather-dashboard-devops-igew.onrender.com/](https://weather-dashboard-devops-igew.onrender.com/)**

> Free tier may take 30-60 seconds to wake up.

---

## 🖥️ Interface

- Terminal-style header: `NOVA / ATMOSPHERIC DATA SYSTEM`
- Live clock display (e.g. `08:11:08`)
- City search via `$ city` command input
- `Run →` button to fetch data

### Data Shown

- Location + local time (e.g. `Pune, IN / 01:38 pm`)
- Condition label (e.g. `LIGHT DRIZZLE`)
- Temperature, feels-like, daily high/low
- Wind speed, direction, degrees
- Humidity %
- Pressure (hPa)
- Visibility (km)
- Wind speed (m/s)
- Sunrise time
- Sunset time

---

## 🔄 Pipeline Flow

```
Push Code → GitHub → Webhook → Jenkins → Build → ESLint → Jest → Docker → Render → LIVE
```

- Every push to `main` runs the full pipeline.
- No manual steps needed.

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
├── Jenkinsfile             # CI/CD pipeline — 6 stages
├── Dockerfile              # Container build instructions
├── .dockerignore
├── .eslintrc.json
├── public/
│   └── index.html          # NOVA frontend UI
└── __tests__/
    └── app.test.js          # Jest test cases
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
