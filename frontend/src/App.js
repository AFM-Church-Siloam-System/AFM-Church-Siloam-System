import React, { useState, useEffect } from "react";

function App() {

  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const API_URL = "https://afm-backend.onrender.com";

  // GET MEMBERS
  const fetchMembers = async () => {

    try {

      const response = await fetch(
        `${API_URL}/members`
      );

      const data = await response.json();

      setMembers(data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchMembers();

  }, []);

  // ADD MEMBER
  const addMember = async () => {

    try {

      const response = await fetch(
        `${API_URL}/members`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: name,
            phone: phone
          })
        }
      );

      const data = await response.json();

      alert(data.message);

      setName("");
      setPhone("");

      fetchMembers();

    } catch (error) {

      console.log(error);

      alert("Error adding member");

    }

  };

  return (

    <div style={{ padding: "20px" }}>

      <h1>AFM Church Siloam System</h1>

      <input
        type="text"
        placeholder="Member Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={addMember}>
        Add Member
      </button>

      <h2>Church Members</h2>

      {members.length === 0 ? (

        <p>No members found.</p>

      ) : (

        <ul>

          {members.map((member) => (

            <li key={member.id}>
              {member.name} - {member.phone}
            </li>

          ))}

        </ul>

      )}

    </div>

  );

}

export default App;