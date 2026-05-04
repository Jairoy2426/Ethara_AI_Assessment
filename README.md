# Team Task Manager

This repository contains a full-stack Team Task Manager app.

- **Backend**: Express + TypeScript + MongoDB (Mongoose) REST API
- **Frontend**: React + Vite + Tailwind CSS UI

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

## Deployment

This project is configured for deployment on **Vercel** using their experimental multi-service support.

- The **Frontend** is served at the root `/`.
- The **Backend** is served under the `/_/backend` prefix.

Make sure to set the `MONGODB_URI` and `JWT_SECRET` in your Vercel project environment variables.
