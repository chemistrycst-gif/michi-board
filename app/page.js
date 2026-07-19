import SiteHeader from "./components/SiteHeader";
import PostBoard from "./components/PostBoard";
import SiteFooter from "./components/SiteFooter";

export default function HomePage() {
  return (
    <div className="page">
      <SiteHeader active="all" />
      <PostBoard category="all" />
      <SiteFooter />
    </div>
  );
}
