// pages/About.js — UPDATED (drop-in replacement)
// Full styled About page, consistent with PinMyNeed design system

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const token = localStorage.getItem("token");

export default function About() {
  return (
    <div className="about-root">
      {token ? (
        <Navbar />
      ) : (
        <nav className="about-nav">
          <Link to="/landing" className="about-logo">
            📌 PinMyNeed
          </Link>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/login" className="about-nav-link">
              Login
            </Link>
            <Link to="/signup" className="about-nav-link about-nav-link--fill">
              Sign Up
            </Link>
          </div>
        </nav>
      )}

      <div className="about-body">
        {/* Hero */}
        <div className="about-hero">
          <div className="about-tag">About the Project</div>
          <h1 className="about-title">
            Built for <span className="about-accent">Communities.</span>
            <br />
            Powered by Demand.
          </h1>
          <p className="about-desc">
            PinMyNeed is a location-based, demand-driven platform designed to
            bridge the gap between customers and business owners. Users pin
            their local needs on a digital map — businesses discover where real
            demand exists.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="about-cards">
          {[
            {
              icon: "🎯",
              title: "The Problem",
              body: "Businesses often set up in the wrong places, while communities lack the services they genuinely need. There's no simple way to signal demand before a business opens.",
            },
            {
              icon: "💡",
              title: "Our Solution",
              body: "PinMyNeed lets anyone drop a pin on a map for a service they want nearby. Community members vote. Businesses see real demand heatmaps and set up exactly where they're needed.",
            },
            {
              icon: "🚀",
              title: "The Vision",
              body: "A world where every neighbourhood has the services it needs — not by chance, but by design. Where local demand directly shapes local supply, powered by a simple map.",
            },
          ].map((card, i) => (
            <div key={i} className="about-card">
              <div className="about-card-icon">{card.icon}</div>
              <h3 className="about-card-title">{card.title}</h3>
              <p className="about-card-body">{card.body}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="about-section">
          <h2 className="about-section-title">How It Works</h2>
          <div className="about-flow">
            {[
              {
                step: "01",
                title: "Users Pin Needs",
                desc: "Open the map, tap a location, and add a category like 'Tea Shop' or 'Hospital'.",
              },
              {
                step: "02",
                title: "Community Votes",
                desc: "Neighbours upvote pins they agree with — creating a real demand signal.",
              },
              {
                step: "03",
                title: "Businesses Discover",
                desc: "Business owners explore demand heatmaps to find the perfect location to set up.",
              },
              {
                step: "04",
                title: "Needs Get Fulfilled",
                desc: "Local services appear where they're actually wanted, benefiting everyone.",
              },
            ].map((step, i) => (
              <div key={i} className="about-flow-step">
                <div className="about-flow-num">{step.step}</div>
                <div>
                  <div className="about-flow-title">{step.title}</div>
                  <div className="about-flow-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Creator */}
        <div className="about-creator">
          <div className="about-creator-avatar">P</div>
          <div>
            <h3 className="about-creator-name">Philip Matthew</h3>
            <p className="about-creator-role">
              Creator & Developer · PinMyNeed
            </p>
            <p className="about-creator-bio">
              Built with a passion for connecting communities with the services
              they deserve. PinMyNeed is a MERN stack project combining
              real-time geolocation, community voting, and demand analytics to
              empower both users and businesses.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="about-cta">
          <h2>Ready to make a difference in your area?</h2>
          <div className="about-cta-btns">
            <Link to={token ? "/map" : "/signup"} className="about-cta-primary">
              {token ? "Go to Map →" : "Get Started →"}
            </Link>
            <Link
              to={token ? "/dashboard" : "/login"}
              className="about-cta-ghost"
            >
              {token ? "View Dashboard" : "Login"}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .about-root {
          min-height: 100vh;
          background: #0d1117;
          color: #f0f6fc;
          font-family: 'DM Sans', sans-serif;
        }

        .about-nav {
          position: sticky;
          top: 0;
          z-index: 99;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 32px;
          background: rgba(13,17,23,0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .about-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          color: #fbbf24;
          text-decoration: none;
          font-size: 17px;
        }
        .about-nav-link {
          padding: 7px 16px;
          border-radius: 8px;
          border: 1px solid rgba(251,191,36,0.25);
          color: #fbbf24;
          text-decoration: none;
          font-size: 13px;
          transition: all 0.2s;
        }
        .about-nav-link:hover { background: rgba(251,191,36,0.08); }
        .about-nav-link--fill {
          background: #fbbf24;
          color: #0a0a0f;
          font-weight: 600;
          border-color: #fbbf24;
        }
        .about-nav-link--fill:hover { background: #f59e0b; }

        .about-body {
          max-width: 960px;
          margin: 0 auto;
          padding: 80px 32px 60px;
          display: flex;
          flex-direction: column;
          gap: 64px;
        }

        .about-hero { max-width: 700px; }
        .about-tag {
          display: inline-block;
          padding: 5px 14px;
          background: rgba(251,191,36,0.1);
          border: 1px solid rgba(251,191,36,0.2);
          color: #fbbf24;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 24px;
        }
        .about-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          letter-spacing: -1.5px;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .about-accent { color: #fbbf24; }
        .about-desc {
          font-size: 16px;
          color: #9ca3af;
          line-height: 1.75;
          font-weight: 300;
        }

        .about-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .about-card {
          padding: 28px;
          background: #161b22;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          transition: all 0.25s;
        }
        .about-card:hover {
          border-color: rgba(251,191,36,0.2);
          transform: translateY(-4px);
        }
        .about-card-icon { font-size: 28px; margin-bottom: 14px; }
        .about-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .about-card-body { font-size: 14px; color: #6b7280; line-height: 1.7; }

        .about-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          margin-bottom: 28px;
          letter-spacing: -0.5px;
        }

        .about-flow { display: flex; flex-direction: column; gap: 20px; }
        .about-flow-step {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          padding: 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px;
        }
        .about-flow-num {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: rgba(251,191,36,0.3);
          min-width: 40px;
        }
        .about-flow-title { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
        .about-flow-desc { font-size: 14px; color: #6b7280; line-height: 1.6; }

        .about-creator {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          padding: 32px;
          background: #161b22;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .about-creator-avatar {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #0a0a0f;
          flex-shrink: 0;
        }
        .about-creator-name {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .about-creator-role { font-size: 13px; color: #fbbf24; margin-bottom: 12px; }
        .about-creator-bio { font-size: 14px; color: #6b7280; line-height: 1.7; }

        .about-cta {
          text-align: center;
          padding: 56px 32px;
          background: linear-gradient(135deg, rgba(251,191,36,0.06), rgba(245,158,11,0.02));
          border: 1px solid rgba(251,191,36,0.1);
          border-radius: 20px;
        }
        .about-cta h2 {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 24px;
          letter-spacing: -0.5px;
        }
        .about-cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .about-cta-primary {
          padding: 12px 24px;
          background: #fbbf24;
          color: #0a0a0f;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.2s;
          font-family: 'Syne', sans-serif;
        }
        .about-cta-primary:hover { background: #f59e0b; transform: translateY(-2px); }
        .about-cta-ghost {
          padding: 12px 24px;
          border: 1px solid rgba(255,255,255,0.12);
          color: #9ca3af;
          border-radius: 10px;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s;
        }
        .about-cta-ghost:hover { background: rgba(255,255,255,0.05); color: #f0f6fc; }

        @media (max-width: 768px) {
          .about-cards { grid-template-columns: 1fr; }
          .about-body { padding: 60px 20px 40px; }
        }
      `}</style>
    </div>
  );
}
