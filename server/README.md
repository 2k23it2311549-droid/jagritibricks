# JagritiBricks Backend API

REST API server for the JagritiBricks e-commerce platform.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Supabase** - PostgreSQL database and auth
- **CORS** - Cross-origin resource sharing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update Supabase credentials
   - Set admin credentials

3. Start development server:
```bash
npm run dev
```

4. Start production server:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Products

- `GET /api/products` - Get all products (with optional filters)
  - Query params: `category`, `search`, `sortBy`, `order`
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (filter by user_id)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Admin

- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard statistics (admin only)

## Authentication

Admin routes use Basic Authentication:
```
Authorization: Basic base64(username:password)
```

Default credentials:
- Username: `admin`
- Password: `admin@123`

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── supabase.js       # Supabase client
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js           # Admin authentication
│   └── server.js             # Main entry point
├── .env
├── .gitignore
└── package.json
```

## Error Handling

All endpoints return JSON responses:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Development

The server uses `nodemon` for hot reloading during development. Any changes to `.js` files will automatically restart the server.
