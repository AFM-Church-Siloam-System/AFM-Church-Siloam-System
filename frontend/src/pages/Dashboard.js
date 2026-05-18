import React from "react";

import { Bar } from "react-chartjs-2";

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

          <p>{members.length}</p>

        </div>

        <div className="card">

          <h3>Total Attendance</h3>

          <p>{attendance.length}</p>

        </div>

        <div className="card">

          <h3>Total Finances</h3>

          <p>N${totalFinance}</p>

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