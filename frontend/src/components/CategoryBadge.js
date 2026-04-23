// components/CategoryBadge.js
// NEW FILE — import anywhere: <CategoryBadge category="Tea Stall" />

const CATEGORY_MAP = {
  "tea": { emoji: "☕", color: "#d97706", bg: "rgba(217,119,6,0.15)" },
  "coffee": { emoji: "☕", color: "#d97706", bg: "rgba(217,119,6,0.15)" },
  "hospital": { emoji: "🏥", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  "clinic": { emoji: "🏥", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  "pharmacy": { emoji: "💊", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  "grocery": { emoji: "🛒", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  "shop": { emoji: "🛍️", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  "salon": { emoji: "💈", color: "#ec4899", bg: "rgba(236,72,153,0.15)" },
  "restaurant": { emoji: "🍽️", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  "school": { emoji: "🏫", color: "#06b6d4", bg: "rgba(6,182,212,0.15)" },
  "atm": { emoji: "🏧", color: "#14b8a6", bg: "rgba(20,184,166,0.15)" },
  "park": { emoji: "🌳", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  "petrol": { emoji: "⛽", color: "#f97316", bg: "rgba(249,115,22,0.15)" },
  "default": { emoji: "📍", color: "#9ca3af", bg: "rgba(156,163,175,0.15)" },
};

export default function CategoryBadge({ category = "", size = "sm" }) {
  const key = Object.keys(CATEGORY_MAP).find((k) =>
    category.toLowerCase().includes(k)
  ) || "default";

  const { emoji, color, bg } = CATEGORY_MAP[key];

  const pad = size === "lg" ? "8px 16px" : "4px 10px";
  const fs = size === "lg" ? "14px" : "12px";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: pad,
        borderRadius: "100px",
        background: bg,
        color: color,
        fontSize: fs,
        fontWeight: 600,
        border: `1px solid ${color}30`,
        whiteSpace: "nowrap",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {emoji} {category}
    </span>
  );
}
