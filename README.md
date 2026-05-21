# MERN Notes App

A production-ready Notes application (MongoDB, Express, React, Node) with JWT auth, CRUD, tags, pin, color picker, search, and dark mode.

## Structure
```
mern-notes/
├── backend/   # Node + Express + Mongoose API
└── frontend/  # React (Vite) + Tailwind + Lucide
```

## Quick start

### 1. Backend
```bash
cd backend
cp .env.example .env   # then fill MONGO_URI + JWT_SECRET
npm install
npm run dev            # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev            # http://localhost:5173
```

### Run both at once (optional)
From the repo root:
```bash
npm install -g concurrently
concurrently "npm --prefix backend run dev" "npm --prefix frontend run dev"
```

## Features
- JWT authentication (bcrypt-hashed passwords, token in `localStorage` + `Authorization: Bearer` header)
- Notes CRUD scoped to the logged-in user
- Pin / unpin (pinned always first)
- Tags, background color picker, full-text search (title/content/tags)
- Modal editor, delete confirmation
- Light / dark mode toggle
- Tailwind UI inspired by Google Keep
"# Notes_App" 
