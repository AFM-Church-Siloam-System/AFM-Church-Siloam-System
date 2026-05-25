import React, { useEffect, useState } from "react";

const API_URL = "https://afm-backend.onrender.com";

function App() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/members`);
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const addMember = async () => {
    try {
      const response = await fetch(`${API_URL}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          phone: phone,
        }),
      });

      if (response.ok) {
        alert("Member added successfully");

        setName("");
        setPhone("");

        fetchMembers();
      } else {
        alert("Error adding member");
      }
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>AFM Church Siloam System</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Member Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px", padding: "10px" }}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ marginRight: "10px", padding: "10px" }}
        />

        <button onClick={addMember} style={{ padding: "10px" }}>
          Add Member
        </button>
      </div>

      <h2>Church Members</h2>

      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <ul>
          {members.map((member, index) => (
            <li key={index}>
              {member.name} - {member.phone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;