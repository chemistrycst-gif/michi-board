"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${keyPrefix}-b-${i}`}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-t-${i}`}>{part}</span>
    )
  );
}

// Turns simple text formatting into real elements:
//   ## Heading        -> subheading
//   - item            -> bullet list item
//   **bold text**      -> bold text
//   (blank line)        -> new paragraph
function renderContent(content) {
  const lines = content.split("\n");
  const blocks = [];
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ type: "ul", items: list });
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line === "") {
      flushParagraph();
      flushList();
    } else if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else if (line.startsWith("- ")) {
      flushParagraph();
      if (!list) list = [];
      list.push(line.slice(2).trim());
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();

  return blocks.map((block, i) => {
    if (block.type === "h2") {
      return (
        <h2 className="article-h2" key={i}>
          {renderInline(block.text, `h-${i}`)}
        </h2>
      );
    }
    if (block.type === "ul") {
      return (
        <ul className="article-list" key={i}>
          {block.items.map((item, j) => (
            <li key={j}>{renderInline(item, `li-${i}-${j}`)}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i}>{renderInline(block.text, `p-${i}`)}</p>
    );
  });
}

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => data && setPost(data))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="page">
      <div className="article-shell">
        <Link href="/" className="admin-link" style={{ display: "inline-block", marginBottom: "1.75rem" }}>
          ← Back to Michi Board
        </Link>

        {loading && <p className="empty-state">Loading…</p>}

        {!loading && notFound && (
          <p className="empty-state">This posting doesn't exist or was removed.</p>
        )}

        {!loading && post && (
          <article>
            <span className="stamp" data-cat={post.category}>
              {post.category}
            </span>
            <h1 className="article-title">{post.title}</h1>
            <p className="article-meta">
              {post.organization}
              {post.organization && post.location ? " · " : ""}
              {post.location}
              {(post.organization || post.location) ? " · " : ""}
              Posted {formatDate(post.createdAt)}
              {post.deadline ? ` · Due ${formatDate(post.deadline)}` : ""}
            </p>

            <div className="article-body">
              {post.content ? renderContent(post.content) : <p>{post.description}</p>}
            </div>

            {post.link && (
              
                className="notice-link"
                href={post.link}
                target="_blank"
                rel="noreferrer noopener"
                style={{ display: "inline-block", marginTop: "1.5rem" }}
              >
                View source / apply →
              </a>
            )}
          </article>
        )}
      </div>
    </div>
  );
}