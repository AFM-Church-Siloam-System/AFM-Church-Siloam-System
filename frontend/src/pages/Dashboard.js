import React from "react";

import { Bar } from "react-chartjs-2";

import CountUp from "react-countup";

function Dashboard({
  members,
  attendance,
  totalFinance,
  chartData
}) {

  return (

    <div>

      <div className="cards">

        <div className="card">

          <h3>Total Members</h3>

          <p>

            <CountUp
              end={members.length}
              duration={2}
            />

          </p>

        </div>

        <div className="card">

          <h3>Total Attendance</h3>

          <p>

            <CountUp
              end={attendance.length}
              duration={2}
            />

          </p>

        </div>

        <div className="card">

          <h3>Total Finances</h3>

          <p>

            N$

            <CountUp
              end={totalFinance}
              duration={2}
            />

          </p>

        </div>

      </div>

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