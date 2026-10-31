/** Placeholder for Google AdSense units — replace with real ad code after approval */
export function AdSlot({ label = "Advertisement" }: { label?: string }) {
  return (
    <div
      className="ad-slot"
      data-ad="placeholder"
      style={{
        margin: "24px 0",
        padding: "16px",
        borderRadius: 12,
        border: "1px dashed var(--border)",
        background: "var(--surface-2)",
        textAlign: "center",
        color: "var(--muted)",
        fontSize: 12,
        minHeight: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 
        After AdSense approval, replace this div with:
        <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-7403439305637659" data-ad-slot="XXXXXXXX" data-ad-format="auto" />
      */}
      {label}
    </div>
  );
}
