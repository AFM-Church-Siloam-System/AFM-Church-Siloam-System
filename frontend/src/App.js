import React, { useEffect, useState } from "react";

const API_URL = "https://afm-backend.onrender.com";

function App() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // LOAD MEMBERS
  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/members`);
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error loading members:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // ADD MEMBER
  const addMember = async () => {
    if (!name || !phone) {
      alert("Please enter name and phone");
      return;
    }

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

      if (!response.ok) {
        throw new Error("Failed to add member");
      }

      const data = await response.json();

      alert(data.message);

      setName("");
      setPhone("");

      fetchMembers();
    } catch (error) {
      console.error(error);
      alert("Error adding member");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
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