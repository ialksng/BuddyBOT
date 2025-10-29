import "./Auth.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:3000/api/auth/signup", {
        username,
        email,
        password,
      });
      localStorage.setItem("token", data.token);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  const handleGoogle = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
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
        <h2>Create an Account ✨</h2>
        <p className="auth-subtext">Join BuddyBOT and start chatting smarter</p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <button type="submit">Sign Up</button>
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
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
