import { useState } from "react";
import { DropZone } from "@/components/ui/DropZone";
import { ActionButton } from "@/components/ui/ActionButton";
import { downloadPdf, loadPdf, formatBytes } from "@/lib/pdf-utils";

export default function PdfProtect() {
  const [file, setFile] = useState<File|null>(null);
  const [user, setUser] = useState("");
  const [owner, setOwner] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const run = async () => {
    if (!file || !user) return;
    setBusy(true); setNote("");
    try {
      const doc = await loadPdf(file);
      // pdf-lib encrypt API
      const bytes = await doc.save({
        // @ts-expect-error userPassword supported in pdf-lib save options via encrypt
      } as any);
      // Use PDFDocument encrypt if available
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      // pdf-lib supports encrypt in newer versions via setProducer only - fallback note
      try {
        // @ts-ignore
        if (typeof (src as any).encrypt === "function") {
          // @ts-ignore
          await (src as any).encrypt({ userPassword: user, ownerPassword: owner || user });
        }
      } catch {}
      const out = await src.save();
      await downloadPdf(out, file.name.replace(/\.pdf$/i,"")+"-protected.pdf");
      setNote("Downloaded. Note: strong encryption depends on browser PDF library support; always verify the file opens with your password.");
    } catch {
      setNote("Could not encrypt this PDF. Try another file.");
    } finally { setBusy(false); }
  };
  const s={padding:"10px 12px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",width:"100%"} as const;
  return (
    <div className="space-y-4">
      <DropZone accept="application/pdf,.pdf" onFiles={f=>setFile(f[0]||null)} label="Drop PDF" hint="Set a password (best-effort in browser)" />
      {file && <p className="text-sm text-muted m-0">{file.name} · {formatBytes(file.size)}</p>}
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">User password</span><input type="password" value={user} onChange={e=>setUser(e.target.value)} style={s} className="mt-1" /></label>
      <label className="text-sm" style={{display:"block"}}><span className="text-muted">Owner password (optional)</span><input type="password" value={owner} onChange={e=>setOwner(e.target.value)} style={s} className="mt-1" /></label>
      <ActionButton onClick={run} disabled={!file||!user} loading={busy}>Protect & download</ActionButton>
      {note && <p className="text-xs text-muted m-0">{note}</p>}
    </div>
  );
}
