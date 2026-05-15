# Modern AFM Church Siloam Dashboard

Replace your current `frontend/src/App.js` with the code below.

```javascript
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [finances, setFinances] = useState([]);

  useEffect(() => {
    fetch("https://afm-backend.onrender.com/members")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("https://afm-backend.onrender.com/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("https://afm-backend.onrender.com/attendance")
      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch("https://afm-backend.onrender.com/finances")
      .then((res) => res.json())
      .then((data) => setFinances(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f7fb" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#1e293b",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "40px" }}>AFM Siloam</h2>

        <div style={{ marginBottom: "20px" }}>🏠 Dashboard</div>
        <div style={{ marginBottom: "20px" }}>👥 Members</div>
        <div style={{ marginBottom: "20px" }}>📅 Events</div>
        <div style={{ marginBottom: "20px" }}>✅ Attendance</div>
        <div style={{ marginBottom: "20px" }}>💰 Finances</div>
        <div style={{ marginBottom: "20px" }}>📊 Reports</div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        <h1 style={{ marginBottom: "30px", color: "#1e293b" }}>
          AFM Church Siloam Dashboard
        </h1>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Total Members</h3>
            <h1>{members.length}</h1>
          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Total Events</h3>
            <h1>{events.length}</h1>
          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Attendance Records</h3>
            <h1>{attendance.length}</h1>
          </div>

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Finance Records</h3>
            <h1>{finances.length}</h1>
          </div>
        </div>

        {/* Members Table */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <h2>Members</h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#e2e8f0" }}>
                <th style={{ padding: "12px" }}>Name</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    {member.name || "Member"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Events Table */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}
        >
          <h2>Events</h2>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#e2e8f0" }}>
                <th style={{ padding: "12px" }}>Event</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                    {event.name || "Event"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
```

After replacing the
