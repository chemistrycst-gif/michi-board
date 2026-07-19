"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const CATEGORY_LABELS = {
  all: "All",
  scholarship: "Scholarships",
  job: "Jobs",
  news: "News",
  update: "Updates",
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.organization || "").toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [posts, category, query]);

  return (
    <div className="page">
      <header className="site-header">
        <p className="site-tagline">Posted here, worth knowing</p>
        <h1 className="site-title">Michi Board</h1>
        <p className="site-tagline">Scholarships · Jobs · News · Updates</p>
      </header>

      <div className="controls">
        <div className="tabs">
          {Object.keys(CATEGORY_LABELS).map((key) => (
            <button
              key={key}
              className="tab"
              data-cat={key}
              data-active={category === key}
              onClick={() => setCategory(key)}
            >
              {CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>
        <input
          className="search"
          type="text"
          placeholder="Search postings…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="empty-state">Loading postings…</p>
      ) : filtered.length === 0 ? (
        <p className="empty-state">
          {posts.length === 0
            ? "Nothing posted yet. Check back soon."
            : "No postings match your search."}
        </p>
      ) : (
        <div className="board">
          {filtered.map((post) => (
            <article className="notice" key={post.id}>
              <span className="stamp" data-cat={post.category}>
                {post.category}
              </span>
              <h2 className="notice-title">{post.title}</h2>
              {post.organization && <p className="notice-org">{post.organization}</p>}
              <p className="notice-desc">{post.description}</p>
              <div className="notice-stub">
                <span>
                  {post.location ? post.location : formatDate(post.createdAt)}
                </span>
                <span className="deadline">
                  {post.deadline ? `Due ${formatDate(post.deadline)}` : ""}
                </span>
                {post.content ? (
                  <Link className="notice-link" href={`/posts/${post.id}`}>
                    Read full story →
                  </Link>
                ) : (
                  post.link && (
                    <a
                      className="notice-link"
                      href={post.link}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      View / Apply →
                    </a>
                  )
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
