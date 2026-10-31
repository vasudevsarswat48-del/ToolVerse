import { useEffect } from "react";
export default function Privacy() {
  useEffect(() => { document.title = "Privacy Policy | TulEra"; }, []);
  return (
    <div className="container" style={{ padding: "40px 0", maxWidth: 720 }}>
      <h1>Privacy Policy</h1><p>Most tools run entirely in your browser. Files are not uploaded to our servers. We use Google Analytics and may show Google AdSense ads. Contact: vasudevsarswat48@gmail.com</p>
    </div>
  );
}
