import React from "react";

function Settings({
  darkMode,
  setDarkMode,
  logout
}) {

  return (

    <div>

      <h2>
        Settings
      </h2>

      <div className="settings-box">

        <button
          onClick={() =>
            setDarkMode(
              !darkMode
            )
          }
        >
          {darkMode
            ? "☀️ Light Mode"
            : "🌙 Dark Mode"}
        </button>

        <button
          onClick={logout}
          style={{
            background: "red",
            marginTop: "20px"
          }}
        >
          Logout
        </button>

      </div>

    </div>

  );

}

export default Settings;