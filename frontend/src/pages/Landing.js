// pages/Landing.js
// NEW FILE — Add route: <Route path="/landing" element={<Landing />} />
// Also update App.js to redirect unauthenticated users here instead of /login

import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

const FEATURES = [
  {
    icon: "📍",
    title: "Pin Your Need",
    desc: "Drop a pin anywhere on the map and tell the community what's missing — a tea stall, a pharmacy, a repair shop.",
  },
  {
    icon: "🏪",
    title: "Business Discovery",
    desc: "Business owners see real-time demand heatmaps. Set up exactly where people need you most.",
  },
  {
    icon: "🗳️",
    title: "Community Votes",
    desc: "Neighbours upvote pins they agree with. The louder the demand, the higher the priority.",
  },
  {
    icon: "📊",
    title: "Demand Analytics",
    desc: "Track trending categories, hotspot zones, and growth in your area — all from the dashboard.",
  },
];

const STATS = [
  { value: "10K+", label: "Pins Placed" },
  { value: "2K+", label: "Businesses Found" },
  { value: "50+", label: "Cities" },
  { value: "98%", label: "Match Rate" },
];

export default function Landing() {
  const canvasRef = useRef(null);

  // Animated particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251,191,36,${p.opacity})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="land-root">
      <canvas ref={canvasRef} className="land-canvas" />

      {/* NAV */}
      <nav className="land-nav">
        <span className="land-logo">📌 PinMyNeed</span>
        <div className="land-nav-links">
          <Link to="/about" className="land-nav-a">About</Link>
          <Link to="/login" className="land-nav-btn">Login</Link>
          <Link to="/signup" className="land-nav-btn land-nav-btn--fill">Sign Up</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="land-hero">
        <div className="land-hero-tag">🌍 Hyperlocal · Demand-Driven</div>
        <h1 className="land-h1">
          Your Neighbourhood,<br />
          <span className="land-accent">Your Voice.</span>
        </h1>
        <p className="land-sub">
          Pin what your locality needs. Businesses discover where to set up.
          <br />Communities grow together — one pin at a time.
        </p>
        <div className="land-cta-row">
          <Link to="/signup" className="land-cta-primary">Get Started Free →</Link>
          <Link to="/map" className="land-cta-ghost">Explore the Map</Link>
        </div>

        {/* FLOATING MAP PREVIEW */}
        <div className="land-map-preview">
          <div className="land-map-inner">
            <div className="land-grid-lines" />
            {[
              { top: "30%", left: "25%", label: "☕ Tea Stall", votes: 14, delay: "0s" },
              { top: "55%", left: "60%", label: "🏥 Clinic", votes: 8, delay: "0.3s" },
              { top: "20%", left: "65%", label: "🛒 Grocery", votes: 22, delay: "0.6s" },
              { top: "70%", left: "30%", label: "💈 Salon", votes: 5, delay: "0.9s" },
            ].map((pin, i) => (
              <div
                key={i}
                className="land-pin"
                style={{ top: pin.top, left: pin.left, animationDelay: pin.delay }}
              >
                <div className="land-pin-bubble">
                  {pin.label}
                  <span className="land-pin-votes">▲ {pin.votes}</span>
                </div>
                <div className="land-pin-dot" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="land-stats">
        {STATS.map((s, i) => (
          <div key={i} className="land-stat">
            <div className="land-stat-val">{s.value}</div>
            <div className="land-stat-lbl">{s.label}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="land-features">
        <h2 className="land-section-title">How It Works</h2>
        <div className="land-feat-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="land-feat-card" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="land-feat-icon">{f.icon}</div>
              <h3 className="land-feat-title">{f.title}</h3>
              <p className="land-feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="land-banner">
        <h2>Ready to pin your first need?</h2>
        <p>Join thousands shaping their neighbourhood.</p>
        <Link to="/signup" className="land-cta-primary">Create Free Account →</Link>
      </section>

      {/* FOOTER */}
      <footer className="land-footer">
        <span>📌 PinMyNeed — Built by Philip Matthew</span>
        <div>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .land-root {
          min-height: 100vh;
          background: #0a0a0f;
          color: #f0ece4;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        .land-canvas {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        /* NAV */
        .land-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 48px;
          background: rgba(10,10,15,0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(251,191,36,0.1);
        }
        .land-logo {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #fbbf24;
          letter-spacing: -0.5px;
        }
        .land-nav-links {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .land-nav-a {
          color: #a8a29e;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .land-nav-a:hover { color: #f0ece4; }
        .land-nav-btn {
          padding: 8px 18px;
          border-radius: 8px;
          border: 1px solid rgba(251,191,36,0.3);
          color: #fbbf24;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s;
        }
        .land-nav-btn:hover { background: rgba(251,191,36,0.1); }
        .land-nav-btn--fill {
          background: #fbbf24;
          color: #0a0a0f;
          border-color: #fbbf24;
          font-weight: 600;
        }
        .land-nav-btn--fill:hover { background: #f59e0b; }

        /* HERO */
        .land-hero {
          position: relative;
          z-index: 1;
          padding: 160px 48px 80px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .land-hero-tag {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 100px;
          background: rgba(251,191,36,0.12);
          border: 1px solid rgba(251,191,36,0.25);
          color: #fbbf24;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
          margin-bottom: 28px;
          text-transform: uppercase;
        }
        .land-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(42px, 6vw, 80px);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -2px;
          margin-bottom: 24px;
          max-width: 700px;
        }
        .land-accent { color: #fbbf24; }
        .land-sub {
          font-size: 18px;
          color: #a8a29e;
          line-height: 1.7;
          margin-bottom: 40px;
          max-width: 500px;
          font-weight: 300;
        }
        .land-cta-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .land-cta-primary {
          padding: 14px 28px;
          background: #fbbf24;
          color: #0a0a0f;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          font-size: 15px;
          transition: all 0.25s;
          font-family: 'Syne', sans-serif;
        }
        .land-cta-primary:hover {
          background: #f59e0b;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(251,191,36,0.3);
        }
        .land-cta-ghost {
          padding: 14px 28px;
          background: transparent;
          color: #f0ece4;
          border: 1px solid rgba(240,236,228,0.2);
          border-radius: 10px;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          transition: all 0.25s;
        }
        .land-cta-ghost:hover {
          background: rgba(240,236,228,0.06);
          border-color: rgba(240,236,228,0.4);
        }

        /* FLOATING MAP PREVIEW */
        .land-map-preview {
          position: absolute;
          top: 120px;
          right: 0;
          width: 480px;
          height: 380px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(251,191,36,0.15);
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
        }
        .land-map-inner {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #111827 0%, #1a2035 50%, #0f1720 100%);
          position: relative;
          overflow: hidden;
        }
        .land-grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(251,191,36,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251,191,36,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .land-pin {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: pinDrop 0.5s ease both;
        }
        @keyframes pinDrop {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .land-pin-bubble {
          background: rgba(17,24,39,0.95);
          border: 1px solid rgba(251,191,36,0.35);
          border-radius: 8px;
          padding: 6px 10px;
          font-size: 12px;
          white-space: nowrap;
          color: #f0ece4;
          display: flex;
          gap: 8px;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .land-pin-votes {
          color: #fbbf24;
          font-size: 11px;
          font-weight: 600;
        }
        .land-pin-dot {
          width: 8px; height: 8px;
          background: #fbbf24;
          border-radius: 50%;
          margin-top: 3px;
          box-shadow: 0 0 8px rgba(251,191,36,0.7);
        }

        /* STATS */
        .land-stats {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(251,191,36,0.08);
          border-top: 1px solid rgba(251,191,36,0.08);
          border-bottom: 1px solid rgba(251,191,36,0.08);
        }
        .land-stat {
          padding: 40px 24px;
          background: #0a0a0f;
          text-align: center;
        }
        .land-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 38px;
          font-weight: 800;
          color: #fbbf24;
        }
        .land-stat-lbl {
          font-size: 13px;
          color: #78716c;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* FEATURES */
        .land-features {
          position: relative;
          z-index: 1;
          padding: 100px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .land-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 56px;
          color: #f0ece4;
        }
        .land-feat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .land-feat-card {
          padding: 32px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          transition: all 0.3s;
          animation: fadeUp 0.6s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .land-feat-card:hover {
          background: rgba(251,191,36,0.04);
          border-color: rgba(251,191,36,0.2);
          transform: translateY(-4px);
        }
        .land-feat-icon { font-size: 32px; margin-bottom: 16px; }
        .land-feat-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #f0ece4;
        }
        .land-feat-desc {
          font-size: 14px;
          color: #78716c;
          line-height: 1.7;
        }

        /* CTA BANNER */
        .land-banner {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 80px 48px;
          background: linear-gradient(135deg, rgba(251,191,36,0.08), rgba(245,158,11,0.03));
          border-top: 1px solid rgba(251,191,36,0.1);
          border-bottom: 1px solid rgba(251,191,36,0.1);
        }
        .land-banner h2 {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }
        .land-banner p {
          color: #78716c;
          margin-bottom: 32px;
          font-size: 16px;
        }

        /* FOOTER */
        .land-footer {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 48px;
          font-size: 13px;
          color: #44403c;
        }
        .land-footer a {
          color: #78716c;
          text-decoration: none;
          margin-left: 20px;
          transition: color 0.2s;
        }
        .land-footer a:hover { color: #fbbf24; }

        @media (max-width: 900px) {
          .land-map-preview { display: none; }
          .land-stats { grid-template-columns: repeat(2, 1fr); }
          .land-feat-grid { grid-template-columns: 1fr; }
          .land-nav { padding: 16px 20px; }
          .land-hero { padding: 120px 20px 60px; }
        }
      `}</style>
    </div>
  );
}
