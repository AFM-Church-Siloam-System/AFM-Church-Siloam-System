import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./App.css";

function App() {

  // =========================
  // LOGIN
  // =========================

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // =========================
  // MEMBERS
  // =========================

  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [memberData, setMemberData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    role: "",
    photo: "",
  });

  // =========================
  // FINANCES
  // =========================

  const [finances, setFinances] = useState([]);

  const [financeData, setFinanceData] = useState({
    member: "",
    amount: "",
    type: "",
  });

  // =========================
  // ATTENDANCE
  // =========================

  const [attendance, setAttendance] = useState([]);

  // =========================
  // EVENTS
  // =========================

  const [events, setEvents] = useState([]);

  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    venue: "",
  });

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

   https://afm-backend.onrender.com
      .then((res) => res.json())
      .then((data) => setMembers(data));

    https://afm-backend.onrender.com
      .then((res) => res.json())
      .then((data) => setFinances(data));

    https://afm-backend.onrender.com
      .then((res) => res.json())
      .then((data) => setAttendance(data));

    https://afm-backend.onrender.com
      .then((res) => res.json())
      .then((data) => setEvents(data));

  }, []);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async () => {

    const response = await fetch(
      https://afm-backend.onrender.com
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      }
    );

    const data = await response.json();

    if (data.success === true) {

      localStorage.setItem("loggedIn", "true");
      setLoggedIn(true);

    } else {

      alert("Invalid login");

    }

  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    localStorage.removeItem("loggedIn");
    setLoggedIn(false);

  };

  // =========================
  // BACKUP DATABASE
  // =========================

  const backupDatabase = () => {

    window.open(
      https://afm-backend.onrender.com
      "_blank"
    );

  };

  // =========================
  // ADD MEMBER
  // =========================

  const addMember = async () => {

    if (
      !memberData.name ||
      !memberData.surname ||
      !memberData.phone
    ) {
      alert("Fill required fields");
      return;
    }

    if (editingId) {

      const response = await fetch(
        https://afm-backend.onrender.com
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(memberData),
        }
      );

      const updatedMember = await response.json();

      const updatedMembers = members.map((member) =>
        member.id === editingId
          ? updatedMember
          : member
      );

      setMembers(updatedMembers);

      setEditingId(null);

    } else {

      const response = await fetch(
        https://afm-backend.onrender.com
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(memberData),
        }
      );

      const data = await response.json();

      setMembers([...members, data]);

    }

    setMemberData({
      name: "",
      surname: "",
      phone: "",
      email: "",
      role: "",
      photo: "",
    });

  };

  // =========================
  // DELETE MEMBER
  // =========================

  const deleteMember = async (id) => {

    await fetch(
      https://afm-backend.onrender.com
      {
        method: "DELETE",
      }
    );

    const updatedMembers = members.filter(
      (member) => member.id !== id
    );

    setMembers(updatedMembers);

  };

  // =========================
  // ATTENDANCE
  // =========================

  const markAttendance = async (memberName) => {

    const response = await fetch(
      https://afm-backend.onrender.com
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_name: memberName,
        }),
      }
    );

    const data = await response.json();

    setAttendance([...attendance, data]);

  };

  // =========================
  // ADD FINANCE
  // =========================

  const addFinance = async () => {

    const response = await fetch(
      https://afm-backend.onrender.com
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(financeData),
      }
    );

    const data = await response.json();

    setFinances([...finances, data]);

    setFinanceData({
      member: "",
      amount: "",
      type: "",
    });

  };

  // =========================
  // ADD EVENT
  // =========================

  const addEvent = async () => {

    const response = await fetch(
      "https://afm-backend.onrender.com
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      }
    );

    const data = await response.json();

    setEvents([...events, data]);

    setEventData({
      title: "",
      date: "",
      venue: "",
    });

  };

  // =========================
  // EXPORT MEMBERS PDF
  // =========================

  const exportMembersPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "AFM Church Siloam Members Report",
      14,
      20
    );

    autoTable(doc, {
      startY: 30,
      head: [[
        "Name",
        "Surname",
        "Phone",
        "Email",
        "Role"
      ]],
      body: members.map((member) => [
        member.name,
        member.surname,
        member.phone,
        member.email,
        member.role,
      ]),
    });

    doc.save("AFM_Members_Report.pdf");

  };

  // =========================
  // MEMBER ID CARD
  // =========================

  const generateMemberCard = (member) => {

    const doc = new jsPDF();

    doc.rect(10, 10, 85, 55);

    doc.setFontSize(16);

    doc.text(
      "AFM Church Siloam",
      18,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Name: ${member.name} ${member.surname}`,
      18,
      32
    );

    doc.text(
      `Phone: ${member.phone}`,
      18,
      40
    );

    doc.text(
      `Role: ${member.role}`,
      18,
      48
    );

    doc.save(
      `${member.name}_ID_Card.pdf`
    );

  };

  // =========================
  // TOTALS
  // =========================

  const totalFinance = finances.reduce(
    (total, item) =>
      total + Number(item.amount || 0),
    0
  );

  // =========================
  // CHART DATA
  // =========================

  const chartData = [

    {
      name: "Members",
      total: members.length,
    },

    {
      name: "Attendance",
      total: attendance.length,
    },

    {
      name: "Finances",
      total: totalFinance,
    },

  ];

  // =========================
  // SEARCH
  // =========================

  const filteredMembers = members.filter((member) =>
    (
      member.name +
      " " +
      member.surname +
      " " +
      member.role
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =========================
  // LOGIN PAGE
  // =========================

  if (!loggedIn) {

    return (

      <div className="login-container">

        <div className="login-box">

          <img
            src="/logo.png"
            alt="logo"
            className="login-logo"
          />

          <h1>AFM Church Siloam</h1>

          <p>Church Management Login</p>

          <input
            type="text"
            placeholder="Username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                username: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({
                ...loginData,
                password: e.target.value,
              })
            }
          />

          <button onClick={handleLogin}>
            Login
          </button>

        </div>

      </div>

    );

  }

  // =========================
  // DASHBOARD
  // =========================

  return (

    <div className="container">

      <div className="header">

        <div className="header-left">

          <img
            src="/logo.png"
            alt="logo"
            className="logo"
          />

          <div>
            <h1>AFM Church Siloam</h1>
            <p>Church Management System</p>
          </div>

        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >

          <button onClick={backupDatabase}>
            Backup
          </button>

          <button onClick={logout}>
            Logout
          </button>

        </div>

      </div>

      <h2>Dashboard</h2>

      {/* CARDS */}

      <div className="cards">

        <div className="card">
          <h3>Total Members</h3>
          <h1>{members.length}</h1>
        </div>

        <div className="card">
          <h3>Total Attendance</h3>
          <h1>{attendance.length}</h1>
        </div>

        <div className="card">
          <h3>Total Finances</h3>
          <h1>N${totalFinance}</h1>
        </div>

      </div>

      {/* ANALYTICS */}

      <div className="section">

        <h2>Church Analytics</h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="total"
              fill="#1976d2"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* ADD MEMBER */}

      <div className="section">

        <h2>Add Member</h2>

        <div className="form-grid">

          <input
            type="text"
            placeholder="Name"
            value={memberData.name}
            onChange={(e) =>
              setMemberData({
                ...memberData,
                name: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Surname"
            value={memberData.surname}
            onChange={(e) =>
              setMemberData({
                ...memberData,
                surname: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Phone"
            value={memberData.phone}
            onChange={(e) =>
              setMemberData({
                ...memberData,
                phone: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={memberData.email}
            onChange={(e) =>
              setMemberData({
                ...memberData,
                email: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Role"
            value={memberData.role}
            onChange={(e) =>
              setMemberData({
                ...memberData,
                role: e.target.value,
              })
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {

              const file = e.target.files[0];

              if (file) {

                const reader = new FileReader();

                reader.onloadend = () => {

                  setMemberData({
                    ...memberData,
                    photo: reader.result,
                  });

                };

                reader.readAsDataURL(file);

              }

            }}
          />

        </div>

        <button onClick={addMember}>
          {editingId ? "Update Member" : "Add Member"}
        </button>

      </div>

      {/* MEMBERS */}

      <div className="section">

        <h2>Members List</h2>

        <button
          onClick={exportMembersPDF}
          style={{
            marginBottom: "20px",
          }}
        >
          Export Members PDF
        </button>

        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            boxSizing: "border-box",
          }}
        />

        <table>

          <thead>

            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Role</th>
              <th>Attendance</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>ID Card</th>
            </tr>

          </thead>

          <tbody>

            {filteredMembers.map((member) => (

              <tr key={member.id}>

                <td>

                  {member.photo ? (

                    <img
                      src={member.photo}
                      alt="member"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />

                  ) : (
                    "No Photo"
                  )}

                </td>

                <td>{member.name}</td>
                <td>{member.surname}</td>
                <td>{member.phone}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>

                <td>

                  <button
                    onClick={() =>
                      markAttendance(
                        member.name +
                        " " +
                        member.surname
                      )
                    }
                  >
                    Present
                  </button>

                </td>

                <td>

                  <button
                    onClick={() => {

                      setMemberData({
                        name: member.name,
                        surname: member.surname,
                        phone: member.phone,
                        email: member.email,
                        role: member.role,
                        photo: member.photo,
                      });

                      setEditingId(member.id);

                    }}
                  >
                    Edit
                  </button>

                </td>

                <td>

                  <button
                    style={{
                      background: "red",
                    }}
                    onClick={() =>
                      deleteMember(member.id)
                    }
                  >
                    Delete
                  </button>

                </td>

                <td>

                  <button
                    onClick={() =>
                      generateMemberCard(member)
                    }
                  >
                    ID Card
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* EVENTS */}

      <div className="section">

        <h2>Church Events</h2>

        <div className="form-grid">

          <input
            type="text"
            placeholder="Event Title"
            value={eventData.title}
            onChange={(e) =>
              setEventData({
                ...eventData,
                title: e.target.value,
              })
            }
          />

          <input
            type="date"
            value={eventData.date}
            onChange={(e) =>
              setEventData({
                ...eventData,
                date: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Venue"
            value={eventData.venue}
            onChange={(e) =>
              setEventData({
                ...eventData,
                venue: e.target.value,
              })
            }
          />

        </div>

        <button onClick={addEvent}>
          Add Event
        </button>

        <table>

          <thead>

            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Venue</th>
            </tr>

          </thead>

          <tbody>

            {events.map((event) => (

              <tr key={event.id}>

                <td>{event.title}</td>
                <td>{event.date}</td>
                <td>{event.venue}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default App;