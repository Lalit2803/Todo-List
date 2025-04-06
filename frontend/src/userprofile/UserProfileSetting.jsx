import React, { useState } from "react";
import "./User.css"

const UserProfileSettings = ({userId}) => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
    totalNumberOfTask: 0,
  });

  const [newPassword, setNewPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState("");

  // Update profile (name, email, password, totalNumberOfTask)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:9000/lps/user/updateuserprofile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error("Profile update error:", err);
      setMessage("Failed to update profile");
    }
  };

  // Update password only
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:9000/lps/user/updatepassword/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      setMessage(data.message);
      setNewPassword("");
    } catch (err) {
      console.error("Password update error:", err);
      setMessage("Failed to update password");
    }
  };

  // Upload new profile picture
  const handleProfilePicUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);

    try {
      const res = await fetch("http://localhost:9000/lps/user/updateprofilepicture", {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message);
      setProfilePicture(null);
    } catch (err) {
      console.error("Profile pic update error:", err);
      setMessage("Failed to update profile picture");
    }
  };

  // Delete current profile picture
  const handleDeleteProfilePic = async () => {
    try {
      const res = await fetch(`http://localhost:9000/lps/user/deleteprofilepic`, {
        method: "PATCH",
        credentials: "include",
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error("Profile pic delete error:", err);
      setMessage("Failed to delete profile picture");
    }
  };

  return (
    <div className="profile-card">
      <h3>Update Profile Info</h3>
      <form onSubmit={handleProfileUpdate} className="profile-form">
        <input
          type="text"
          placeholder="Name"
          value={profileData.name}
          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={profileData.email}
          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Password (optional)"
          value={profileData.password}
          onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total Number of Tasks"
          value={profileData.totalNumberOfTask}
          onChange={(e) =>
            setProfileData({ ...profileData, totalNumberOfTask: e.target.value })
          }
        />
        <button type="submit">Update Profile</button>
      </form>

      <h3>Change Password</h3>
      <form onSubmit={handlePasswordUpdate} className="profile-form">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Update Password</button>
      </form>

      <h3>Update Profile Picture</h3>
      <form onSubmit={handleProfilePicUpdate} className="profile-form">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />
        <button type="submit">Upload New Picture</button>
      </form>

      <h3>Delete Profile Picture</h3>
      <div className="profile-form">
        <button onClick={handleDeleteProfilePic} style={{ backgroundColor: "#dc3545" }}>
          Delete Picture
        </button>
      </div>

      {message && <p className="info-message">{message}</p>}
    </div>
  );
};

export default UserProfileSettings;
