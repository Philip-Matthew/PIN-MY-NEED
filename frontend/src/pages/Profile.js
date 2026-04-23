// pages/Profile.js — UPDATED (replaces the Profile.js from the frontend upgrade)
// Changes:
//   1. Fetches user's OWN pins from GET /api/requirements/my (new endpoint)
//   2. Fetches live user data from GET /api/auth/me
//   3. Allows deleting own pins via DELETE /api/requirements/:id
//   4. Shows role badge with switch to Business Owner option

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import CategoryBadge from "../components/CategoryBadge";
import DemandHeatBar from "../components/DemandHeatBar";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myPins, setMyPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch live user data
        const userRes = await API.get("/auth/me");
        setUser(userRes.data);

        // Fetch user's own pins
        const pinsRes = await API.get("/requirements/my");
        setMyPins(pinsRes.data || []);
      } catch (e) {
        console.error(e);
        if (e.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDelete = async (pinId) => {
    if (!window.confirm("Delete this pin?")) return;
    setDeletingId(pinId);
    try {
      await API.delete(`/requirements/${pinId}`);
      setMyPins((prev) => prev.filter((p) => p._id !== pinId));
    } catch (e) {
      alert(e.response?.data?.message || "Could not delete pin");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRoleSwitch = async () => {
    const newRole = user.role === "customer" ? "business" : "customer";
    try {
      const res = await API.patch("/auth/me", { role: newRole });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (e) {
      alert(e.response?.data?.message || "Could not update role");
    }
  };

  const totalVotes = myPins.reduce((s, p) => s + (p.votes || 1), 0);
  const maxVotes = Math.max(...myPins.map((p) => p.votes || 1), 1);

  return (
    <div className="prof-root">
      <Navbar />

      <div className="prof-body">
        {loading ? (
          <div className="prof-loading">
            <div className="prof-spinner" />
            <p>Loading profile...</p>
          </div>
        ) : (
          <>
            {/* Profile Hero */}
            <div className="prof-hero">
              <div className="prof-avatar">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="prof-info">
                <h1 className="prof-name">{user?.name || "User"}</h1>
                <p className="prof-phone">
                  📱 {user?.phone}
                  <span
                    className={`prof-badge ${user?.role === "business" ? "prof-badge--biz" : ""}`}
                  >
                    {user?.role === "business"
                      ? "🏪 Business Owner"
                      : "🙋 Customer"}
                  </span>
                </p>
                <button className="prof-role-switch" onClick={handleRoleSwitch}>
                  Switch to{" "}
                  {user?.role === "customer" ? "Business Owner" : "Customer"} →
                </button>
              </div>
              <div className="prof-stats-row">
                <div className="prof-mini-stat">
                  <span className="prof-mini-val">{myPins.length}</span>
                  <span className="prof-mini-lbl">My Pins</span>
                </div>
                <div className="prof-mini-stat">
                  <span className="prof-mini-val">{totalVotes}</span>
                  <span className="prof-mini-lbl">Total Votes</span>
                </div>
                <div className="prof-mini-stat">
                  <span className="prof-mini-val">{maxVotes}</span>
                  <span className="prof-mini-lbl">Top Pin</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="prof-actions">
              <button
                className="prof-action-btn prof-action-btn--primary"
                onClick={() => navigate("/map")}
              >
                📌 Go to Map
              </button>
              <button
                className="prof-action-btn"
                onClick={() => navigate("/dashboard")}
              >
                📊 Dashboard
              </button>
              <button
                className="prof-action-btn prof-action-btn--danger"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
              >
                🚪 Logout
              </button>
            </div>

            {/* My Pins */}
            <div className="prof-section">
              <h2 className="prof-section-title">📍 My Pinned Requirements</h2>
              {myPins.length === 0 ? (
                <div className="prof-empty">
                  <p>You haven't pinned anything yet.</p>
                  <button
                    className="prof-action-btn prof-action-btn--primary"
                    onClick={() => navigate("/map")}
                  >
                    Pin your first need →
                  </button>
                </div>
              ) : (
                <div className="prof-pin-grid">
                  {myPins.map((pin) => (
                    <div key={pin._id} className="prof-pin-card">
                      <div className="prof-pin-top">
                        <CategoryBadge category={pin.category} />
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span className="prof-pin-votes">
                            ▲ {pin.votes || 1}
                          </span>
                          <button
                            className="prof-delete-btn"
                            onClick={() => handleDelete(pin._id)}
                            disabled={deletingId === pin._id}
                            title="Delete pin"
                          >
                            {deletingId === pin._id ? "..." : "🗑"}
                          </button>
                        </div>
                      </div>
                      <DemandHeatBar
                        votes={pin.votes || 1}
                        maxVotes={maxVotes}
                        showLabel={false}
                      />
                      {pin.description && (
                        <p className="prof-pin-desc">{pin.description}</p>
                      )}
                      {pin.location?.coordinates && (
                        <p className="prof-pin-coords">
                          📍 {pin.location.coordinates[1].toFixed(4)},{" "}
                          {pin.location.coordinates[0].toFixed(4)}
                        </p>
                      )}
                      <p className="prof-pin-date">
                        {new Date(pin.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How to Use */}
            <div className="prof-section">
              <h2 className="prof-section-title">💡 How to Use PinMyNeed</h2>
              <div className="prof-steps">
                {[
                  {
                    step: "1",
                    title: "Go to the Map",
                    desc: "Navigate to the map to see your area.",
                  },
                  {
                    step: "2",
                    title: "Click to Pin",
                    desc: "Tap any spot to add a new requirement.",
                  },
                  {
                    step: "3",
                    title: "Choose Category",
                    desc: "Pick Tea Shop, Hospital, ATM, etc.",
                  },
                  {
                    step: "4",
                    title: "Community Votes",
                    desc: "Others upvote to raise demand priority.",
                  },
                ].map((s, i) => (
                  <div key={i} className="prof-step">
                    <div className="prof-step-num">{s.step}</div>
                    <div>
                      <div className="prof-step-title">{s.title}</div>
                      <div className="prof-step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .prof-root { min-height: 100vh; background: #0d1117; color: #f0f6fc; font-family: 'DM Sans', sans-serif; }
        .prof-body { padding: 76px 32px 48px; max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
        .prof-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 80px; color: #6b7280; }
        .prof-spinner { width: 32px; height: 32px; border: 3px solid rgba(251,191,36,0.15); border-top-color: #fbbf24; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .prof-hero { display: flex; align-items: center; gap: 24px; padding: 28px; background: #161b22; border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; flex-wrap: wrap; }
        .prof-avatar { width: 68px; height: 68px; background: linear-gradient(135deg,#fbbf24,#f59e0b); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #0a0a0f; flex-shrink: 0; }
        .prof-info { flex: 1; min-width: 180px; }
        .prof-name { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 6px; }
        .prof-phone { font-size: 14px; color: #6b7280; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
        .prof-badge { padding: 3px 10px; background: rgba(16,185,129,0.15); color: #10b981; border-radius: 100px; font-size: 11px; font-weight: 600; border: 1px solid rgba(16,185,129,0.25); }
        .prof-badge--biz { background: rgba(251,191,36,0.15); color: #fbbf24; border-color: rgba(251,191,36,0.25); }
        .prof-role-switch { background: none; border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #6b7280; font-size: 12px; cursor: pointer; padding: 4px 10px; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .prof-role-switch:hover { color: #fbbf24; border-color: rgba(251,191,36,0.3); }

        .prof-stats-row { display: flex; gap: 28px; margin-left: auto; }
        .prof-mini-stat { text-align: center; }
        .prof-mini-val { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #fbbf24; display: block; }
        .prof-mini-lbl { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }

        .prof-actions { display: flex; gap: 10px; flex-wrap: wrap; }
        .prof-action-btn { padding: 9px 18px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #f0f6fc; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .prof-action-btn:hover { background: rgba(255,255,255,0.08); }
        .prof-action-btn--primary { background: rgba(251,191,36,0.12); border-color: rgba(251,191,36,0.3); color: #fbbf24; font-weight: 600; }
        .prof-action-btn--primary:hover { background: rgba(251,191,36,0.2); }
        .prof-action-btn--danger { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2); color: #f87171; }
        .prof-action-btn--danger:hover { background: rgba(239,68,68,0.14); }

        .prof-section { background: #161b22; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; }
        .prof-section-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 18px; }
        .prof-empty { text-align: center; padding: 32px; color: #6b7280; display: flex; flex-direction: column; gap: 14px; align-items: center; font-size: 14px; }

        .prof-pin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; }
        .prof-pin-card { padding: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; display: flex; flex-direction: column; gap: 8px; transition: all 0.2s; }
        .prof-pin-card:hover { border-color: rgba(251,191,36,0.15); transform: translateY(-2px); }
        .prof-pin-top { display: flex; justify-content: space-between; align-items: center; }
        .prof-pin-votes { font-size: 12px; color: #fbbf24; font-weight: 700; }
        .prof-delete-btn { background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px 5px; border-radius: 4px; transition: background 0.2s; }
        .prof-delete-btn:hover { background: rgba(239,68,68,0.15); }
        .prof-delete-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .prof-pin-desc { font-size: 12px; color: #9ca3af; }
        .prof-pin-coords { font-size: 11px; color: #374151; }
        .prof-pin-date { font-size: 11px; color: #374151; }

        .prof-steps { display: flex; flex-direction: column; gap: 14px; }
        .prof-step { display: flex; align-items: flex-start; gap: 14px; }
        .prof-step-num { width: 30px; height: 30px; background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; color: #fbbf24; font-size: 13px; flex-shrink: 0; }
        .prof-step-title { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
        .prof-step-desc { font-size: 13px; color: #6b7280; line-height: 1.5; }

        @media (max-width: 640px) { .prof-hero { flex-direction: column; align-items: flex-start; } .prof-stats-row { margin-left: 0; } }
      `}</style>
    </div>
  );
}
