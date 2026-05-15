import React, { useState } from "react";
import "./App.css";

function Login({ onLogin }) {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = () => {

    if (
      username === "admin" &&
      password === "1234"
    ) {
      onLogin();
    } else {
      alert("Invalid username or password");
    }
  };

  return (

    <div className="login-page">

      <div className="login-box">

        <h1>AFM Church Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;