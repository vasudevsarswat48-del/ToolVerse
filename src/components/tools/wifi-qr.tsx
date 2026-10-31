import { useEffect, useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

export default function WifiQr() {
  const [ssid, setSsid] = useState("");
  const [pass, setPass] = useState("");
  const [enc, setEnc] = useState("WPA");
  const [url, setUrl] = useState("");
  const s = {padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!ssid) { setUrl(""); return; }
      const payload = `WIFI:T:${enc};S:${ssid};P:${pass};;`;
      try {
        const QR = (await import("qrcode")).default;
        const data = await QR.toDataURL(payload, { width: 280, margin: 2 });
        if (!cancelled) setUrl(data);
      } catch { if (!cancelled) setUrl(""); }
    })();
    return () => { cancelled = true; };
  }, [ssid, pass, enc]);

  return (
    <div className="space-y-4">
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Network name (SSID)</span><input value={ssid} onChange={e=>setSsid(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Password</span><input type="password" value={pass} onChange={e=>setPass(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Encryption</span>
        <select value={enc} onChange={e=>setEnc(e.target.value)} style={s} className="mt-1">
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None</option>
        </select>
      </label>
      {url && (
        <>
          <div className="preview-box"><img src={url} alt="WiFi QR" style={{margin:"0 auto"}} /></div>
          <a href={url} download="wifi-qr.png"><ActionButton>Download QR</ActionButton></a>
        </>
      )}
    </div>
  );
}
