# CrewAI + FastAPI + Vue 3 Application

This project combines CrewAI for AI agent orchestration, FastAPI for the backend, and Vue 3 for the frontend.

## Project Structure
```
├── backend/              # FastAPI + CrewAI backend
│   ├── app/
│   │   ├── agents/       # CrewAI agent definitions
│   │   ├── core/         # Core functionality
│   │   ├── crews/        # CrewAI crew definitions
│   │   ├── models/       # Pydantic models
│   │   ├── routers/      # API endpoints
│   │   ├── services/     # Business logic
│   │   └── main.py       # Entry point
│   ├── venv/             # Python virtual environment
│   └── .env              # Environment variables
├── frontend/             # Vue 3 frontend
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── assets/       # Frontend assets
│   │   ├── components/   # Vue components
│   │   ├── router/       # Vue Router
│   │   ├── store/        # Pinia store
│   │   ├── views/        # Page components
│   │   ├── App.vue       # Root component
│   │   └── main.js       # Entry point
│   ├── index.html        # HTML entry
│   └── package.json      # NPM dependencies
└── README.md             # This file
```

## Setup Instructions

### Backend
1. Create and activate a Python virtual environment:
```bash
# Windows
cd backend
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn crewai langchain python-dotenv
```

2. Set up your OpenAI API key:
Edit the `.env` file in the backend directory and replace `your_openai_api_key_here` with your actual OpenAI API key.

3. Run the backend server:
```bash
cd backend
uvicorn app.main:app --reload
```

### Frontend
1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

## Production Build
```bash
# Build frontend
cd frontend
npm run build

# Run backend (will serve frontend)
cd backend
uvicorn app.main:app
```

Visit http://127.0.0.1:8000/ to use the application.

## Features
- AI agent system powered by CrewAI
- FastAPI backend with RESTful endpoints
- Modern Vue 3 frontend with composition API
- Responsive design using Tailwind CSS 