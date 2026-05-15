// MEMBERS
useEffect(() => {
  fetch("https://afm-backend.onrender.com/members")
    .then((res) => res.json())
    .then((data) => setMembers(data));
}, []);

// FINANCES
useEffect(() => {
  fetch("https://afm-backend.onrender.com/finances")
    .then((res) => res.json())
    .then((data) => setFinances(data));
}, []);

// ATTENDANCE
useEffect(() => {
  fetch("https://afm-backend.onrender.com/attendance")
    .then((res) => res.json())
    .then((data) => setAttendance(data));
}, []);

// EVENTS
useEffect(() => {
  fetch("https://afm-backend.onrender.com/events")
    .then((res) => res.json())
    .then((data) => setEvents(data));
}, []);

// LOGIN
fetch("https://afm-backend.onrender.com/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(loginData),
});

// BACKUP
fetch("https://afm-backend.onrender.com/backup");

// UPDATE MEMBER
fetch(`https://afm-backend.onrender.com/update_member/${editId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(editData),
});

// ADD MEMBER
fetch("https://afm-backend.onrender.com/add_member", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(memberData),
});

// DELETE MEMBER
fetch(`https://afm-backend.onrender.com/delete_member/${id}`, {
  method: "DELETE",
});

// ADD ATTENDANCE
fetch("https://afm-backend.onrender.com/add_attendance", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(attendanceData),
});

// ADD FINANCE
fetch("https://afm-backend.onrender.com/add_finance", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(financeData),
});

// ADD EVENT
fetch("https://afm-backend.onrender.com/add_event", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(eventData),
});