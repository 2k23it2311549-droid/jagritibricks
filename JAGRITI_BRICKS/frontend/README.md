# JagritiBricks Frontend

React + Vite frontend for JagritiBricks - PERN Stack.

## Features

- React 18 with Vite
- Tailwind CSS
- React Router
- Axios API Client
- JWT Authentication
- Responsive Design

## Installation

```bash
npm install
```

## Environment Variables

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Run

```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## Deployment (Vercel)

1. Push to GitHub
2. Connect Vercel to repo (frontend folder)
3. Add `VITE_API_URL` environment variable (Railway backend URL)
4. Deploy!

## Key Differences from Supabase Version

- **Authentication**: JWT tokens instead of Supabase Auth
- **Data Fetching**: Axios REST API instead of Supabase client
- **Context**: Updated AuthContext and SiteSettingsContext for API calls
- **No RLS**: Backend handles all authorization
