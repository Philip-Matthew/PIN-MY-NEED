// App.js — UPDATED (drop-in replacement)
// Added: /landing, /dashboard, /profile routes

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MapPage from "./pages/MapPage";
import About from "./pages/About";
import Landing from "./pages/Landing"; // NEW
import Dashboard from "./pages/Dashboard"; // NEW
import Profile from "./pages/Profile"; // NEW

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      {/* Root: logged in → map, else → landing page */}
      <Route
        path="/"
        element={token ? <Navigate to="/map" /> : <Navigate to="/landing" />}
      />
      {/* Public routes */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      {/* Protected routes */}
      <Route
        path="/map"
        element={token ? <MapPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />{" "}
      {/* NEW */}
      <Route
        path="/profile"
        element={token ? <Profile /> : <Navigate to="/login" />}
      />{" "}
      {/* NEW */}
    </Routes>
  );
}

export default App;
