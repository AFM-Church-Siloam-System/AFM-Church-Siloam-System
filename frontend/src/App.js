import logo from "./images/logo.png";
import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [finances, setFinances] = useState([]);

  const API = "https://afm-backend.onrender.com";

  useEffect(() => {
    fetch(`${API}/members`)
      .then((res) => res.json())
      .then((data) => setMembers(data));

    fetch(`${API}/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data));

    fetch(`${API}/attendance`)
      .then((res) => res.json())
      .then((data) => setAttendance(data));

    fetch(`${API}/finances`)
      .then((res) => res.json())
      .then((data) => setFinances(data));
  }, []);

return (
  <div className="app">

    {/* SIDEBAR */}
    <aside className="sidebar">

      <div className="logo-section">
        <img src={logo} alt="Church Logo" className="logo" />
        <h2>AFM Church</h2>
      </div>

      <ul>
        <li>Dashboard</li>
        <li>Members</li>
        <li>Events</li>
        <li>Attendance</li>
        <li>Finances</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>

    </aside>

    {/* MAIN CONTENT */}
    <main className="main-content">

      {/* TOPBAR */}
      <div className="topbar">
        <div>
          <h1>AFM Church Siloam System</h1>
          <p>Church Management Dashboard</p>
        </div>

        <button className="admin-box">
          Administrator
        </button>
      </div>

      {/* STATS */}
      <div className="stats">

        <div className="card">
          <h3>Total Members</h3>
          <h2>{members.length}</h2>
        </div>

        <div className="card">
          <h3>Total Events</h3>
          <h2>{events.length}</h2>
        </div>

        <div className="card">
          <h3>Attendance Records</h3>
          <h2>{attendance.length}</h2>
        </div>

        <div className="card">
          <h3>Total Finances</h3>
          <h2>{finances.length}</h2>
        </div>

      </div>

      {/* MEMBERS TABLE */}
      <div className="section">
        <h2>Members</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member, index) => (
              <tr key={index}>
                <td>{member.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FINANCES TABLE */}
      <div className="section">
        <h2>Finances</h2>

        <table>
          <thead>
            <tr>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {finances.map((finance, index) => (
              <tr key={index}>
                <td>{finance.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </main>

  </div>
);
   