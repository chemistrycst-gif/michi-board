import SiteHeader from "../components/SiteHeader";
import PostBoard from "../components/PostBoard";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Updates — Michi Board",
};

export default function UpdatesPage() {
  return (
    <div className="page">
      <SiteHeader active="update" />
      <PostBoard category="update" />
      <SiteFooter />
    </div>
  );
}
