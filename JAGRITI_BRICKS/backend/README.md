# JagritiBricks Backend

Express.js REST API for JagritiBricks construction materials platform.

## Features

- JWT Authentication
- PostgreSQL Database
- RESTful API
- Admin Panel Support
- Orders Management
- CMS for Site Content

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/jagritibricks
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

## Database Setup

1. Create PostgreSQL database
2. Run schema:

```bash
psql -U your_user -d jagritibricks -f database/schema.sql
```

## Run

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create (Admin)
- `PUT /api/products/:id` - Update (Admin)
- `DELETE /api/products/:id` - Delete (Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order

### Admin
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id` - Update order
- `GET /api/admin/users` - All users
- `GET /api/admin/messages` - Contact messages
- `GET /api/admin/stats` - Dashboard stats

### Site
- `GET /api/site/content` - Site content
- `GET /api/site` - Site settings
- `PUT /api/site` - Update settings (Admin)

### Contact
- `POST /api/contact` - Submit message

## Deployment (Railway)

1. Push to GitHub
2. Connect Railway to repo
3. Add PostgreSQL database
4. Set environment variables
5. Deploy!
