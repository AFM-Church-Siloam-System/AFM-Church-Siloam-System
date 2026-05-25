import React, { useState, useEffect } from "react";

function App() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const API_URL = "https://afm-backend.onrender.com";

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/members`);
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.log("Error fetching members:", error);
    }
  };

  const addMember = async () => {
    if (!name || !phone) {
      alert("Please fill all fields");
      return;
    }

    try {
      await fetch(`${API_URL}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
        }),
      });

      setName("");
      setPhone("");
      fetchMembers();
    } catch (error) {
      console.log("Error adding member:", error);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>AFM Church Siloam System</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Member Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            width: "200px",
          }}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            width: "200px",
          }}
        />

        <button
          onClick={addMember}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
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