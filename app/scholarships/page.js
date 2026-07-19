import SiteHeader from "../components/SiteHeader";
import PostBoard from "../components/PostBoard";

export const metadata = {
  title: "Scholarships — Michi Board",
};

export default function ScholarshipsPage() {
  return (
    <div className="page">
      <SiteHeader active="scholarship" />
      <PostBoard category="scholarship" />
    </div>
  );
}
