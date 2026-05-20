import React, {
  useState
} from "react";

import axios from "axios";

import { QrReader }
from "react-qr-reader";

function QRScanner() {

  const API =
    "https://afm-backend.onrender.com";

  const token =
    localStorage.getItem(
      "token"
    );

  const [scanResult, setScanResult] =
    useState("");

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
          member_name: memberName,
          date: today
        },

        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      );

      alert(

        `${memberName} attendance marked`

      );

    } catch (error) {

      console.log(error);

      alert(
        "Attendance failed"
      );

    }

  };

  return (

    <div className="settings-box">

      <h2>
        QR Attendance Scanner
      </h2>

      <QrReader

        constraints={{
          facingMode: "environment"
        }}

        onResult={(result) => {

          if (!!result) {

            const memberName =
              result?.text;

            setScanResult(
              memberName
            );

            markAttendance(
              memberName
            );

          }

        }}

        style={{
          width: "100%"
        }}

      />

      <br />

      <h3>

        Scan Result:
        {" "}
        {scanResult}

      </h3>

    </div>

  );

}

export default QRScanner;
