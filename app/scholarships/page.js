import SiteHeader from "../components/SiteHeader";
import PostBoard from "../components/PostBoard";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Scholarships — Michi Board",
};

export default function ScholarshipsPage() {
  return (
    <div className="page">
      <SiteHeader active="scholarship" />
      <PostBoard category="scholarship" />
      <SiteFooter />
    </div>
  );
}
