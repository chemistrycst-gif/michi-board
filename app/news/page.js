import SiteHeader from "../components/SiteHeader";
import PostBoard from "../components/PostBoard";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "News — Michi Board",
};

export default function NewsPage() {
  return (
    <div className="page">
      <SiteHeader active="news" />
      <PostBoard category="news" />
      <SiteFooter />
    </div>
  );
}
