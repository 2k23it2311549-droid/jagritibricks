# Server & Database

Since this project uses **Supabase** as a Backend-as-a-Service (BaaS), there is **no Node.js/Express server** to deploy.

## Purpose of this Folder
This `server/` directory (specifically `server/database/`) is used to store:
1.  **SQL Scripts**: Definitions of your database tables, policies, and functions.
2.  **Backups**: A history of changes made to your database schema.
3.  **Seeds**: Initial data to populate the database (e.g., `seed_full_database.sql`).

## "Deploying" the Server
You do **not** upload this folder to Vercel or Render.
Instead, you "deploy" changes by:
1.  Copying the SQL code from a file (e.g., `simple_auth.sql`).
2.  Going to your [Supabase Dashboard](https://supabase.com/dashboard).
3.  Opening the **SQL Editor**.
4.  Pasting the code and running it.

## Why keep it here?
We keep these files in the project so they are **version controlled** (saved in GitHub). This ensures you always have a copy of your database structure if you ever need to recreate it.
