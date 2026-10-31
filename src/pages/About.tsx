import { useEffect } from "react";
export default function About() {
  useEffect(() => { document.title = "About Us | TulEra"; }, []);
  return (
    <div className="container" style={{ padding: "40px 0", maxWidth: 720 }}>
      <h1>About TulEra</h1><p>TulEra is a collection of free, privacy-first online tools. Processing happens in your browser whenever possible — your files stay on your device.</p><p>Supported by advertising (Google AdSense). No watermarks, no mandatory accounts.</p>
    </div>
  );
}
