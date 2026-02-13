# JagritiBricks Admin Panel

Admin panel for managing JagritiBricks - PERN Stack.

## Features

- Admin Dashboard with Statistics
- Product Management (CRUD)
- Order Management
- User Management
- CMS Content Editor
- Site Settings Configuration
- Contact Messages Inbox

## Installation

```bash
npm install
```

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## Run

```bash
# Development
npm run dev

# Build
npm run build
```

## Deployment (Vercel)

1. Push to GitHub
2. Connect Vercel to repo (admin folder)
3. Add `VITE_API_URL` environment variable
4. Deploy!

## Access

- Admin users only (role: 'admin')
- Login with admin credentials
