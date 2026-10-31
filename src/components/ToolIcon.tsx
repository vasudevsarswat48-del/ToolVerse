export function ToolIcon({
  name,
  color = "#3b6cf6",
  size = 22,
}: {
  name: string;
  color?: string;
  size?: number;
}) {
  const letter = (name || "T").replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase() || "T";
  const box = size + 16;
  return (
    <span
      style={{
        width: box,
        height: box,
        borderRadius: 12,
        background: `${color}18`,
        color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: Math.max(12, size * 0.7),
        flexShrink: 0,
      }}
      aria-hidden
    >
      {letter}
    </span>
  );
}
