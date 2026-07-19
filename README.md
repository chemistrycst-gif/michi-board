# The Opportunity Board

A website for posting scholarships, jobs, and updates. Visitors can browse and
filter postings; you (the admin) log in at `/admin` to add, edit, or delete
them.

- Public site: browse, filter by category, search
- `/admin`: password-protected dashboard to manage postings
- Data is stored in a real Postgres database, so nothing is lost when the site restarts

---

## 1. Run it on your computer first

You'll need [Node.js](https://nodejs.org) 18 or newer installed.

**Get a free database.** This app needs a Postgres database — even while
testing locally, it's easiest to just use a free hosted one so you don't have
to install Postgres yourself:

1. Go to [neon.tech](https://neon.tech) and sign up (free).
2. Create a new project. Copy the **connection string** it gives you — it
   looks like `postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require`.

**Set up the project:**

```bash
npm install
cp .env.example .env
```

Open `.env` and paste in:
- `DATABASE_URL` — the connection string from Neon
- `ADMIN_PASSWORD` — pick a password only you know
- `SESSION_SECRET` — any long random string (mash your keyboard)

**Run it:**

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site, and
`http://localhost:3000/admin` to log in and add your first postings. The
database table is created automatically the first time the app runs — you
don't need to set up any tables by hand.

---

## 2. Put it live on the internet (before you own a domain)

You already have a Postgres database from Neon above, so this part is just
about hosting the website itself. **Render** is a good free option because it
runs your app as a normal always-on server (no special adjustments needed).

**Step 1 — Put the code on GitHub**
1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Create a new repository (e.g. `opportunity-board`).
3. Upload this project's files to it (via GitHub's web uploader, or `git push`
   if you're comfortable with git).

**Step 2 — Deploy on Render**
1. Go to [render.com](https://render.com) and sign up (free), then connect your GitHub account.
2. Click **New +** → **Web Service**, and pick your repository.
3. Fill in:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Under **Environment Variables**, add the same three values from your `.env` file:
   - `DATABASE_URL` (your Neon connection string)
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
5. Click **Create Web Service**. Render will build and deploy it — after a
   few minutes you'll get a live URL like `https://opportunity-board.onrender.com`.

That's it — your site is live at that address. When you buy a domain later,
Render (and Neon) both let you attach a custom domain to what you already have,
so nothing needs to be rebuilt.

**Note on the free tier:** Render's free web services go to sleep after
periods of inactivity and take ~30–50 seconds to wake up on the next visit.
That's normal and fine for a project getting started. If that ever bothers
you, Render's cheapest paid tier keeps it always awake.

---

## Day-to-day use

- Go to `yoursite.com/admin`, log in with your `ADMIN_PASSWORD`.
- Add a posting: pick a category (Scholarship / Job / Update), fill in the
  details, and click **Post it**. It appears on the public site immediately.
- Edit or delete existing postings from the same dashboard.

## Project structure (for reference)

```
app/
  page.js                    Public homepage (browse, filter, search)
  admin/page.js               Admin login
  admin/dashboard/page.js     Admin dashboard (add/edit/delete)
  api/posts/                  API for listing/creating/updating/deleting posts
  api/auth/                   Login/logout
  globals.css                 All styling
lib/
  db.js                       Database queries (Postgres)
  auth.js                     Login session handling
middleware.js                  Protects the admin dashboard and write actions
```
