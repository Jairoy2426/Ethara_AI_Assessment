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

## VPS Deployment

This project is optimized for deployment on a Linux VPS (Ubuntu/Debian) using **Nginx** and **PM2**.

### 1. Backend (API)
- Build the project: `cd backend && npm run build`
- Start with PM2: `pm2 start vps-setup/ecosystem.config.js`
- The API runs on port `4000`.

### 2. Frontend (Static)
- Build the project: `cd frontend && npm run build`
- Serve the `frontend/dist` folder using Nginx.

### 3. Nginx Reverse Proxy
A sample Nginx configuration is provided in `vps-setup/nginx.conf`. It handles:
- Serving the frontend at `https://ethara.herculesdev.in/`
- Proxying `/api` requests to the backend service.

Make sure to update your `frontend/.env` with `VITE_API_URL=https://ethara.herculesdev.in/api` before building.
