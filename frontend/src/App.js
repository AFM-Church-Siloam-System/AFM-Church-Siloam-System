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
    <div className="App">
      <h1>AFM Church Siloam System</h1>

      <h2>Members</h2>
      <ul>
        {members.map((member, index) => (
          <li key={index}>{member.name || "Member"}</li>
        ))}
      </ul>

      <h2>Events</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.name || "Event"}</li>
        ))}
      </ul>

      <h2>Attendance</h2>
      <ul>
        {attendance.map((item, index) => (
          <li key={index}>{item.name || "Attendance Record"}</li>
        ))}
      </ul>

      <h2>Finances</h2>
      <ul>
        {finances.map((finance, index) => (
          <li key={index}>{finance.amount || "Finance Record"}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;