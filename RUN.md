# MY Tuition — Run Guide

## Prerequisites
- Python 3.11+
- Node.js 18+
- Conda (with environment `my_project`)
- Google Gemini API key (free tier)

## 1. Setup Environment

### Backend — Activate Conda
```bash
conda activate my_project
```

Install dependencies (first time only):
```bash
cd backend
pip install -r requirements.txt
```

### Frontend — Install Node packages (first time only)
```bash
cd frontend
npm install
```

## 2. Configure .env

Edit `backend/.env`:

```env
DATABASE_URL=sqlite:///./data/mytution.db
SECRET_KEY=change-this-to-a-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
GEMINI_API_KEY=your-actual-gemini-api-key
```

> **Get a Gemini API key**: https://aistudio.google.com/apikey
>
> Without a valid key, the AI Match and AI Summary features will fail, but everything else works.

## 3. Start Backend Server

```bash
cd backend
conda activate my_project
uvicorn app.main:app --reload --port 8000
```

Runs at: http://localhost:8000

Health check: http://localhost:8000/health

## 4. Start Frontend Dev Server

Open a **second terminal**:

```bash
cd frontend
npm run dev
```

Runs at: http://localhost:5173

The frontend proxies `/api` and `/uploads` to the backend automatically.

## 5. (Optional) Start MCP Server

Open a **third terminal**:

```bash
cd backend
conda activate my_project
python app/mcp/mcp_server.py --port 8001
```

## 6. First-Time Usage Flow

1. Open http://localhost:5173
2. **Register** as a **Parent** (email + password)
3. **Register** as a **Tutor** (different email + password)
4. **Logout** → **Login as Tutor** → Complete your tutor profile (name, subjects, etc.)
5. **Logout** → **Login as Admin** → Go to `/admin` and **Approve** the tutor
6. **Logout** → **Login as Parent** → Post a requirement → Click **AI Match**

## Project Structure

```
my-tuition/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── database.py          # SQLite connection
│   │   ├── models.py            # SQLAlchemy ORM models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # JWT + bcrypt
│   │   ├── dependencies.py      # Role guards
│   │   ├── routers/             # API routes
│   │   ├── ai/                  # Gemini integration
│   │   └── mcp/                 # MCP server
│   ├── data/                    # SQLite DB (auto-created)
│   ├── uploads/                 # Photo/certificate uploads
│   ├── .env                     # Secrets (DO NOT COMMIT)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/               # All page components
│   │   ├── components/          # Navbar, Footer
│   │   ├── context/             # AuthContext
│   │   └── api/                 # Axios instance
│   └── vite.config.js
└── RUN.md
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register (parent/tutor/admin) |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Current user info |
| PUT | `/api/tutors/profile` | Tutor | Create/update profile |
| GET | `/api/tutors/` | No | List tutors (filters: subject, class, area, board, mode) |
| POST | `/api/tutors/upload-photo` | Tutor | Upload profile photo |
| POST | `/api/tutors/upload-certificate` | Tutor | Upload certificate |
| POST | `/api/parents/requirements` | Parent | Post requirement |
| GET | `/api/parents/requirements/mine` | Parent | My requirements |
| POST | `/api/apply/{req_id}` | Tutor | Apply to requirement |
| GET | `/api/my-applications` | Tutor | My applications |
| PUT | `/api/applications/{id}/status` | Parent | Accept/reject application |
| POST | `/api/ai/match/{req_id}` | Parent | AI match (Gemini) |
| POST | `/api/ai/summarize-tutor/{id}` | Any | AI tutor summary |
| POST | `/api/reviews/` | Parent | Write review |
| GET | `/api/reviews/tutors/{id}` | No | Get tutor reviews |
| GET | `/api/admin/stats` | Admin | Platform stats |
| GET | `/api/admin/tutors/pending` | Admin | Pending approvals |
| PUT | `/api/admin/tutors/{id}/approve` | Admin | Approve tutor |

## Tech Stack

- **Backend**: Python 3.11, FastAPI, SQLAlchemy, SQLite, JWT, bcrypt
- **AI**: Google Gemini API (google.genai SDK)
- **Frontend**: React 18, Vite, Tailwind CSS, Axios
- **MCP**: Python MCP SDK (sidecar server)
