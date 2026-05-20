import React from "react";

import axios from "axios";

function Backup() {
const [restoreFile, setRestoreFile] =
  React.useState(null);
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

    },

    responseType: "blob"

  };

  // ================= DOWNLOAD BACKUP =================

  const downloadBackup = async () => {
const restoreBackup = async () => {

  if (!restoreFile) {

    alert(
      "Select backup file"
    );

    return;

  }

  const formData =
    new FormData();

  formData.append(
    "file",
    restoreFile
  );

  try {

    await axios.post(

      `${API}/restore`,

      formData,

      {

        headers: {

          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "multipart/form-data"

        }

      }

    );

    alert(
      "Database restored successfully"
    );

  } catch (error) {

    console.log(error);

    alert(
      "Restore failed"
    );

  }

};
    try {

      const response =
        await axios.get(

          `${API}/backup`,

          authHeaders

        );

      const url =
        window.URL.createObjectURL(

          new Blob([response.data])

        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(

        "download",

        "church_backup.db"

      );

      document.body.appendChild(link);

      link.click();

    } catch (error) {

      console.log(error);

      alert(
        "Backup failed"
      );

    }

  };

  return (

    <div className="settings-box">

      <h2>
        Backup System
      </h2>

      <p>

        Download a complete
        backup of the church
        database.

      </p>

      <button
        onClick={downloadBackup}
      >
        Download Backup
      </button>
<br />
<br />

<input

  type="file"

  onChange={(e) =>

    setRestoreFile(
      e.target.files[0]
    )

  }

/>

<br />
<br />

<button
  onClick={restoreBackup}
>
  Restore Backup
</button>
    </div>

  );

}

export default Backup;
