import React from "react";

function Attendance({
  attendance
}) {

  return (

    <div>

      <h2>
        Attendance Records
      </h2>

      <table>

        <thead>

          <tr>

            <th>Member</th>
            <th>Date</th>

          </tr>

        </thead>

        <tbody>

          {attendance.map((item) => (

            <tr key={item.id}>

              <td>
                {item.member_name}
              </td>

              <td>
                {item.date}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default Attendance;