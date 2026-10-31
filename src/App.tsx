import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import ToolPage from "./pages/ToolPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tool/:slug" element={<ToolPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-of-service" element={<Terms />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}
