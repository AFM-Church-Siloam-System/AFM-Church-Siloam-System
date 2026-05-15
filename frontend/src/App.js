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
      .then((data) => setMembers(data))
      .catch((err) => console.log(err));

    fetch(`${API}/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.log(err));

    fetch(`${API}/attendance`)
      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.log(err));

    fetch(`${API}/finances`)
      .then((res) => res.json())
      .then((data) => setFinances(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>AFM Church</h2>

        <ul>
          <li>Dashboard</li>
          <li>Members</li>
          <li>Events</li>
          <li>Attendance</li>
          <li>Finances</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <h1>AFM Church Siloam System</h1>
        </header>

        <div className="cards">
          <div className="card">
            <h3>Total Members</h3>
            <p>{members.length}</p>
          </div>

          <div className="card">
            <h3>Total Events</h3>
            <p>{events.length}</p>
          </div>

          <div className="card">
            <h3>Attendance Records</h3>
            <p>{attendance.length}</p>
          </div>

          <div className="card">
            <h3>Total Finances</h3>
            <p>{finances.length}</p>
          </div>
        </div>

        <div className="section">
          <h2>Members</h2>

          <div className="table-container">
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
        </div>

        <div className="section">
          <h2>Finances</h2>

          <div className="table-container">
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
        </div>
      </main>
    </div>
  );
}

export default App;