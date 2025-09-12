import React, { useEffect, useState } from "react";
import API from "./api";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // get JWT from localStorage
        const res = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}

export default Profile;
