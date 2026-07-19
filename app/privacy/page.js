import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: "Privacy Policy — Michi Board",
};

export default function PrivacyPage() {
  return (
    <div className="page">
      <SiteHeader active="" />

      <div className="article-shell">
        <h1 className="article-title">Privacy Policy</h1>
        <p className="article-meta">Last updated: July 19, 2026</p>

        <div className="article-body">
          <p>
            This Privacy Policy explains what information Michi Board
            ("we," "us") collects when you visit this site, and how it's
            used. Michi Board is a listings site for scholarships, jobs,
            and news.
          </p>

          <h2 className="article-h2">Information we collect</h2>
          <p>
            Browsing the public site does not require an account, and we
            do not ask visitors for personal information to view or search
            postings.
          </p>
          <p>Like most websites, our hosting provider automatically logs
            standard technical information for every visit, such as IP
            address, browser type, device type, pages visited, and
            timestamps. This is used only for basic site operation,
            security, and troubleshooting.
          </p>
          <p>
            The site has a separate administrative area used only by the
            site operator to publish postings. It's protected by a
            password and is not accessible to the public.
          </p>

          <h2 className="article-h2">Cookies</h2>
          <p>
            The site sets one cookie when the administrator logs in, used
            only to keep that login session active. This cookie is not
            used to track visitors and is not set for anyone browsing the
            public site.
          </p>
          <p>
            If we add advertising (such as Google AdSense) or analytics
            tools in the future, those services may set their own cookies
            to measure traffic or show relevant ads. If that happens, this
            policy will be updated, and those providers' own privacy
            policies will apply to the data they collect.
          </p>

          <h2 className="article-h2">Third-party services</h2>
          <p>
            This site relies on a small number of third-party services to
            operate:
          </p>
          <ul className="article-list">
            <li>A hosting provider, which runs the website and may log
              technical visit data as described above</li>
            <li>A database provider, which stores the postings published
              on this site</li>
            <li>Google Fonts, used to display the site's typography,
              which may receive a request from your browser to load font
              files</li>
          </ul>
          <p>
            We do not sell or share visitor information with third
            parties for their own marketing purposes.
          </p>

          <h2 className="article-h2">Links to other websites</h2>
          <p>
            Postings on this site often link to external websites (such
            as an employer's application page or a news source). We
            aren't responsible for the privacy practices of those
            external sites, and we'd encourage you to review their own
            policies before submitting any information to them.
          </p>

          <h2 className="article-h2">Children's privacy</h2>
          <p>
            This site is not directed at children, and we do not
            knowingly collect personal information from children.
          </p>

          <h2 className="article-h2">Your rights</h2>
          <p>
            If you have questions about any information we may hold, or
            would like to request that it be corrected or deleted, contact
            us using the details below.
          </p>

          <h2 className="article-h2">Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time, for
            example if we add new features like advertising or analytics.
            The "Last updated" date at the top of this page will reflect
            the most recent change.
          </p>

          <h2 className="article-h2">Contact us</h2>
          <p>
            If you have any questions about this Privacy Policy, you can
            reach us at{" "}
            <a href="mailto:info@jskago.com" className="notice-link" style={{ display: "inline-block" }}>
              info@jskago.com
            </a>.
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
