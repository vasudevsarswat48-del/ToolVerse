import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Jump to top on every route change (fixes home scroll carrying into tool pages). */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // instant jump — no smooth scroll so user lands at tool header
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);
  return null;
}
