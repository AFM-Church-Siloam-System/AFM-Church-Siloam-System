import React, {
  useState,
  useEffect
} from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate
} from "react-router-dom";

import axios from "axios";

import {
  ToastContainer,
  toast
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import Finances from "./pages/Finances";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import AuditLogs from "./pages/AuditLogs";
import Backup from "./pages/Backup";
import QRScanner from "./pages/QRScanner";

import Login from "./Login";

import "./App.css";

function App() {

  // ================= API =================

  const API =
    "https://afm-backend.onrender.com";

  // ================= AUTH =================

  const [loggedIn, setLoggedIn] =
    useState(

      localStorage.getItem(
        "loggedIn"
      ) === "true"

    );

  const [role, setRole] =
    useState(

      localStorage.getItem(
        "role"
      ) || ""

    );

  const token =
    localStorage.getItem(
      "token"
    );

  const authHeaders = {

    headers: {

      Authorization:
        `Bearer ${token}`

    }

  };

  // ================= LOGIN =================

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

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

  const [financeDescription,
    setFinanceDescription] =
    useState("");

  const [financeAmount,
    setFinanceAmount] =
    useState("");

  // ================= USERS =================

  const [newUsername,
    setNewUsername] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  const [newRole,
    setNewRole] =
    useState("");

  // ================= LOGIN FUNCTION =================

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

        localStorage.setItem(
          "loggedIn",
          "true"
        );

        localStorage.setItem(
          "role",
          response.data.role
        );

        localStorage.setItem(
          "token",
          response.data.token
        );

        setLoggedIn(true);

        setRole(
          response.data.role
        );

        toast.success(
          "Login successful"
        );

      } else {

        toast.error(
          response.data.message
        );

      }

    } catch (error) {

      console.log(error);

      toast.error(
        "Login failed"
      );

    }

  };

  // ================= LOGOUT =================

  const logout = () => {

    localStorage.clear();

    setLoggedIn(false);

    setRole("");

    toast.success(
      "Logged out successfully"
    );

  };

  // ================= FETCH MEMBERS =================

  const fetchMembers = async () => {

    try {

      const response =
        await axios.get(

          `${API}/members`,

          authHeaders

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

          `${API}/attendance`,

          authHeaders

        );

      setAttendance(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  // ================= FETCH FINANCES =================

  const fetchFinances = async () => {

    try {

      const response =
        await axios.get(

          `${API}/finances`,

          authHeaders

        );

      setFinances(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  // ================= LOAD DATA =================

  useEffect(() => {

    if (loggedIn) {

      fetchMembers();
      fetchAttendance();
      fetchFinances();

    }

  }, [loggedIn]);

  // ================= ADD MEMBER =================

  const addMember = async () => {

    try {

      await axios.post(

        `${API}/add_member`,

        {
          name,
          phone,
          department,
          photo
        },

        authHeaders

      );

      fetchMembers();

      setName("");
      setPhone("");
      setDepartment("");
      setPhoto("");

      toast.success(
        "Member added successfully"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to add member"
      );

    }

  };

  // ================= DELETE MEMBER =================

  const deleteMember = async (id) => {

    try {

      await axios.delete(

        `${API}/delete_member/${id}`,

        authHeaders

      );

      fetchMembers();

      toast.success(
        "Member deleted"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Delete failed"
      );

    }

  };

  // ================= MARK ATTENDANCE =================

  const markAttendance = async (
    memberName
  ) => {

    const today =
      new Date().toLocaleDateString();

    try {

      await axios.post(

        `${API}/add_attendance`,

        {
          member_name:
            memberName,

          date: today
        },

        authHeaders

      );

      fetchAttendance();

      toast.success(
        `${memberName} attendance marked`
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Attendance failed"
      );

    }

  };

  // ================= ADD FINANCE =================

  const addFinance = async () => {

    try {

      await axios.post(

        `${API}/add_finance`,

        {
          description:
            financeDescription,

          amount:
            financeAmount
        },

        authHeaders

      );

      fetchFinances();

      setFinanceDescription("");
      setFinanceAmount("");

      toast.success(
        "Finance added"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Finance failed"
      );

    }

  };

  // ================= CREATE USER =================

  const createUser = async () => {

    try {

      const response =
        await axios.post(

          `${API}/create_user`,

          {
            username:
              newUsername,

            password:
              newPassword,

            role:
              newRole
          },

          authHeaders

        );

      toast.success(
        response.data.message
      );

      setNewUsername("");
      setNewPassword("");
      setNewRole("");

    } catch (error) {

      console.log(error);

      toast.error(
        "User creation failed"
      );

    }

  };

  // ================= FILTER MEMBERS =================

  const filteredMembers =
    members.filter((member) =>

      member.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );

  // ================= TOTAL FINANCE =================

  const totalFinance =
    finances.reduce(

      (total, finance) =>

        total +
        Number(finance.amount),

      0

    );

  // ================= CHART DATA =================

  const chartData = {

    labels: [

      "Members",
      "Attendance",
      "Finances"

    ],

    datasets: [

      {

        label:
          "Church Analytics",

        data: [

          members.length,

          attendance.length,

          totalFinance

        ],

        backgroundColor: [

          "#0b57d0",
          "#34a853",
          "#fbbc05"

        ]

      }

    ]

  };

  // ================= LOGIN SCREEN =================

  if (!loggedIn) {

    return (

      <Login

        username={username}
        setUsername={setUsername}

        password={password}
        setPassword={setPassword}

        handleLogin={handleLogin}

      />

    );

  }

  // ================= MAIN APP =================

  return (

    <Router>

      <ToastContainer />

      <div className="app">

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

            <li>

              <NavLink to="/qrscanner">
                📷 QR Scanner
              </NavLink>

            </li>

            <li>

              <NavLink to="/finances">
                💰 Finances
              </NavLink>

            </li>

            {role === "Admin" && (

              <li>

                <NavLink to="/auditlogs">
                  📋 Audit Logs
                </NavLink>

              </li>

            )}

            {role === "Admin" && (

              <li>

                <NavLink to="/backup">
                  💾 Backup
                </NavLink>

              </li>

            )}

            {role === "Admin" && (

              <li>

                <NavLink to="/settings">
                  ⚙️ Settings
                </NavLink>

              </li>

            )}

          </ul>

          <button
            onClick={logout}
          >
            Logout
          </button>

        </div>

        {/* MAIN CONTENT */}

        <div className="main-content">

          <Routes>

            <Route

              path="/"

              element={

                <Dashboard

                  members={members}

                  attendance={
                    attendance
                  }

                  totalFinance={
                    totalFinance
                  }

                  chartData={
                    chartData
                  }

                />

              }

            />

            <Route

              path="/members"

              element={

                <Members

                  search={search}
                  setSearch={setSearch}

                  name={name}
                  setName={setName}

                  phone={phone}
                  setPhone={setPhone}

                  department={department}
                  setDepartment={
                    setDepartment
                  }

                  photo={photo}
                  setPhoto={setPhoto}

                  addMember={addMember}

                  filteredMembers={
                    filteredMembers
                  }

                  markAttendance={
                    markAttendance
                  }

                  deleteMember={
                    deleteMember
                  }

                />

              }

            />

            <Route

              path="/attendance"

              element={

                <Attendance

                  attendance={
                    attendance
                  }

                />

              }

            />

            <Route

              path="/qrscanner"

              element={
                <QRScanner />
              }

            />

            <Route

              path="/finances"

              element={

                <Finances

                  finances={finances}

                  financeDescription={
                    financeDescription
                  }

                  setFinanceDescription={
                    setFinanceDescription
                  }

                  financeAmount={
                    financeAmount
                  }

                  setFinanceAmount={
                    setFinanceAmount
                  }

                  addFinance={
                    addFinance
                  }

                />

              }

            />

            <Route

              path="/auditlogs"

              element={

                role === "Admin"

                  ? (
                    <AuditLogs />
                  )

                  : (
                    <h2>
                      Access Denied
                    </h2>
                  )

              }

            />

            <Route

              path="/backup"

              element={

                role === "Admin"

                  ? (
                    <Backup />
                  )

                  : (
                    <h2>
                      Access Denied
                    </h2>
                  )

              }

            />

            <Route

              path="/settings"

              element={

                role === "Admin"

                  ? (

                    <Settings>

                      <Users

                        newUsername={
                          newUsername
                        }

                        setNewUsername={
                          setNewUsername
                        }

                        newPassword={
                          newPassword
                        }

                        setNewPassword={
                          setNewPassword
                        }

                        newRole={
                          newRole
                        }

                        setNewRole={
                          setNewRole
                        }

                        createUser={
                          createUser
                        }

                      />

                    </Settings>

                  )

                  : (

                    <h2>
                      Access Denied
                    </h2>

                  )

              }

            />

            <Route
              path="*"
              element={
                <Navigate to="/" />
              }
            />

          </Routes>

        </div>

      </div>

    </Router>

  );

}

export default App;