import { useEffect } from "react";
export default function Terms() {
  useEffect(() => { document.title = "Terms of Service | TulEra"; }, []);
  return (
    <div className="container" style={{ padding: "40px 0", maxWidth: 720 }}>
      <h1>Terms of Service</h1><p>Tools are provided as-is, free of charge. Do not use them for illegal purposes. We are not liable for data loss — keep backups of important files.</p>
    </div>
  );
}
