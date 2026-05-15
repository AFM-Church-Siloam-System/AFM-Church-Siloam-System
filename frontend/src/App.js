import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./images/logo.png";

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
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-section">
          <img src={logo} alt="Church Logo" className="logo" />
          <h2>AFM Church</h2>
        </div>

        <ul className="menu">
          <li>Dashboard</li>
          <li>Members</li>
          <li>Events</li>
          <li>Attendance</li>
          <li>Finances</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Topbar */}
        <div className="topbar">
          <div>
            <h1>AFM Church Siloam System</h1>
            <p>Church Management Dashboard</p>
          </div>

          <div className="admin-box">
            <div className="admin-avatar">A</div>

            <div>
              <strong>Administrator</strong>
              <p>Admin Access</p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="cards">

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

        {/* Add Member Form */}
        <div className="form-section">
          <h2>Add Member</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();

              fetch(`${API}/members`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: e.target.name.value,
                }),
              })
                .then((res) => res.json())
                .then((newMember) => {
                  setMembers([...members, newMember]);
                  e.target.reset();
                });
            }}
          >
            <input
              type="text"
              name="name"
              placeholder="Enter member name"
              required
            />

            <button type="submit">
              Add Member
            </button>
          </form>
        </div>

        {/* Members Table */}
        <div className="table-section">
          <h2>Members</h2>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member) => (
                <tr key={member.id}>

                  <td>{member.name}</td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        fetch(`${API}/members/${member.id}`, {
                          method: "DELETE",
                        }).then(() => {
                          setMembers(
                            members.filter(
                              (m) => m.id !== member.id
                            )
                          );
                        });
                      }}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

export default App;