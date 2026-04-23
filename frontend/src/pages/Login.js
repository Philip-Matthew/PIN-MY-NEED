// pages/Login.js — UPDATED (drop-in replacement)
// Change: stores res.data.user in localStorage so Profile page works

import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { phone, password });

      localStorage.setItem("token", res.data.token);
      // ✅ Store user so Profile/Navbar can display name & role
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/map");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>

        <form onSubmit={submit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder=" "
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <label>Phone</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="signup-text">
            No account? <Link to="/signup">Signup here</Link>
          </p>
        </form>
      </div>

      <style>{`
        .login-wrapper {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: url("l1.png");
          font-family: 'Segoe UI', sans-serif;
        }
        .login-card {
          width: 380px;
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
        .login-title {
          text-align: center;
          margin-bottom: 30px;
          font-weight: 600;
          color: black;
        }
        .login-form { display: flex; flex-direction: column; }
        .input-group { position: relative; margin-bottom: 25px; }
        .input-group input {
          width: 100%;
          padding: 12px 10px;
          border-radius: 8px;
          border: none;
          outline: none;
          font-size: 14px;
          background: rgba(173,173,173,0.2);
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
        .login-btn {
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(45deg, #ff512f, #dd2476);
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s ease;
        }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }
        .signup-text {
          margin-top: 20px;
          text-align: center;
          font-size: 14px;
        }
        .signup-text a {
          color: #000;
          font-weight: bold;
          text-decoration: none;
        }
        .signup-text a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
