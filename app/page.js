import SiteHeader from "./components/SiteHeader";
import PostBoard from "./components/PostBoard";

export default function HomePage() {
  return (
    <div className="page">
      <SiteHeader active="all" />
      <PostBoard category="all" />
    </div>
  );
}
