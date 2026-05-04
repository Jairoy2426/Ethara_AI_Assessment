# Team Task Manager

This repository contains a full-stack Team Task Manager app.

- **Backend**: Express + TypeScript + MongoDB (Mongoose) REST API
- **Frontend**: React + Vite + Tailwind CSS UI.

## Backend Setup

1. Navigate to the backend directory: `cd backend`
2. Copy `backend/.env.example` to `backend/.env` and set your `MONGODB_URI` and other environment variables.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

Note: Project creation and member management are admin-only. Ensure a user has the role `admin` in the database to perform these actions.

## Frontend Setup

1. Navigate to the frontend directory: `cd frontend`
2. Copy `frontend/.env.example` to `frontend/.env` and set the `VITE_API_URL`.
3. Install dependencies: `npm install`
4. Start the app: `npm run dev`

## API Overview

- **Auth**: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`
- **Projects**: `GET/POST/PATCH/DELETE /api/projects`, members at `/api/projects/:projectId/members`
- **Tasks**: `GET/POST /api/tasks/:projectId`, `PATCH /api/tasks/:projectId/:taskId`, `PATCH /api/tasks/:projectId/:taskId/status`
- **Dashboard**: `GET /api/dashboard`

## Deployment (Vercel)

For this full-stack app, it is recommended to deploy the **Backend** and **Frontend** as two separate projects on Vercel.

### 1. Backend Deployment
1. Create a new project on Vercel and select this repository.
2. Set the **Root Directory** to `backend`.
3. Add your Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
4. Deploy. Vercel will use the `backend/vercel.json` configuration.

### 2. Frontend Deployment
1. Create another new project on Vercel and select this repository.
2. Set the **Root Directory** to `frontend`.
3. Add your Environment Variable:
   - `VITE_API_URL`: Set this to your **Backend's** Vercel URL (e.g., `https://your-backend.vercel.app/api`).
4. Deploy. Vercel will automatically detect the Vite setup.
