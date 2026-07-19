# Michi Board

A website for posting scholarships, jobs, and news. Visitors browse and
filter postings; you (the admin) log in at `/admin` to add, edit, or delete
them.

- **Public site**: browse, filter by category (Scholarships / Jobs / News /
  Updates), search
- **`/admin`**: password-protected dashboard to manage postings
- **Full stories**: any posting can have a complete article, not just a short
  summary — visitors read it on your own site instead of clicking away
- Simple formatting supported in full stories: `## Heading`, `- bullet
  point`, `**bold text**`
- Data is stored in a real Postgres database, so nothing is lost when the
  site restarts

---

## 1. Run it on your computer first

You'll need [Node.js](https://nodejs.org) 18 or newer installed.

**Get a free database.** This app needs a Postgres database:

1. Go to [neon.tech](https://neon.tech) and sign up (free).
2. Create a new project. Copy the **connection string** — it looks like
   `postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require`.

**Set up the project:**

```bash
npm install
copy .env.example .env
```

Open `.env` and fill in:
- `DATABASE_URL` — the connection string from Neon
- `ADMIN_PASSWORD` — pick a password only you know
- `SESSION_SECRET` — any long random string

**Run it:**

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site, and
`http://localhost:3000/admin` to log in and manage postings. The database
table (and any new columns this project adds over time) is created/updated
automatically the first time the app runs.

---

## 2. Put it live on the internet

**Step 1 — Code on GitHub.** Push this project to a GitHub repository
(via GitHub Desktop is easiest) — everything except `node_modules` and
`.env`.

**Step 2 — Deploy on Render.**
1. [render.com](https://render.com) → sign up → **New +** → **Web Service**
   → pick your repo
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start`
4. Instance Type: **Free**
5. Add the same three Environment Variables as your `.env`
   (`DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`)
6. Create the service — you'll get a live URL like
   `https://michi-board.onrender.com`

**Step 3 — Custom domain (optional).** In Render → Settings → Custom
Domains, add your subdomain (e.g. `michiboard.jskago.com`), then add the
CNAME record it gives you wherever your domain's DNS is managed (Squarespace,
GoDaddy, etc.).

**Note on the free tier:** Render's free web services sleep after
inactivity and take ~30-50 seconds to wake up on the next visit — normal for
a project at this stage.

---

## Day-to-day use

- Go to `yoursite.com/admin`, log in with your `ADMIN_PASSWORD`
- **Add a posting**: pick a category, fill in a title and short summary
  (required). Optionally write a full story — leave it blank for a
  short posting, or write the complete article/details there
- **Format a full story** using:
  ```
  ## A Heading
  - A bullet point
  - Another bullet point

  **Bold text** inside a normal paragraph.
  ```
- Edit or delete existing postings from the same dashboard

## After making code changes

Whenever you (or I) update any project file:
1. Save the file
2. Stop the local server (Ctrl+C, then Y) and run `npm run dev` again to
   pick up the change
3. Commit and push via GitHub Desktop
4. Render redeploys automatically (or trigger it manually: **Manual Deploy**
   → **Deploy latest commit**)

## Project structure

```
app/
  page.js                    Public homepage (browse, filter, search)
  posts/[id]/page.js          Full-story article page
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
