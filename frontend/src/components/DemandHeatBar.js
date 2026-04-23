// components/DemandHeatBar.js
// NEW FILE — import anywhere: <DemandHeatBar votes={12} maxVotes={30} />

export default function DemandHeatBar({ votes = 1, maxVotes = 30, showLabel = true }) {
  const pct = Math.min((votes / maxVotes) * 100, 100);
  const level = pct >= 75 ? "high" : pct >= 40 ? "medium" : "low";

  const colors = {
    high: { bar: "#ef4444", glow: "rgba(239,68,68,0.4)", label: "🔥 High Demand" },
    medium: { bar: "#f59e0b", glow: "rgba(245,158,11,0.35)", label: "⚡ Growing" },
    low: { bar: "#3b82f6", glow: "rgba(59,130,246,0.3)", label: "📌 Pinned" },
  };

  const c = colors[level];

  return (
    <div style={{ width: "100%" }}>
      {showLabel && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "4px",
          fontSize: "11px",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          <span style={{ color: c.bar, fontWeight: 600 }}>{c.label}</span>
          <span style={{ color: "#6b7280" }}>{votes} votes</span>
        </div>
      )}
      <div style={{
        height: "6px",
        borderRadius: "100px",
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: c.bar,
          borderRadius: "100px",
          boxShadow: `0 0 8px ${c.glow}`,
          transition: "width 0.6s ease",
        }} />
      </div>
    </div>
  );
}
