// pages/Signup.js — UPDATED (drop-in replacement)
// Changes:
//   1. Stores res.data.user in localStorage so Profile works immediately
//   2. Adds role selector (Customer / Business Owner)
//   3. Loading state on submit button

import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", { name, phone, password, role });

      localStorage.setItem("token", res.data.token);
      // ✅ Store user so Profile/Navbar can display name & role
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/map");
    } catch (err) {
      alert(err.response?.data?.message || "Signup error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2 className="signup-title">Create Account 🚀</h2>

        <form onSubmit={submit} className="signup-form">
          <div className="input-group">
            <input type="text" placeholder=" " value={name}
              onChange={(e) => setName(e.target.value)} required />
            <label>Name</label>
          </div>

          <div className="input-group">
            <input type="text" placeholder=" " value={phone}
              onChange={(e) => setPhone(e.target.value)} required />
            <label>Phone</label>
          </div>

          <div className="input-group">
            <input type="password" placeholder=" " value={password}
              onChange={(e) => setPassword(e.target.value)} required />
            <label>Password</label>
          </div>

          {/* Role Selector — NEW */}
          <div className="role-group">
            <p className="role-label">I am a...</p>
            <div className="role-options">
              <button
                type="button"
                className={`role-btn ${role === "customer" ? "role-btn--active" : ""}`}
                onClick={() => setRole("customer")}
              >
                🙋 Customer
              </button>
              <button
                type="button"
                className={`role-btn ${role === "business" ? "role-btn--active" : ""}`}
                onClick={() => setRole("business")}
              >
                🏪 Business Owner
              </button>
            </div>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>

      <style>{`
        .signup-wrapper {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url("l1.png");
          font-family: 'Segoe UI', sans-serif;
        }
        .signup-card {
          width: 400px;
          padding: 40px;
          border-radius: 20px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(15px);
          box-shadow: 0 25px 45px rgba(0,0,0,0.2);
          color: white;
          animation: fadeInUp 0.8s ease;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .signup-title {
          text-align: center;
          margin-bottom: 30px;
          font-weight: 600;
          color: black;
        }
        .signup-form { display: flex; flex-direction: column; }
        .input-group { position: relative; margin-bottom: 25px; }
        .input-group input {
          width: 100%;
          padding: 12px 10px;
          border-radius: 8px;
          border: none;
          outline: none;
          font-size: 14px;
          background: rgba(255,255,255,0.2);
          color: black;
          box-sizing: border-box;
        }
        .input-group label {
          position: absolute;
          top: 12px; left: 10px;
          font-size: 14px;
          color: #000;
          pointer-events: none;
          transition: 0.3s ease;
        }
        .input-group input:focus + label,
        .input-group input:not(:placeholder-shown) + label {
          top: -10px; left: 5px;
          font-size: 12px;
          color: #000;
        }
        /* Role Selector */
        .role-group { margin-bottom: 24px; }
        .role-label {
          font-size: 13px;
          color: #000;
          margin-bottom: 10px;
          font-weight: 500;
        }
        .role-options { display: flex; gap: 10px; }
        .role-btn {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: 2px solid rgba(0,0,0,0.15);
          background: rgba(255,255,255,0.15);
          color: #000;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .role-btn:hover { background: rgba(255,255,255,0.3); }
        .role-btn--active {
          border-color: #2563eb;
          background: rgba(37,99,235,0.15);
          color: #1e40af;
          font-weight: 700;
        }
        .signup-btn {
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(45deg, #36d1dc, #5b86e5);
          color: black;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s ease;
        }
        .signup-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .signup-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }
        .login-text {
          margin-top: 20px;
          text-align: center;
          font-size: 14px;
        }
        .login-text a {
          color: #000;
          font-weight: bold;
          text-decoration: none;
        }
        .login-text a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
