"use client";

import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home", key: "all" },
  { href: "/scholarships", label: "Scholarships", key: "scholarship" },
  { href: "/jobs", label: "Jobs", key: "job" },
  { href: "/news", label: "News", key: "news" },
  { href: "/updates", label: "Updates", key: "update" },
];

export default function SiteHeader({ active = "all" }) {
  return (
    <header className="site-header">
      <div className="site-header-top">
        <Link href="/" className="site-title-link">
          <h1 className="site-title">Michi Board</h1>
        </Link>
        <a className="admin-link" href="/admin">
          Admin
        </a>
      </div>
      <p className="site-tagline">Scholarships · Jobs · News · Updates</p>

      <nav className="site-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="nav-link"
            data-active={active === item.key}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
