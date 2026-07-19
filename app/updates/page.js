import SiteHeader from "../components/SiteHeader";
import PostBoard from "../components/PostBoard";

export const metadata = {
  title: "Updates — Michi Board",
};

export default function UpdatesPage() {
  return (
    <div className="page">
      <SiteHeader active="update" />
      <PostBoard category="update" />
    </div>
  );
}
