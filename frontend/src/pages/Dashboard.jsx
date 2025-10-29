import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="dashboard-logo">BuddyBOT</div>
        <div className="nav-actions">
          <a href="/login" className="nav-btn">Login</a>
          <a href="/signup" className="nav-btn signup">Sign Up</a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-main">
        <h1>Meet BuddyBOT 🤖</h1>
        <p>
          Your intelligent chatbot companion that helps you with conversations, answers,
          and insights — built with the power of AI and the MERN stack.
        </p>
        <a href="/signup" className="get-started-btn">Get Started</a>
      </div>
    </div>
  );
}
