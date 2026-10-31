import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const THEMES = ["light", "ocean", "sunset", "forest", "lavender", "rose", "dark"];

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState("light");
  const [cookie, setCookie] = useState(false);

  useEffect(() => {
    try {
      setTheme(localStorage.getItem("theme") || "light");
      if (!localStorage.getItem("cookie-choice")) setCookie(true);
    } catch {}
  }, []);

  const changeTheme = (t: string) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem("theme", t);
    } catch {}
  };

  const year = new Date().getFullYear();

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo" aria-label="TulEra home">
            <img src="/favicon.svg" alt="" width={32} height={32} />
            <span>TulEra</span>
          </Link>
          <nav className="nav" aria-label="Main">
            <Link to="/" className={pathname === "/" ? "active" : ""}>
              Tools
            </Link>
            <Link to="/blog" className={pathname.startsWith("/blog") ? "active" : ""}>
              Blog
            </Link>
            <Link to="/about-us" className={pathname === "/about-us" ? "active" : ""}>
              About
            </Link>
            <Link to="/contact-us" className={pathname === "/contact-us" ? "active" : ""}>
              Contact
            </Link>
            <label className="theme-picker">
              <span className="theme-label">Theme</span>
              <select
                value={theme}
                onChange={(e) => changeTheme(e.target.value)}
                aria-label="Colour theme"
              >
                {THEMES.map((t) => (
                  <option key={t} value={t}>
                    {t[0].toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h3>TulEra</h3>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Free online tools for PDF, images, text and developers. Private by
                design — processing happens in your browser.
              </p>
            </div>
            <div>
              <h3>Popular</h3>
              <ul>
                <li>
                  <Link to="/tool/image-to-pdf">Image to PDF</Link>
                </li>
                <li>
                  <Link to="/tool/merge-pdf">Merge PDF</Link>
                </li>
                <li>
                  <Link to="/tool/json-formatter">JSON Formatter</Link>
                </li>
                <li>
                  <Link to="/tool/qr-code-generator">QR Code</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3>Company</h3>
              <ul>
                <li>
                  <Link to="/blog">Blog</Link>
                </li>
                <li>
                  <Link to="/about-us">About Us</Link>
                </li>
                <li>
                  <Link to="/contact-us">Contact</Link>
                </li>
                <li>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-of-service">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="copy">© {year} TulEra. All rights reserved.</div>
        </div>
      </footer>

      {cookie && (
        <div className="cookie-banner" role="dialog">
          <p style={{ margin: 0, flex: 1 }}>
            We use cookies for preferences and Google AdSense. See{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>
          <button
            type="button"
            className="btn"
            style={{ padding: "8px 14px" }}
            onClick={() => {
              try {
                localStorage.setItem("cookie-choice", "accept");
              } catch {}
              setCookie(false);
            }}
          >
            Accept
          </button>
          <button
            type="button"
            className="btn secondary"
            style={{ padding: "8px 14px" }}
            onClick={() => {
              try {
                localStorage.setItem("cookie-choice", "decline");
              } catch {}
              setCookie(false);
            }}
          >
            Decline
          </button>
        </div>
      )}
    </>
  );
}
