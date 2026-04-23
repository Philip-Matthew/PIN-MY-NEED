// pages/Dashboard.js
// NEW FILE — Add route in App.js: <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import CategoryBadge from "../components/CategoryBadge";
import DemandHeatBar from "../components/DemandHeatBar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (p) => {
      const lat = p.coords.latitude;
      const lng = p.coords.longitude;
      setUserPos({ lat, lng });

      try {
        const res = await API.get(`/requirements/nearby?latitude=${lat}&longitude=${lng}`);
        setPins(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, () => setLoading(false));
  }, []);

  // Aggregate category counts
  const categoryMap = {};
  pins.forEach((p) => {
    const cat = p.category || "Other";
    if (!categoryMap[cat]) categoryMap[cat] = { count: 0, totalVotes: 0 };
    categoryMap[cat].count += 1;
    categoryMap[cat].totalVotes += p.votes || 1;
  });

  const topCategories = Object.entries(categoryMap)
    .map(([cat, data]) => ({ cat, ...data }))
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 8);

  const maxVotes = topCategories[0]?.totalVotes || 1;
  const totalVotes = pins.reduce((sum, p) => sum + (p.votes || 1), 0);
  const topPin = [...pins].sort((a, b) => (b.votes || 1) - (a.votes || 1))[0];

  const STAT_CARDS = [
    { icon: "📍", label: "Total Pins Nearby", value: pins.length, color: "#3b82f6" },
    { icon: "🗳️", label: "Total Votes", value: totalVotes, color: "#fbbf24" },
    { icon: "🏆", label: "Top Category", value: topCategories[0]?.cat || "—", color: "#ef4444" },
    { icon: "📊", label: "Unique Needs", value: Object.keys(categoryMap).length, color: "#10b981" },
  ];

  return (
    <div className="dash-root">
      <Navbar />

      <div className="dash-body">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Demand Dashboard</h1>
            <p className="dash-sub">
              {userPos
                ? `Showing demand near ${userPos.lat.toFixed(3)}, ${userPos.lng.toFixed(3)}`
                : "Loading your location..."}
            </p>
          </div>
          <button className="dash-refresh" onClick={() => window.location.reload()}>
            ↺ Refresh
          </button>
        </div>

        {loading ? (
          <div className="dash-loading">
            <div className="dash-spinner" />
            <p>Fetching demand data...</p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="dash-stat-grid">
              {STAT_CARDS.map((s, i) => (
                <div key={i} className="dash-stat-card" style={{ "--accent": s.color }}>
                  <div className="dash-stat-icon">{s.icon}</div>
                  <div className="dash-stat-val">{s.value}</div>
                  <div className="dash-stat-lbl">{s.label}</div>
                  <div className="dash-stat-glow" />
                </div>
              ))}
            </div>

            <div className="dash-two-col">
              {/* Category Demand Chart */}
              <div className="dash-panel">
                <h2 className="dash-panel-title">📊 Demand by Category</h2>
                {topCategories.length === 0 ? (
                  <p className="dash-empty">No pins found nearby.</p>
                ) : (
                  <div className="dash-cat-list">
                    {topCategories.map((item, i) => (
                      <div key={i} className="dash-cat-row">
                        <div className="dash-cat-info">
                          <CategoryBadge category={item.cat} />
                          <span className="dash-cat-count">{item.count} pin{item.count > 1 ? "s" : ""}</span>
                        </div>
                        <DemandHeatBar votes={item.totalVotes} maxVotes={maxVotes} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Demanded Pin */}
              <div className="dash-panel">
                <h2 className="dash-panel-title">🔥 Most Demanded</h2>
                {topPin ? (
                  <div className="dash-top-pin">
                    <div className="dash-top-pin-cat">
                      <CategoryBadge category={topPin.category} size="lg" />
                    </div>
                    <div className="dash-top-pin-votes">
                      <span className="dash-votes-num">{topPin.votes || 1}</span>
                      <span className="dash-votes-lbl">community votes</span>
                    </div>
                    <DemandHeatBar votes={topPin.votes || 1} maxVotes={maxVotes} />
                    <div className="dash-top-pin-coords">
                      {topPin.location?.coordinates
                        ? `📍 ${topPin.location.coordinates[1].toFixed(4)}, ${topPin.location.coordinates[0].toFixed(4)}`
                        : "Location unavailable"}
                    </div>
                    <button
                      className="dash-view-btn"
                      onClick={() => navigate("/map")}
                    >
                      View on Map →
                    </button>
                  </div>
                ) : (
                  <p className="dash-empty">No pins yet.</p>
                )}

                {/* Recent Pins */}
                <h2 className="dash-panel-title" style={{ marginTop: "28px" }}>🕐 Recent Pins</h2>
                <div className="dash-recent">
                  {pins.slice(0, 5).map((p, i) => (
                    <div key={i} className="dash-recent-row">
                      <CategoryBadge category={p.category} />
                      <span className="dash-recent-votes">▲ {p.votes || 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .dash-root {
          min-height: 100vh;
          background: #0d1117;
          color: #f0f6fc;
          font-family: 'DM Sans', sans-serif;
        }

        .dash-body {
          padding: 80px 32px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
        }

        .dash-title {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 6px;
        }

        .dash-sub {
          font-size: 13px;
          color: #6b7280;
        }

        .dash-refresh {
          padding: 8px 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #9ca3af;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .dash-refresh:hover { background: rgba(255,255,255,0.08); color: #f0f6fc; }

        .dash-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 80px;
          color: #6b7280;
        }
        .dash-spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(251,191,36,0.15);
          border-top-color: #fbbf24;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* STAT CARDS */
        .dash-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .dash-stat-card {
          position: relative;
          padding: 24px 20px;
          background: #161b22;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          overflow: hidden;
          transition: transform 0.2s;
        }
        .dash-stat-card:hover { transform: translateY(-3px); }

        .dash-stat-glow {
          position: absolute;
          top: -20px; right: -20px;
          width: 80px; height: 80px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.07;
          filter: blur(20px);
        }

        .dash-stat-icon { font-size: 22px; margin-bottom: 12px; }
        .dash-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: var(--accent);
          margin-bottom: 4px;
        }
        .dash-stat-lbl { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }

        /* TWO COL */
        .dash-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .dash-panel {
          background: #161b22;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 24px;
        }

        .dash-panel-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #f0f6fc;
        }

        .dash-empty { color: #6b7280; font-size: 14px; }

        /* CATEGORY LIST */
        .dash-cat-list { display: flex; flex-direction: column; gap: 16px; }
        .dash-cat-row { display: flex; flex-direction: column; gap: 8px; }
        .dash-cat-info { display: flex; justify-content: space-between; align-items: center; }
        .dash-cat-count { font-size: 11px; color: #6b7280; }

        /* TOP PIN */
        .dash-top-pin { display: flex; flex-direction: column; gap: 14px; }
        .dash-top-pin-votes {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .dash-votes-num {
          font-family: 'Syne', sans-serif;
          font-size: 40px;
          font-weight: 800;
          color: #fbbf24;
        }
        .dash-votes-lbl { font-size: 13px; color: #6b7280; }
        .dash-top-pin-coords { font-size: 12px; color: #6b7280; }
        .dash-view-btn {
          padding: 10px 18px;
          background: rgba(251,191,36,0.1);
          border: 1px solid rgba(251,191,36,0.25);
          border-radius: 8px;
          color: #fbbf24;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          align-self: flex-start;
        }
        .dash-view-btn:hover { background: rgba(251,191,36,0.18); }

        /* RECENT */
        .dash-recent { display: flex; flex-direction: column; gap: 10px; }
        .dash-recent-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .dash-recent-votes { font-size: 12px; color: #fbbf24; font-weight: 600; }

        @media (max-width: 900px) {
          .dash-stat-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-two-col { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
