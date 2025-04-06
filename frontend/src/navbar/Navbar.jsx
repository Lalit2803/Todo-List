import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Navbar.css"; // Make sure this file exists

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:9000/lps/user/currentuser", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const json = await res.json();
          setUser(json.user);
          console.log(json.user)
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:9000/lps/user/logout", {
        method: "GET",
        credentials: "include",
      });

      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/todopage">Todos</Link>
          <Link to="/admin">Admin</Link>
        </div>

        {user ? (
          <div className="user-info">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="avatar"
            />
            <span>{user.name}</span>
            <button onClick={handleLogout}>Logout</button>
            <Link to="/update" className="update">Update</Link>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </nav>

      <Outlet />
    </>
  );
}
