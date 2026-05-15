import logo from "./images/logo.png";
import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";

function App() {

  // LOGIN STATE

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  // DATA STATES

  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [finances, setFinances] = useState([]);

  // FORM STATES

  const [newMember, setNewMember] = useState("");
  const [newEvent, setNewEvent] = useState("");
  const [newFinance, setNewFinance] = useState("");
  const [newAttendance, setNewAttendance] =
    useState("");

  const API = "https://afm-backend.onrender.com";

  // LOAD DATA

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {

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
  };

  // ================= MEMBERS =================

  const addMember = async () => {

    if (!newMember) return;

    await fetch(`${API}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newMember,
      }),
    });

    setNewMember("");
    loadData();
  };

  const deleteMember = async (id) => {

    await fetch(`${API}/members/${id}`, {
      method: "DELETE",
    });

    loadData();
  };

  // ================= EVENTS =================

  const addEvent = async () => {

    if (!newEvent) return;

    await fetch(`${API}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newEvent,
      }),
    });

    setNewEvent("");
    loadData();
  };

  const deleteEvent = async (id) => {

    await fetch(`${API}/events/${id}`, {
      method: "DELETE",
    });

    loadData();
  };

  // ================= FINANCES =================

  const addFinance = async () => {

    if (!newFinance) return;

    await fetch(`${API}/finances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: newFinance,
      }),
    });

    setNewFinance("");
    loadData();
  };

  const deleteFinance = async (id) => {

    await fetch(`${API}/finances/${id}`, {
      method: "DELETE",
    });

    loadData();
  };

  // ================= ATTENDANCE =================

  const addAttendance = async () => {

    if (!newAttendance) return;

    await fetch(`${API}/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        member_name: newAttendance,
      }),
    });

    setNewAttendance("");
    loadData();
  };

  const deleteAttendance = async (id) => {

    await fetch(`${API}/attendance/${id}`, {
      method: "DELETE",
    });

    loadData();
  };

  // ================= LOGIN CHECK =================

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={() => setIsLoggedIn(true)}
      />
    );
  }

  // ================= DASHBOARD =================

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo-section">

          <img
            src={logo}
            alt="Church Logo"
            className="logo"
          />

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

          <div className="admin-box">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <h4>Administrator</h4>
              <p>Admin Access</p>
            </div>

          </div>

        </div>

        {/* DASHBOARD CARDS */}

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

        {/* ADD MEMBER */}

        <div className="form-section">

          <h2>Add Member</h2>

          <div className="member-form">

            <input
              type="text"
              placeholder="Enter member name"
              value={newMember}
              onChange={(e) =>
                setNewMember(e.target.value)
              }
            />

            <button onClick={addMember}>
              Add Member
            </button>

          </div>

        </div>

        {/* MEMBERS TABLE */}

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
                      onClick={() =>
                        deleteMember(member.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ADD EVENT */}

        <div className="form-section">

          <h2>Add Event</h2>

          <div className="member-form">

            <input
              type="text"
              placeholder="Enter event name"
              value={newEvent}
              onChange={(e) =>
                setNewEvent(e.target.value)
              }
            />

            <button onClick={addEvent}>
              Add Event
            </button>

          </div>

        </div>

        {/* EVENTS TABLE */}

        <div className="table-section">

          <h2>Events</h2>

          <table>

            <thead>
              <tr>
                <th>Event</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {events.map((event) => (

                <tr key={event.id}>

                  <td>{event.title}</td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteEvent(event.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ADD FINANCE */}

        <div className="form-section">

          <h2>Add Finance Record</h2>

          <div className="member-form">

            <input
              type="number"
              placeholder="Enter amount"
              value={newFinance}
              onChange={(e) =>
                setNewFinance(e.target.value)
              }
            />

            <button onClick={addFinance}>
              Add Finance
            </button>

          </div>

        </div>

        {/* FINANCE TABLE */}

        <div className="table-section">

          <h2>Finance Records</h2>

          <table>

            <thead>
              <tr>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {finances.map((finance) => (

                <tr key={finance.id}>

                  <td>N$ {finance.amount}</td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteFinance(finance.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ADD ATTENDANCE */}

        <div className="form-section">

          <h2>Mark Attendance</h2>

          <div className="member-form">

            <input
              type="text"
              placeholder="Enter member name"
              value={newAttendance}
              onChange={(e) =>
                setNewAttendance(e.target.value)
              }
            />

            <button onClick={addAttendance}>
              Add Attendance
            </button>

          </div>

        </div>

        {/* ATTENDANCE TABLE */}

        <div className="table-section">

          <h2>Attendance Records</h2>

          <table>

            <thead>
              <tr>
                <th>Member Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {attendance.map((record) => (

                <tr key={record.id}>

                  <td>{record.member_name}</td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteAttendance(record.id)
                      }
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