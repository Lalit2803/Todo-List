import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css"

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: null,
  });

  const [serverMessage, setServerMessage] = useState(""); // ✅ Store API response message
  const navigate = useNavigate();

 

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form data is :",formData)

    const data = new FormData();
  data.append("name", formData.name);
  data.append("email", formData.email);
  data.append("password", formData.password);
  data.append("profilePicture", formData.profilePicture); // this is the File object

  const response = await fetch("http://localhost:9000/lps/user/register", {
    method: "POST",
    body: data, // no need to stringify
  });

  const json = await response.json();
  setServerMessage(json.message);
  console.log(json.message)

  setFormData({
    name: "",
    email: "",
    password: "",
    profilePicture: null,
  });

  setTimeout(() => {
    navigate("/login");
  }, 5000);
  };

  return (
    <div className="container">
       {serverMessage && <span className="success-message">{serverMessage}</span>}
      <h2 className="title">Signup Form</h2>
     
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="input"
        />
        

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input"
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input"
        />
       

        <input
          type="file"
          name="profilePicture"
          onChange={handleChange}
          accept="image/*"
          className="input"
        />

        <button type="submit" className="button">
          Sign Up
        </button>
      </form>
    </div>
  );
}
