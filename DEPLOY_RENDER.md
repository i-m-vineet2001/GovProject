Render deployment guide — GovProject backend

This file describes one-click-ish steps and commands to deploy the `backend/`
service to Render and wire it to a managed Postgres database. The repo already
contains a `render.yaml` manifest to help import the service.

Quick summary

- Use Render's Managed Postgres for production.
- The repo's `render.yaml` defines a web service at path `backend` and a
  placeholder managed database.
- The backend expects `DATABASE_URL` env var (Postgres). `server.js` reads
  `process.env.PORT` so Render will route correctly.

Steps

1. Create a managed Postgres instance on Render

   - Open: https://dashboard.render.com/new/database?onboarding=active
   - Choose plan and region. After creation, copy the connection string (it
     looks like: `postgresql://user:pass@host:5432/dbname`).

2. Import the repo / create the Web Service

   - In Render: New → Web Service → Connect a repository → select
     `i-m-vineet2001/GovProject`.
   - Render should detect `render.yaml`. Confirm service name `govproject-backend`
     and path `backend`.
   - Build Command: leave as (or set) `npm install` (manifest already sets it).
   - Start Command: `npm start` (manifest sets it to run migrations then start).

3. Configure environment variables

   - In the Render service settings (Environment → Environment Variables), add:
     - DATABASE_URL = your Postgres connection string
     - NODE_ENV = production

4. Deploy

   - Trigger a deploy. Render will run `npm install` and the `postinstall`
     script to generate the Prisma client, then `npm start` which runs
     `npx prisma migrate deploy` and starts `node server.js`.

5. Seed the CSV (one-off)

   - Recommended: run a one-off shell on Render (service → Consoles → Shell) and run:

     cd backend
     npm run seed:csv

   - This will import `backend/govproject dataset.csv` into the Postgres DB.
   - Alternatively, you can POST to `/api/seed-csv` (less secure in prod).

6. Update frontend (Netlify)
   - Configure the frontend to use the deployed backend URL (for example:
     `https://<your-service>.onrender.com/api`). Update the Netlify environment
     variable or rebuild the site with that API base.

Local verification commands (optional)

From repo root:

cd backend
npm install
npx prisma generate
npx prisma migrate deploy # apply migrations to target DB
npm run seed:csv # import CSV to DB
node server.js # start server locally

Notes & caveats

- Migrations in `prisma/migrations/` were created earlier (initial migration).
  They should apply to Postgres, but test on a staging DB first.
- The `seed:csv` script uses simple CSV parsing. It worked with the provided
  dataset; if you see parsing issues (commas or quotes inside fields), I can
  replace it with a robust CSV parser.
- Do not run `seed:csv` automatically on every deploy in production.

If you want, I can add a small Render manifest tweak to automatically map the
managed database to `DATABASE_URL`, but Render's UI typically handles that.

If you'd like me to prepare a copy-paste checklist for Render's UI fields,
say "prepare UI checklist" and I'll add it to this file.
