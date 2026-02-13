# Deployment Guide for JagritiBricks

This guide covers the deployment of the JagritiBricks application, which consists of three parts:
1. **Frontend (Client App)** - Deployed on **Vercel**
2. **Admin Panel** - Deployed on **Vercel**
3. **Backend API** - Deployed on **Railway** with PostgreSQL

---

## 1. Backend Deployment (Railway)

### Prerequisites
- A [Railway](https://railway.app/) account.
- GitHub repository connected to Railway.

### Steps
1.  **Create a New Project** on Railway.
2.  **Add a Database (PostgreSQL)**.
    - Note the `DATABASE_URL` from the "Connect" tab or variables.
3.  **Deploy the Repo**:
    - Click "New" -> "GitHub Repo" -> Select `JagritiBricks`.
    - **Crucial**: Go to "Settings" -> "Root Directory" and set it to `/backend`.
    - Railway will detect `package.json` and install dependencies automatically.
    - Verify the **Start Command** is `npm start` (or `node src/server.js`).

### Environment Variables
Go to the "Variables" tab in your backend service and add:

```env
PORT=8080 (or let Railway assign it)
DATABASE_URL=${{PostgreSQL.DATABASE_URL}} (Autofilled if linked)
JWT_SECRET=your_production_secret_key_here
CORS_ORIGIN=https://your-frontend.vercel.app,https://your-admin.vercel.app
NODE_ENV=production
```

### Database Migration
Since we migrated from Supabase, you need to set up the schema in the new Railway Postgres database.

1.  **Get the Connection String**: From Railway Dashboard -> PostgreSQL -> Connect.
2.  **Run Schema Script**:
    - You can use a tool like **pgAdmin** or **DBeaver** to connect to the Railway DB.
    - Execute the contents of `backend/database/schema.sql`.
3.  **Seed Initial Data**:
    - Build a connection URL locally (e.g., in `.env` inside `backend`).
    - Run `node backend/database/seed.js` locally to populate products.
    - **Create Admin User**: Run `node backend/create_admin.js` locally to create the initial admin account.

---

## 2. Frontend Deployment (Vercel)

### Steps
1.  **Create a New Project** on [Vercel](https://vercel.com/).
2.  **Import Git Repository**: Select `JagritiBricks`.
3.  **Configure Project**:
    - **Root Directory**: Select `frontend`.
    - **Framework Preset**: Vite (should be auto-detected).
    - **Build Command**: `vite build` (or `npm run build`).
    - **Output Directory**: `dist`.
4.  **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed Railway Backend (e.g., `https://jagritibricks-production.up.railway.app/api`).
5.  **Deploy**.

---

## 3. Admin Panel Deployment (Vercel)

### Steps
1.  **Create ANOTHER New Project** on Vercel.
2.  **Import Git Repository**: Select `JagritiBricks` again.
3.  **Configure Project**:
    - **Project Name**: `jagritibricks-admin`.
    - **Root Directory**: Select `admin`.
    - **Framework Preset**: Vite.
    - **Build Command**: `vite build`.
    - **Output Directory**: `dist`.
4.  **Environment Variables**:
    - `VITE_API_URL`: The URL of your deployed Railway Backend.
5.  **Deploy**.

---

## Post-Deployment Checks

1.  **CORS**: Ensure the `CORS_ORIGIN` in Railway backend includes BOTH the frontend and admin Vercel URLs (comma-separated if supported, or check backend implementation).
    - *Note*: The current backend implementation might need adjustment to support multiple origins or a strict single origin. If issues arise, allow all (`*`) temporarily or implement array check in `cors` middleware.
2.  **Images**: Since local file upload is disabled/ephemeral on Railway, ensure product images are hosted externally (or use a cloud storage bucket like AWS S3 or Supabase Storage bucket purely for files).
    - Currently, the Admin panel expects direct URL input for images.
