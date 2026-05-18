import React from "react";

function Members({
  search,
  setSearch,
  exportMembersPDF,
  name,
  setName,
  phone,
  setPhone,
  department,
  setDepartment,
  photo,
  setPhoto,
  addMember,
  filteredMembers,
  markAttendance,
  deleteMember
}) {

  // ================= IMAGE UPLOAD =================

  const handleImageUpload = (
    e
  ) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend = () => {

      setPhoto(
        reader.result
      );

    };

    reader.readAsDataURL(file);

  };

  return (

    <div>

      {/* SEARCH */}

      <div className="search-section">

        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <button
          onClick={exportMembersPDF}
          style={{
            background: "green"
          }}
        >
          Export PDF
        </button>

      </div>

      {/* MEMBER FORM */}

      <div className="member-form">

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) =>
            setPhone(
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) =>
            setDepartment(
              e.target.value
            )
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={
            handleImageUpload
          }
        />

        <button onClick={addMember}>
          Add Member
        </button>

      </div>

      {/* MEMBERS TABLE */}

      <table>

        <thead>

          <tr>

            <th>Photo</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Attendance</th>
            <th>Delete</th>

          </tr>

        </thead>

        <tbody>

          {filteredMembers.map(
            (member) => (

              <tr
                key={member.id}
              >

                <td>

                  <img
                    src={
                      member.photo ||
                      "https://via.placeholder.com/50"
                    }
                    alt="Member"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />

                </td>

                <td>
                  {member.name}
                </td>

                <td>
                  {member.phone}
                </td>

                <td>
                  {member.department}
                </td>

                <td>

                  <button
                    onClick={() =>
                      markAttendance(
                        member.name
                      )
                    }
                  >
                    Present
                  </button>

                </td>

                <td>

                  <button
                    onClick={() =>
                      deleteMember(
                        member.id
                      )
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>

  );

}

export default Members;