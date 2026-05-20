import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import { Bar } from "react-chartjs-2";

import CountUp from "react-countup";

function Dashboard({

  members,
  attendance,
  totalFinance,
  chartData

}) {

  const API =
    "https://afm-backend.onrender.com";

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

  const [stats, setStats] =
    useState({

      total_members: 0,
      total_users: 0,
      total_logs: 0,
      total_finances: 0

    });

  // ================= FETCH STATS =================

  const fetchStats = async () => {

    try {

      const response =
        await axios.get(

          `${API}/dashboard_stats`,

          authHeaders

        );

      setStats(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchStats();

  }, []);

  return (

    <div>

      {/* ANALYTICS CARDS */}

      <div className="cards">

        <div className="card">

          <h3>
            Total Members
          </h3>

          <p>

            <CountUp
              end={stats.total_members}
              duration={2}
            />

          </p>

        </div>

        <div className="card">

          <h3>
            Total Attendance
          </h3>

          <p>

            <CountUp
              end={attendance.length}
              duration={2}
            />

          </p>

        </div>

        <div className="card">

          <h3>
            Total Finances
          </h3>

          <p>

            N$

            <CountUp
              end={stats.total_finances}
              duration={2}
            />

          </p>

        </div>

        <div className="card">

          <h3>
            Total Users
          </h3>

          <p>

            <CountUp
              end={stats.total_users}
              duration={2}
            />

          </p>

        </div>

        <div className="card">

          <h3>
            Audit Logs
          </h3>

          <p>

            <CountUp
              end={stats.total_logs}
              duration={2}
            />

          </p>

        </div>

      </div>

      {/* CHART */}

      <div className="chart-container">

        <h2>
          Church Analytics
        </h2>

        <Bar data={chartData} />

      </div>

    </div>

  );

}

export default Dashboard;