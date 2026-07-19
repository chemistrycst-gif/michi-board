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

// Creates the posts table the first time it's needed. Safe to call repeatedly.
// IDs are generated in JavaScript (crypto.randomUUID) rather than relying on a
// Postgres extension, so this works on any managed Postgres host without
// needing special permissions.
export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        organization TEXT,
        description TEXT NOT NULL,
        link TEXT,
        location TEXT,
        deadline TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
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

export async function createPost(data) {
  await ensureSchema();
  const id = crypto.randomUUID();
  const { rows } = await pool.query(
    `INSERT INTO posts (id, category, title, organization, description, link, location, deadline)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *;`,
    [
      id,
      data.category,
      data.title,
      data.organization || null,
      data.description,
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
       link = $6,
       location = $7,
       deadline = $8,
       updated_at = now()
     WHERE id = $1
     RETURNING *;`,
    [
      id,
      data.category || null,
      data.title || null,
      data.organization || null,
      data.description || null,
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
