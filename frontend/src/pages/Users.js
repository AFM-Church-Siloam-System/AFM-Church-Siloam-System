import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function Users({

  newUsername,
  setNewUsername,

  newPassword,
  setNewPassword,

  newRole,
  setNewRole,

  createUser

}) {

  const API =
    "https://afm-backend.onrender.com";

  const [users, setUsers] =
    useState([]);

  // ================= FETCH USERS =================

  const fetchUsers = async () => {

    try {

      const response =
        await axios.get(
          `${API}/users`
        );

      setUsers(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  // ================= DELETE USER =================

  const deleteUser = async (id) => {

    try {

      await axios.delete(
        `${API}/delete_user/${id}`
      );

      fetchUsers();

    } catch (error) {

      console.log(error);

    }

  };

  // ================= LOAD USERS =================

  useEffect(() => {

    fetchUsers();

  }, []);

  return (

    <div>

      {/* CREATE USER */}

      <div className="settings-box">

        <h2>
          User Management
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={newUsername}
          onChange={(e) =>
            setNewUsername(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(
              e.target.value
            )
          }
        />

        <select
          value={newRole}
          onChange={(e) =>
            setNewRole(
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

          <option value="Treasurer">
            Treasurer
          </option>

        </select>

        <br />
        <br />

      {user.username !== "admin" ? (

  <button

    onClick={() =>
      deleteUser(user.id)
    }

  >
    Delete
  </button>

) : (

  <span>

    Protected

  </span>

)}  <button

          onClick={async () => {

            await createUser();

            fetchUsers();

          }}

        >
          Create User
        </button>

      </div>

      {/* USERS TABLE */}

      <div className="settings-box">

        <h2>
          All Users
        </h2>

        <table>

          <thead>

            <tr>

              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {users.map((user) => (

              <tr key={user.id}>

                <td>
                  {user.id}
                </td>

                <td>
                  {user.username}
                </td>

 <td>

  <select

    value={user.role}

    onChange={async (e) => {

      try {

        await axios.put(

          `${API}/update_role/${user.id}`,

          {
            role: e.target.value
          }

        );

        fetchUsers();

      } catch (error) {

        console.log(error);

      }

    }}

  >

    <option value="Admin">
      Admin
    </option>

    <option value="Pastor">
      Pastor
    </option>

    <option value="Secretary">
      Secretary
    </option>

    <option value="Treasurer">
      Treasurer
    </option>

  </select>

</td>               <td>
                  {user.role}
                </td>

                <td>

                  <button

                    onClick={() =>
                      deleteUser(user.id)
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

    </div>

  );

}

export default Users;