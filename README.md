# JagritiBricks Project

## Project Structure
- **`client/`**: Main customer-facing website (React + Vite).
- **`admin/`**: Admin dashboard for order & customer management (React + Vite).
- **`server/`**: Database scripts and backend resources.
  - **`database/`**: SQL scripts for Supabase setup, seeding, and migrations.

## Getting Started

### Prerequisites
- Node.js (v16+)
- Supabase Account

### Setup
1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    cd client
    npm install
    cd ../admin
    npm install
    ```
3.  **Environment Variables**:
    - Copy `.env.example` to `.env` in both `client` and `admin` folders.
    - Fill in your Supabase URL and Anon Key.

### Running Locally
- **Client**: `cd client && npm run dev`
- **Admin**: `cd admin && npm run dev`

## Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Vercel.
