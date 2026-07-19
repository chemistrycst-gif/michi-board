import SiteHeader from "../components/SiteHeader";
import PostBoard from "../components/PostBoard";

export const metadata = {
  title: "Jobs — Michi Board",
};

export default function JobsPage() {
  return (
    <div className="page">
      <SiteHeader active="job" />
      <PostBoard category="job" />
    </div>
  );
}
