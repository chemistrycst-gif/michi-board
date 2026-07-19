import { Pool } from "pg";

const globalForDb = globalThis;

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add a Postgres connection string to your .env file (see README)."
    );
  }
  return new Pool({
    connectionString,
    // Most free Postgres hosts (Neon, Supabase, Render) require SSL.
    ssl: connectionString.includes("sslmode=disable") ? false : { rejectUnauthorized: false },
  });
}

export const pool = globalForDb.pgPool || createPool();
globalForDb.pgPool = pool;

let schemaReady = globalForDb.schemaReady || null;

// Creates the posts table the first time it's needed, and adds the `content`
// column if it's missing (safe to run on a database that already has posts
// from before this feature existed). Safe to call repeatedly.
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        organization TEXT,
        description TEXT NOT NULL,
        content TEXT,
        link TEXT,
        location TEXT,
        deadline TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS content TEXT;
    `);
    globalForDb.schemaReady = schemaReady;
  }
  return schemaReady;
}

function rowToPost(row) {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    organization: row.organization,
    description: row.description,
    content: row.content,
    link: row.link,
    location: row.location,
    deadline: row.deadline,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPosts() {
  await ensureSchema();
  const { rows } = await pool.query(
    `SELECT * FROM posts ORDER BY created_at DESC;`
  );
  return rows.map(rowToPost);
}

export async function getPost(id) {
  await ensureSchema();
  const { rows } = await pool.query(`SELECT * FROM posts WHERE id = $1;`, [id]);
  return rows[0] ? rowToPost(rows[0]) : null;
}

export async function createPost(data) {
  await ensureSchema();
  const id = crypto.randomUUID();
  const { rows } = await pool.query(
    `INSERT INTO posts (id, category, title, organization, description, content, link, location, deadline)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *;`,
    [
      id,
      data.category,
      data.title,
      data.organization || null,
      data.description,
      data.content || null,
      data.link || null,
      data.location || null,
      data.deadline || null,
    ]
  );
  return rowToPost(rows[0]);
}

export async function updatePost(id, data) {
  await ensureSchema();
  const { rows } = await pool.query(
    `UPDATE posts SET
       category = COALESCE($2, category),
       title = COALESCE($3, title),
       organization = $4,
       description = COALESCE($5, description),
       content = $6,
       link = $7,
       location = $8,
       deadline = $9,
       updated_at = now()
     WHERE id = $1
     RETURNING *;`,
    [
      id,
      data.category || null,
      data.title || null,
      data.organization || null,
      data.description || null,
      data.content || null,
      data.link || null,
      data.location || null,
      data.deadline || null,
    ]
  );
  return rows[0] ? rowToPost(rows[0]) : null;
}

export async function deletePost(id) {
  await ensureSchema();
  const { rowCount } = await pool.query(`DELETE FROM posts WHERE id = $1;`, [id]);
  return rowCount > 0;
}
