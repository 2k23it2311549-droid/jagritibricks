# JagritiBuild - Construction Materials E-Commerce Platform

A modern B2C/B2B marketplace for construction materials (Cement, Bricks, Sariya, Sand) built with React, Node.js, and Supabase.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth

## Project Structure

```
jagritibricks/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/    # Navbar, Footer, Hero, ProductCard, etc.
│   │   ├── pages/         # Home, Products, Cart, Admin pages
│   │   ├── context/       # CartContext
│   │   ├── hooks/         # useAuth
│   │   └── lib/           # Supabase client
│   └── package.json
├── server/          # Node.js backend (to be created)
└── PRD.md          # Product Requirements Document
```

## Setup Instructions

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will run at http://localhost:5173

## Features

### ✅ Completed
- Database schema (4 tables with RLS policies)
- Sample products (8 items across all categories)
- React app with routing
- Responsive Navbar with cart badge
- Hero section with dark gradient design
- Product listing with category filters and sorting
- Product cards with hover effects
- Shopping cart with localStorage persistence
- WhatsApp floating button
- Footer with contact info
- About and Contact pages
- Admin login page (UI only)

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

- Brand Red: `#E63946`
- Dark Background: `#1A1A1A` / `#2D2D2D`
- WhatsApp Green: `#25D366`
- Accent Orange: `#FF6B35`
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
