import { Link } from "react-router-dom";
import "../styles/HomePage.css";

export default function AuthOptions() {
  return (
    <div className="auth-options">
      <header className="app-header">TodoApp</header>
      <div className="auth-card">
        <h2>Welcome</h2>
        <Link to="/signup" className="auth-button">Sign Up</Link>
        <Link to="/login" className="auth-button">Login</Link>
        <Link to="/admin" className="auth-button">Admin</Link>
      </div>
    </div>
  );
}
