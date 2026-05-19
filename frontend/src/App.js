import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import Finances from "./pages/Finances";
import Settings from "./pages/Settings";
import Users from "./pages/Users";

import "./App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {

  // ================= BACKEND URL =================

  const API =
    "https://afm-backend.onrender.com";

  // ================= LOGIN =================

  const [loggedIn, setLoggedIn] =
    useState(

      localStorage.getItem(
        "loggedIn"
      ) === "true"

    );

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  // ================= ROLE =================

  const [role, setRole] =
    useState(

      localStorage.getItem(
        "role"
      ) || ""

    );

  // ================= DARK MODE =================

  const [darkMode, setDarkMode] =
    useState(false);

  // ================= MEMBERS =================

  const [members, setMembers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [photo, setPhoto] =
    useState("");

  // ================= ATTENDANCE =================

  const [attendance, setAttendance] =
    useState([]);

  // ================= FINANCES =================

  const [finances, setFinances] =
    useState([]);

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] =
    useState("");

  // ================= USERS =================

  const [users, setUsers] =
    useState([]);

  const [usernameInput,
  setUsernameInput] =
    useState("");

  const [passwordInput,
  setPasswordInput] =
    useState("");

  const [roleInput,
  setRoleInput] =
    useState("");

  // ================= LOGIN =================

  const handleLogin = async () => {

    try {

      const response =
        await axios.post(
          `${API}/login`,
          {
            username,
            password
          }
        );

      if (
        response.data.success
      ) {

        setLoggedIn(true);

        setRole(
          response.data.role
        );

        localStorage.setItem(
          "loggedIn",
          "true"
        );

        localStorage.setItem(
          "role",
          response.data.role
        );

      } else {

        alert(
          response.data.message
        );

      }

    } catch (error) {

      console.log(error);

      alert(
        "Backend connection failed"
      );

    }

  };

  // ================= LOGOUT =================

  const logout = () => {

    setLoggedIn(false);

    setRole("");

    localStorage.removeItem(
      "loggedIn"
    );

    localStorage.removeItem(
      "role"
    );

  };

  // ================= FETCH MEMBERS =================

  const fetchMembers = async () => {

    try {

      const response =
        await axios.get(
          `${API}/members`
        );

      setMembers(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  // ================= FETCH ATTENDANCE =================

  const fetchAttendance = async () => {

    try {

      const response =
        await axios.get(
          `${API}/attendance`
        );

      setAttendance(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  // ================= FETCH USERS =================

  const fetchUsers = async () => {

    try {

      const response =
        await axios.get(
          `${API}/users`
        );

      setUsers(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  // ================= FETCH FINANCES =================

  const fetchFinances = async () => {

    try {

      const response =
        await axios.get(
          `${API}/finances`
        );

      setFinances(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  // ================= AUTO LOGOUT =================

  useEffect(() => {

    if (loggedIn) {

      fetchMembers();

      fetchAttendance();

      fetchFinances();

      fetchUsers();

      // AUTO LOGOUT AFTER 30 MINUTES

      const timer = setTimeout(() => {

        alert(
          "Session expired. Please login again."
        );

        logout();

      }, 1800000);

      return () => clearTimeout(timer);

    }

  }, [loggedIn]);

  // ================= ADD MEMBER =================

  const addMember = async () => {

    if (
      !name ||
      !phone ||
      !department
    ) {

      alert("Fill all fields");

      return;

    }

    try {

      await axios.post(
        `${API}/add_member`,
        {
          name,
          phone,
          department,
          photo
        }
      );

      setName("");
      setPhone("");
      setDepartment("");
      setPhoto("");

      fetchMembers();

    } catch (error) {

      console.log(error);

    }

  };

  // ================= DELETE MEMBER =================

  const deleteMember = async (id) => {

    try {

      await axios.delete(
        `${API}/delete_member/${id}`
      );

      fetchMembers();

    } catch (error) {

      console.log(error);

    }

  };

  // ================= ATTENDANCE =================

  const markAttendance = async (
    memberName
  ) => {

    const today =
      new Date().toLocaleDateString();

    try {

      await axios.post(
        `${API}/add_attendance`,
        {
          member_name: memberName,
          date: today
        }
      );

      fetchAttendance();

    } catch (error) {

      console.log(error);

    }

  };

  // ================= FINANCES =================

  const addFinance = async () => {

    if (!description || !amount) {

      alert("Fill all fields");

      return;

    }

    try {

      await axios.post(
        `${API}/add_finance`,
        {
          description,
          amount
        }
      );

      setDescription("");
      setAmount("");

      fetchFinances();

    } catch (error) {

      console.log(error);

    }

  };

  // ================= ADD USER =================

  const addUser = async () => {

    if (
      !usernameInput ||
      !passwordInput ||
      !roleInput
    ) {

      alert(
        "Fill all fields"
      );

      return;

    }

    try {

      await axios.post(
        `${API}/add_user`,
        {

          username:
            usernameInput,

          password:
            passwordInput,

          role:
            roleInput

        }
      );

      setUsernameInput("");
      setPasswordInput("");
      setRoleInput("");

      fetchUsers();

    } catch (error) {

      console.log(error);

    }

  };

  // ================= DELETE USER =================

  const deleteUser = async (
    id
  ) => {

    try {

      await axios.delete(
        `${API}/delete_user/${id}`
      );

      fetchUsers();

    } catch (error) {

      console.log(error);

    }

  };

  // ================= TOTAL FINANCE =================

  const totalFinance =
    finances.reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );

  // ================= SEARCH =================

  const filteredMembers =
    members.filter((member) =>
      member.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // ================= PDF EXPORT =================

  const exportMembersPDF = () => {

    const doc = new jsPDF();

    doc.text(
      "AFM Church Members",
      14,
      20
    );

    autoTable(doc, {
      startY: 30,
      head: [[
        "Name",
        "Phone",
        "Department"
      ]],
      body: members.map((member) => [
        member.name,
        member.phone,
        member.department
      ])
    });

    doc.save("members.pdf");

  };

  // ================= CHART =================

  const chartData = {

    labels: [
      "Members",
      "Attendance",
      "Finances"
    ],

    datasets: [

      {
        label: "Church Analytics",

        data: [
          members.length,
          attendance.length,
          totalFinance
        ],

        backgroundColor: [
          "#0b57d0",
          "#28a745",
          "#ffc107"
        ]
      }

    ]

  };

  // ================= LOGIN PAGE =================

  if (!loggedIn) {

    return (

      <div className="login-container">

        <div className="login-box">

          <h2>
            AFM Church Login
          </h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button
            onClick={handleLogin}
          >
            Login
          </button>

        </div>

      </div>

    );

  }

  // ================= MAIN APP =================

  return (

    <BrowserRouter>

      <div
        className={
          darkMode
            ? "app dark"
            : "app"
        }
      >

        {/* SIDEBAR */}

        <div className="sidebar">

          <h2>
            AFM Church
          </h2>

          <ul>

            <li>

              <NavLink to="/">
                🏠 Dashboard
              </NavLink>

            </li>

            <li>

              <NavLink to="/members">
                👥 Members
              </NavLink>

            </li>

            <li>

              <NavLink to="/attendance">
                📅 Attendance
              </NavLink>

            </li>

            {
              role !== "Secretary" && (

                <li>

                  <NavLink to="/finances">
                    💰 Finances
                  </NavLink>

                </li>

              )
            }

            {
              role === "Admin" && (

                <li>

                  <NavLink to="/users">
                    👤 Users
                  </NavLink>

                </li>

              )
            }

            <li>

              <NavLink to="/settings">
                ⚙️ Settings
              </NavLink>

            </li>

          </ul>

        </div>

        {/* MAIN CONTENT */}

        <div className="main-content">

          <div className="header">

            <img
              src="/logo.png"
              alt="Church Logo"
              className="church-logo"
            />

            <div>

              <h1>
                AFM Church Siloam
              </h1>

              <p>
                {role} Dashboard
              </p>

            </div>

          </div>

          <Routes>

            <Route
              path="/"
              element={
                <Dashboard
                  members={members}
                  attendance={attendance}
                  totalFinance={totalFinance}
                  chartData={chartData}
                />
              }
            />

            <Route
              path="/members"
              element={
                <Members
                  search={search}
                  setSearch={setSearch}
                  exportMembersPDF={exportMembersPDF}
                  name={name}
                  setName={setName}
                  phone={phone}
                  setPhone={setPhone}
                  department={department}
                  setDepartment={setDepartment}
                  photo={photo}
                  setPhoto={setPhoto}
                  addMember={addMember}
                  filteredMembers={filteredMembers}
                  markAttendance={markAttendance}
                  deleteMember={deleteMember}
                />
              }
            />

            <Route
              path="/attendance"
              element={
                <Attendance
                  attendance={attendance}
                />
              }
            />

            {
              role !== "Secretary" && (

                <Route
                  path="/finances"
                  element={
                    <Finances
                      description={description}
                      setDescription={setDescription}
                      amount={amount}
                      setAmount={setAmount}
                      addFinance={addFinance}
                      finances={finances}
                      totalFinance={totalFinance}
                    />
                  }
                />

              )
            }

            {
              role === "Admin" && (

                <Route
                  path="/users"
                  element={
                    <Users

                      users={users}

                      usernameInput={
                        usernameInput
                      }

                      setUsernameInput={
                        setUsernameInput
                      }

                      passwordInput={
                        passwordInput
                      }

                      setPasswordInput={
                        setPasswordInput
                      }

                      roleInput={
                        roleInput
                      }

                      setRoleInput={
                        setRoleInput
                      }

                      addUser={addUser}

                      deleteUser={
                        deleteUser
                      }

                    />
                  }
                />

              )
            }

            <Route
              path="/settings"
              element={
                <Settings
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  logout={logout}
                />
              }
            />

          </Routes>

        </div>

      </div>

    </BrowserRouter>

  );

}

export default App;