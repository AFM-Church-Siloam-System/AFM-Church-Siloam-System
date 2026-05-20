import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";
import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";
function AuditLogs() {

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

  const [logs, setLogs] =
    useState([]);

  // ================= FETCH LOGS =================

  const fetchLogs = async () => {

    try {

      const response =
        await axios.get(

          `${API}/audit_logs`,

          authHeaders

        );

      setLogs(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchLogs();
const exportPDF = () => {

  const doc = new jsPDF();

  doc.text(

    "AFM Church Audit Logs",

    14,
    20

  );

  autoTable(doc, {

    startY: 30,

    head: [[

      "ID",
      "Action",
      "Username",
      "Date"

    ]],

    body: logs.map((log) => [

      log.id,
      log.action,
      log.username,
      log.date

    ])

  });

  doc.save(
    "audit_logs.pdf"
  );

};
  }, []);

  return (

    <div className="settings-box">

      <h2>
        Audit Logs
      </h2>
<button
  onClick={exportPDF}
>
  Export PDF
</button>

<br />
<br />
      <table>

        <thead>

          <tr>

            <th>ID</th>
            <th>Action</th>
            <th>Username</th>
            <th>Date</th>

          </tr>

        </thead>

        <tbody>

          {logs.map((log) => (

            <tr key={log.id}>

              <td>
                {log.id}
              </td>

              <td>
                {log.action}
              </td>

              <td>
                {log.username}
              </td>

              <td>
                {log.date}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default AuditLogs;

