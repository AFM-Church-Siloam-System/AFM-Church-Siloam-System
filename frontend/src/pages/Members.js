import React from "react";

import axios from "axios";

import { QRCodeCanvas }
from "qrcode.react";

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

  // ================= PHOTO FILE =================

  const [photoFile, setPhotoFile] =
    React.useState(null);

  // ================= API =================

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

  // ================= UPLOAD PHOTO =================

  const uploadPhoto = async () => {

    if (!photoFile) {

      alert(
        "Select a photo"
      );

      return;

    }

    const formData =
      new FormData();

    formData.append(
      "photo",
      photoFile
    );

    try {

      const response =
        await axios.post(

          `${API}/upload_photo`,

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

      setPhoto(
        response.data.photo_url
      );

      alert(
        "Photo uploaded successfully"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Upload failed"
      );

    }

  };

  // ================= WHATSAPP =================

  const sendWhatsApp = (
    const sendBulkWhatsApp = () => {

  if (

    filteredMembers.length === 0

  ) {

    alert(
      "No members found"
    );

    return;

  }

  const numbers =

    filteredMembers

      .map(

        (member) =>

          member.phone

      )

      .join(",");

  const message =

    `AFM Church Siloam Announcement:

Greetings church family.

Please remember our upcoming church service and prayer meeting.

God bless you.`;

  const whatsappURL =

    `https://wa.me/${numbers}?text=${encodeURIComponent(message)}`;

  window.open(

    whatsappURL,

    "_blank"

  );

};
    phone,
    name
  ) => {

    const message =

      `Hello ${name},

AFM Church Siloam greetings.

Thank you for being part of our church family.`;

    const whatsappURL =

      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(

      whatsappURL,

      "_blank"

    );

  };

  return (

    <div>

      {/* ================= TOP SECTION ================= */}

      <div className="top-bar">

        <input

          type="text"

          placeholder="Search member"

          value={search}

          onChange={(e) =>

            setSearch(
              e.target.value
            )

          }

        />

        <button
          onClick={exportMembersPDF}
        >
          Export PDF
        </button>
<button
  onClick={sendBulkWhatsApp}
>
  Bulk WhatsApp
</button>
      </div>

      {/* ================= ADD MEMBER ================= */}

      <div className="form-container">

        <input

          type="text"

          placeholder="Name"

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

        {/* ================= PHOTO UPLOAD ================= */}

        <input

          type="file"

          onChange={(e) =>

            setPhotoFile(
              e.target.files[0]
            )

          }

        />

        <br />
        <br />

        <button
          onClick={uploadPhoto}
        >
          Upload Photo
        </button>

        <br />
        <br />

        <button
          onClick={addMember}
        >
          Add Member
        </button>

      </div>

      {/* ================= MEMBER LIST ================= */}

      <div className="members-grid">

        {filteredMembers.map((member) => (

          <div
            className="member-card"
            key={member.id}
          >

            {/* PROFILE PHOTO */}

            {member.photo && (

              <img

                src={
                  `${API}/${member.photo}`
                }

                alt="Member"

                className="member-photo"

              />

            )}

            <h3>
              {member.name}
            </h3>

            <p>
              {member.phone}
            </p>

            <p>
              {member.department}
            </p>

            {/* ================= ACTION BUTTONS ================= */}

            <button

              onClick={() =>

                markAttendance(
                  member.name
                )

              }

            >
              Mark Attendance
            </button>

            <button

              onClick={() =>

                deleteMember(
                  member.id
                )

              }

            >
              Delete
            </button>

            <button

              onClick={() =>

                sendWhatsApp(

                  member.phone,

                  member.name

                )

              }

            >

              WhatsApp

            </button>

            {/* ================= MEMBER ID CARD ================= */}

            <div className="member-id-card">

              <h3>
                AFM Church Siloam
              </h3>

              {member.photo && (

                <img

                  src={
                    `${API}/${member.photo}`
                  }

                  alt="Member"

                  className="member-photo"

                />

              )}

              <p>

                <strong>
                  Name:
                </strong>

                {" "}

                {member.name}

              </p>

              <p>

                <strong>
                  Department:
                </strong>

                {" "}

                {member.department}

              </p>

              <QRCodeCanvas

                value={member.name}

                size={100}

              />

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Members;