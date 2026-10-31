import { useEffect } from "react";
export default function Contact() {
  useEffect(() => { document.title = "Contact | TulEra"; }, []);
  return (
    <div className="container" style={{ padding: "40px 0", maxWidth: 720 }}>
      <h1>Contact us</h1><p>Email: <a href="mailto:vasudevsarswat48@gmail.com">vasudevsarswat48@gmail.com</a></p><p>We usually reply within 2–3 business days.</p>
    </div>
  );
}
