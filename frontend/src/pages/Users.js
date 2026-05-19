import React from "react";

function Users({

  users,

  usernameInput,
  setUsernameInput,

  passwordInput,
  setPasswordInput,

  roleInput,
  setRoleInput,

  addUser,

  deleteUser

}) {

  return (

    <div>

      <h2>
        User Management
      </h2>

      {/* USER FORM */}

      <div className="member-form">

        <input
          type="text"
          placeholder="Username"
          value={usernameInput}
          onChange={(e) =>
            setUsernameInput(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) =>
            setPasswordInput(
              e.target.value
            )
          }
        />

        <select
          value={roleInput}
          onChange={(e) =>
            setRoleInput(
              e.target.value
            )
          }
        >

          <option value="">
            Select Role
          </option>

          <option value="Admin">
            Admin
          </option>

          <option value="Pastor">
            Pastor
          </option>

          <option value="Secretary">
            Secretary
          </option>

        </select>

        <button onClick={addUser}>
          Add User
        </button>

      </div>

      {/* USERS TABLE */}

      <table>

        <thead>

          <tr>

            <th>Username</th>
            <th>Role</th>
            <th>Delete</th>

          </tr>

        </thead>

        <tbody>

          {users.map((user) => (

            <tr key={user.id}>

              <td>
                {user.username}
              </td>

              <td>
                {user.role}
              </td>

              <td>

                <button
                  onClick={() =>
                    deleteUser(
                      user.id
                    )
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default Users;