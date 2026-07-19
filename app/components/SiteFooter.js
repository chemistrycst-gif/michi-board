import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Michi Board</span>
      <Link href="/privacy" className="footer-link">
        Privacy Policy
      </Link>
    </footer>
  );
}
