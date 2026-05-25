import React, { useState, useEffect } from "react";

function App() {

  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // LOAD MEMBERS
  const loadMembers = () => {

    fetch("https://afm-backend.onrender.com/members")
      .then((res) => res.json())
      .then((data) => setMembers(data));

  };

  useEffect(() => {

    loadMembers();

  }, []);

  // ADD MEMBER
  const addMember = () => {

    fetch("https://afm-backend.onrender.com/members", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name: name,
        phone: phone
      })

    })
      .then((res) => res.json())
      .then(() => {

        alert("Member Added");

        setName("");
        setPhone("");

        loadMembers();

      })
      .catch(() => {

        alert("Error adding member");

      });

  };

  return (

    <div style={{ padding: 20 }}>

      <h1>AFM Church Siloam System</h1>

      <input
        placeholder="Member Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={addMember}>
        Add Member
      </button>

      <h2>Church Members</h2>

      {members.map((member) => (

        <p key={member.id}>
          {member.name} - {member.phone}
        </p>

      ))}

    </div>

  );

}

export default App;