import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MapPage from "./pages/MapPage";
import About from "./pages/About";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// ─── Token validator ───────────────────────────────────────────────────────────
// Decodes the JWT payload client-side (no signature verification — that's the
// backend's job). We only check:
//   1. Token exists in localStorage
//   2. It has a valid JWT structure (3 base64 parts)
//   3. The `exp` claim hasn't passed yet
//
// If any check fails, the stale token is removed and the user is sent to login.
function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // JWT structure: header.payload.signature
    const payload = JSON.parse(atob(token.split(".")[1]));

    // exp is in seconds, Date.now() is in milliseconds
    if (!payload.exp || Date.now() >= payload.exp * 1000) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }

    return true;
  } catch {
    // Malformed token — remove it
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return false;
  }
}

// ─── ProtectedRoute ────────────────────────────────────────────────────────────
// Single place to control access to all protected pages.
// Revalidates the token on every navigation, not just on first render.
function ProtectedRoute({ children }) {
  return isTokenValid() ? children : <Navigate to="/login" replace />;
}

// ─── App ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isTokenValid() ? (
            <Navigate to="/map" replace />
          ) : (
            <Navigate to="/landing" replace />
          )
        }
      />

      {/* Public routes */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />

      {/* Protected routes — all go through ProtectedRoute */}
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
