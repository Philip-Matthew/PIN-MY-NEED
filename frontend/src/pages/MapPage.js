import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
  Popup,
} from "react-leaflet";
import { useEffect, useState } from "react";
import API from "../services/api";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import AddRequirementModal from "../components/AddRequirementModal";
import Navbar from "../components/Navbar";
import CategoryBadge from "../components/CategoryBadge";
import DemandHeatBar from "../components/DemandHeatBar";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function Recenter({ pos }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo(pos, 16, { duration: 1.5 });
  }, [pos, map]);
  return null;
}

function AddPin({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) });
  return null;
}

export default function MapPage() {
  const navigate = useNavigate();
  const [markers, setMarkers] = useState([]);
  const [pos, setPos] = useState(null);
  const [selectedPos, setSelectedPos] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [filter, setFilter] = useState("All");

  // Track which pins the current user has already upvoted this session
  const [votedIds, setVotedIds] = useState(new Set());

  // Get current user id from localStorage to detect own pins
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [36, 36],
  });

  const loadPins = async (lat, lng) => {
    try {
      const res = await API.get(
        `/requirements/nearby?latitude=${lat}&longitude=${lng}`,
      );
      const pins = res.data || [];
      setMarkers(pins);

      // Pre-populate votedIds from the voters arrays returned by the API
      const alreadyVoted = new Set(
        pins
          .filter((p) =>
            p.voters?.some(
              (v) => (v._id || v).toString() === currentUser._id?.toString(),
            ),
          )
          .map((p) => p._id),
      );
      setVotedIds(alreadyVoted);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const lat = p.coords.latitude;
        const lng = p.coords.longitude;
        setPos([lat, lng]);
        loadPins(lat, lng);
      },
      () => {
        // Fallback to Chennai if geolocation denied
        setPos([13.0827, 80.2707]);
        loadPins(13.0827, 80.2707);
      },
    );
  }, []);

  const handleMapClick = (latlng) => {
    setClickedLatLng(latlng);
    setModalOpen(true);
  };

  const handleModalSubmit = async (category) => {
    try {
      await API.post("/requirements", {
        category,
        latitude: clickedLatLng.lat,
        longitude: clickedLatLng.lng,
      });
      setModalOpen(false);
      loadPins(clickedLatLng.lat, clickedLatLng.lng);
      setSelectedPos([clickedLatLng.lat, clickedLatLng.lng]);
    } catch (err) {
      alert(err.response?.data?.message || "Error creating pin");
    }
  };

  const handleUpvote = async (pinId) => {
    try {
      // ✅ FIX: use the actual vote count returned by the API
      // instead of blindly incrementing local state
      const res = await API.post(`/requirements/${pinId}/upvote`);
      const { votes } = res.data;

      setMarkers((prev) =>
        prev.map((m) => (m._id === pinId ? { ...m, votes } : m)),
      );

      // Mark this pin as voted so the button disables immediately
      setVotedIds((prev) => new Set(prev).add(pinId));
    } catch (e) {
      alert(e.response?.data?.message || "Error");
    }
  };

  const categories = [
    "All",
    ...new Set(markers.map((m) => m.category).filter(Boolean)),
  ];

  const filteredMarkers =
    filter === "All" ? markers : markers.filter((m) => m.category === filter);

  const maxVotes = Math.max(...markers.map((m) => m.votes || 1), 1);

  if (!pos)
    return (
      <div className="mp-loading">
        <div className="mp-spinner" />
        <center>
          <p>📍 Finding your location...</p>
        </center>
      </div>
    );

  return (
    <div className="mp-root">
      <Navbar />

      <AddRequirementModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        location={clickedLatLng}
      />

      <div className="mp-layout">
        {/* SIDEBAR */}
        <div className="mp-sidebar">
          <div className="mp-sidebar-header">
            <h2>📌 Nearby Needs</h2>
            <span className="mp-count">{filteredMarkers.length} pins</span>
          </div>

          <div className="mp-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`mp-filter-btn ${filter === cat ? "mp-filter-btn--active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mp-pin-list">
            {filteredMarkers.length === 0 ? (
              <div className="mp-empty">
                <p>No pins found.</p>
                <p style={{ fontSize: "12px", marginTop: "6px" }}>
                  Click anywhere on the map to add one!
                </p>
              </div>
            ) : (
              filteredMarkers.map((m) => {
                if (!m?.location?.coordinates) return null;
                const lat = m.location.coordinates[1];
                const lng = m.location.coordinates[0];
                return (
                  <div
                    key={m._id}
                    className="mp-card"
                    onClick={() => setSelectedPos([lat, lng])}
                  >
                    <div className="mp-card-top">
                      <CategoryBadge category={m.category} />
                      <span className="mp-card-votes">▲ {m.votes || 1}</span>
                    </div>
                    <DemandHeatBar
                      votes={m.votes || 1}
                      maxVotes={maxVotes}
                      showLabel={false}
                    />
                    <p className="mp-card-coords">
                      {lat.toFixed(4)}, {lng.toFixed(4)}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* MAP */}
        <div className="mp-map-area">
          <div className="mp-hint">💡 Click the map to pin a need</div>
          <MapContainer
            center={pos}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <Recenter pos={selectedPos || pos} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <AddPin onMapClick={handleMapClick} />

            {filteredMarkers.map((m) => {
              if (!m?.location?.coordinates) return null;
              const lat = m.location.coordinates[1];
              const lng = m.location.coordinates[0];

              const isOwnPin =
                m.user?._id?.toString() === currentUser._id?.toString();
              const hasVoted = votedIds.has(m._id);
              const cannotVote = isOwnPin || hasVoted;

              return (
                <Marker icon={customIcon} key={m._id} position={[lat, lng]}>
                  <Popup>
                    <div
                      style={{
                        minWidth: "140px",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <b style={{ fontSize: "14px" }}>{m.category}</b>
                      <br />
                      <span style={{ color: "#666", fontSize: "12px" }}>
                        Votes: {m.votes || 1}
                      </span>
                      <br />
                      <br />
                      <button
                        style={{
                          padding: "6px 12px",
                          background: cannotVote
                            ? "#e5e7eb"
                            : "linear-gradient(45deg,#fbbf24,#f59e0b)",
                          border: "none",
                          borderRadius: "6px",
                          color: cannotVote ? "#9ca3af" : "#0a0a0f",
                          fontWeight: "bold",
                          cursor: cannotVote ? "not-allowed" : "pointer",
                          fontSize: "13px",
                          width: "100%",
                          transition: "all 0.2s",
                        }}
                        onClick={() => !cannotVote && handleUpvote(m._id)}
                        disabled={cannotVote}
                        title={
                          isOwnPin
                            ? "You can't upvote your own pin"
                            : hasVoted
                              ? "Already voted"
                              : "Upvote this need"
                        }
                      >
                        {isOwnPin
                          ? "📌 Your Pin"
                          : hasVoted
                            ? "✅ Voted"
                            : "👍 Upvote"}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .mp-root {
          height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          background: #0d1117;
        }

        .mp-loading {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 16px;
          background: #0d1117;
          color: #9ca3af;
          font-family: 'DM Sans', sans-serif;
        }
        .mp-spinner {
          width: 36px; height: 36px;
          border: 3px solid rgba(251,191,36,0.15);
          border-top-color: #fbbf24;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .mp-layout {
          display: flex;
          flex: 1;
          margin-top: 56px;
          height: calc(100vh - 56px);
          overflow: hidden;
        }

        .mp-sidebar {
          width: 300px;
          flex-shrink: 0;
          background: #111827;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
        }

        .mp-sidebar-header {
          padding: 20px 16px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .mp-sidebar-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #f0f6fc;
        }
        .mp-count {
          font-size: 12px;
          color: #6b7280;
          background: rgba(255,255,255,0.06);
          padding: 3px 8px;
          border-radius: 100px;
        }

        .mp-filters {
          display: flex;
          gap: 6px;
          padding: 12px 16px;
          overflow-x: auto;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          scrollbar-width: none;
        }
        .mp-filters::-webkit-scrollbar { display: none; }
        .mp-filter-btn {
          flex-shrink: 0;
          padding: 4px 12px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: #9ca3af;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .mp-filter-btn:hover { background: rgba(255,255,255,0.05); color: #f0f6fc; }
        .mp-filter-btn--active {
          background: rgba(251,191,36,0.15);
          border-color: rgba(251,191,36,0.35);
          color: #fbbf24;
          font-weight: 600;
        }

        .mp-pin-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }

        .mp-empty {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
          font-size: 14px;
        }

        .mp-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mp-card:hover {
          background: rgba(251,191,36,0.05);
          border-color: rgba(251,191,36,0.2);
          transform: translateX(3px);
        }
        .mp-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mp-card-votes { font-size: 12px; color: #fbbf24; font-weight: 700; }
        .mp-card-coords { font-size: 10px; color: #374151; }

        .mp-map-area {
          flex: 1;
          position: relative;
        }

        .mp-hint {
          position: absolute;
          z-index: 1000;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 16px;
          background: rgba(17,24,39,0.85);
          border: 1px solid rgba(251,191,36,0.2);
          border-radius: 100px;
          color: #9ca3af;
          font-size: 12px;
          backdrop-filter: blur(6px);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
