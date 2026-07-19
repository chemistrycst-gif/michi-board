"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EMPTY_FORM = {
  category: "scholarship",
  title: "",
  organization: "",
  description: "",
  link: "",
  location: "",
  deadline: "",
};

export default function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function loadPosts() {
    setLoading(true);
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function startEdit(post) {
    setEditingId(post.id);
    setForm({
      category: post.category,
      title: post.title,
      organization: post.organization || "",
      description: post.description,
      link: post.link || "",
      location: post.location || "",
      deadline: post.deadline ? post.deadline.slice(0, 10) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const url = editingId ? `/api/posts/${editingId}` : "/api/posts";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not save this posting.");
        return;
      }
      cancelEdit();
      loadPosts();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this posting? This can't be undone.")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (editingId === id) cancelEdit();
    loadPosts();
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="page">
      <div className="dashboard-header">
        <h1>Manage postings</h1>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <a className="admin-link" href="/" target="_blank" rel="noreferrer">
            View site
          </a>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "1.1rem" }}>
          {editingId ? "Edit posting" : "Add a new posting"}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            >
              <option value="scholarship">Scholarship</option>
              <option value="job">Job</option>
              <option value="news">News</option>
              <option value="update">Update</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Merit Scholarship for First-Year Students"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="organization">Organization (optional)</label>
            <input
              id="organization"
              value={form.organization}
              onChange={(e) => updateField("organization", e.target.value)}
              placeholder="e.g. Ministry of Education"
            />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Who it's for, eligibility, and any details worth knowing."
              required
            />
          </div>
          <div className="field">
            <label htmlFor="link">Link to apply / learn more (optional)</label>
            <input
              id="link"
              value={form.link}
              onChange={(e) => updateField("link", e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="field">
            <label htmlFor="location">Location (optional)</label>
            <input
              id="location"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="e.g. Remote, or a city"
            />
          </div>
          <div className="field">
            <label htmlFor="deadline">Deadline (optional)</label>
            <input
              id="deadline"
              type="date"
              value={form.deadline}
              onChange={(e) => updateField("deadline", e.target.value)}
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Save changes" : "Post it"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>
        Current postings ({posts.length})
      </h1>
      {loading ? (
        <p className="empty-state">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="empty-state">Nothing posted yet — add your first one above.</p>
      ) : (
        <div>
          {posts.map((post) => (
            <div className="post-row" key={post.id}>
              <div>
                <span className="badge" data-cat={post.category}>
                  {post.category}
                </span>
                <div style={{ fontWeight: 600 }}>{post.title}</div>
                {post.organization && (
                  <div style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                    {post.organization}
                  </div>
                )}
              </div>
              <div className="post-row-actions">
                <button className="btn btn-secondary" onClick={() => startEdit(post)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(post.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
