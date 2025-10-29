import "./Auth.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Use environment variable for backend URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="auth-container">
      <nav className="auth-navbar">
        <div className="dashboard-logo">BuddyBOT</div>
        <div className="nav-actions">
          <a href="/login" className="nav-btn">Login</a>
          <a href="/signup" className="nav-btn signup">Sign Up</a>
        </div>
      </nav>

      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p className="auth-subtext">Login to continue chatting with BuddyBOT</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit">Login</button>
        </form>

        <div className="divider">OR</div>

        <button className="google-btn" onClick={handleGoogle}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
          />
          Continue with Google
        </button>

        <p className="auth-footer">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
