import { useState } from "react";
import "../styles/Signup.css"
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [serverMessage, setServerMessage] = useState(""); // ✅ Store API response message
  const navigate = useNavigate();


  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 


  const handleLoginSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch("http://localhost:9000/lps/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ✅ Ensures cookies are included in requests
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });
  
      // ✅ Check if response is okay BEFORE parsing JSON
      if (!response.ok) {
        const errorText = await response.json(); // Read error response
        throw new Error(`Login failed: ${errorText.message}`);
      }
  
      const json = await response.json();
  
      if (json.success) {
        localStorage.setItem("token", json.token); // ✅ Store token if needed
        console.log("Auth Token:", localStorage.getItem("token"));
  
        setServerMessage(json.message || "Login successful!");
  
        // ✅ Navigate after 2 seconds
        setTimeout(() => {
          navigate("/todopage");
        }, 2000);
      } else {
        setServerMessage(json.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setServerMessage(error.message || "Something went wrong. Please try again.");
    }
  };
  
  return (
    <div className="container">
      {serverMessage && <span className="success-message">{serverMessage}</span>}
      <h2 className="title">Login Form</h2>
      <form onSubmit={handleLoginSubmit} className="form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleLoginChange}
          required
          className="input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleLoginChange}
          required
          className="input"
        />
       
        <button type="submit" className="button">
          Login
        </button>
      </form>
    </div>
  );
}
