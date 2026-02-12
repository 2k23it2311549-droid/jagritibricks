# JagritiBuild - Construction Materials E-Commerce Platform

A modern B2C/B2B marketplace for construction materials (Cement, Bricks, Sariya, Sand) built with React, Node.js, and Supabase.

## Tech Stack

- **Frontend (Customer)**: React + Vite + Tailwind CSS
- **Admin Panel**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth

## Project Structure

```
jagritibricks/
├── frontend/        # Customer-facing React app (renamed from client)
│   ├── src/pages/   # Home, Products, Cart, etc.
│   └── src/components/
├── admin/           # Admin Dashboard React app (Port 5174)
│   ├── src/pages/   # Dashboard, Product Management, Orders, etc.
│   └── src/components/
├── backend/         # Node.js backend API (renamed from server)
└── PRD.md           # Product Requirements Document
```

## Setup Instructions

### 1. Frontend (Customer App)

```bash
cd frontend
npm install
npm run dev
```
Runs on: http://localhost:5173

### 2. Admin Panel

```bash
cd admin
npm install
npm run dev
```
Runs on: http://localhost:5174

### 3. Backend API

```bash
cd backend
npm install
node index.js
```
Runs on: http://localhost:5000 (default)

## Features

### ✅ Completed
- **Architecture**: Separated Frontend, Admin, and Backend
- **Design**: Brand color updated to Orange (`#FF6B35`)
- **Customer App**:
  - Responsive Navbar & Hero
  - Product listing & details
  - Cart & Checkout flow
- **Admin App**:
  - Dashboard with charts
  - Product & Order management
  - Site settings

### 🚧 In Progress
- Checkout flow
- Product details page
- Admin dashboard (CRUD operations)
- Order management

### 📋 Todo
- Backend API endpoints
- User authentication
- Order placement
- Payment integration (Phase 2)

## Database Schema

**Supabase Tables:**
- `users` - User profiles with roles
- `products` - Product catalog
- `orders` - Order records
- `order_items` - Order line items

## Environment Variables

Create a `.env` file in the client directory (not needed currently as keys are hardcoded for development):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Color Palette

- Brand Orange: `#FF6B35` (Primary)
- Dark Background: `#1A1A1A` / `#2D2D2D`
- WhatsApp Green: `#25D366`
- Trust Blue: `#457B9D`

## Design Inspiration

- Dark hero sections with contrast
- Factory-direct messaging
- Trust badges and testimonials
- Step-by-step building guides
- Mobile-first responsive design

## Contact

- Phone: +91 9876543210
- Email: info@jagritibricks.com
- WhatsApp: Available on all pages

---

**Note**: This is currently in development. Some features are placeholders and will be implemented in upcoming phases.
