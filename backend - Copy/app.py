from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)

CORS(app)

# ================= DATABASE =================

conn = sqlite3.connect(
    "church.db",
    check_same_thread=False
)

cursor = conn.cursor()

# ================= MEMBERS TABLE =================

cursor.execute("""
CREATE TABLE IF NOT EXISTS members (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT,

    phone TEXT,

    department TEXT,

    photo TEXT

)
""")

# ================= ATTENDANCE TABLE =================

cursor.execute("""
CREATE TABLE IF NOT EXISTS attendance (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    member_name TEXT,

    date TEXT

)
""")

# ================= FINANCES TABLE =================

cursor.execute("""
CREATE TABLE IF NOT EXISTS finances (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    description TEXT,

    amount REAL

)
""")

# ================= USERS TABLE =================

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    username TEXT,

    password TEXT

)
""")

conn.commit()

# ================= DEFAULT ADMIN =================

cursor.execute(
    "SELECT * FROM users WHERE username=?",
    ("admin",)
)

admin = cursor.fetchone()

if not admin:

    cursor.execute("""
    INSERT INTO users
    (username, password)
    VALUES (?, ?)
    """, (

        "admin",
        "1234"

    ))

    conn.commit()

# ================= HOME =================

@app.route("/")

def home():

    return jsonify({
        "message":
        "AFM Church Backend Running"
    })

# ================= LOGIN =================

@app.route(
    "/login",
    methods=["POST"]
)

def login():

    data = request.json

    username = data["username"]

    password = data["password"]

    cursor.execute("""
    SELECT * FROM users
    WHERE username=?
    AND password=?
    """, (

        username,
        password

    ))

    user = cursor.fetchone()

    if user:

        return jsonify({
            "success": True,
            "message": "Login successful"
        })

    return jsonify({
        "success": False,
        "message": "Invalid credentials"
    })

# ================= GET MEMBERS =================

@app.route(
    "/members",
    methods=["GET"]
)

def get_members():

    cursor.execute(
        "SELECT * FROM members"
    )

    rows = cursor.fetchall()

    members = []

    for row in rows:

        members.append({

            "id": row[0],
            "name": row[1],
            "phone": row[2],
            "department": row[3],
            "photo": row[4]

        })

    return jsonify(members)

# ================= ADD MEMBER =================

@app.route(
    "/add_member",
    methods=["POST"]
)

def add_member():

    data = request.json

    cursor.execute("""
    INSERT INTO members
    (name, phone, department, photo)
    VALUES (?, ?, ?, ?)
    """, (

        data["name"],
        data["phone"],
        data["department"],
        data["photo"]

    ))

    conn.commit()

    return jsonify({
        "message":
        "Member added successfully"
    })

# ================= DELETE MEMBER =================

@app.route(
    "/delete_member/<int:id>",
    methods=["DELETE"]
)

def delete_member(id):

    cursor.execute(
        "DELETE FROM members WHERE id=?",
        (id,)
    )

    conn.commit()

    return jsonify({
        "message":
        "Member deleted successfully"
    })

# ================= GET ATTENDANCE =================

@app.route(
    "/attendance",
    methods=["GET"]
)

def get_attendance():

    cursor.execute(
        "SELECT * FROM attendance"
    )

    rows = cursor.fetchall()

    attendance = []

    for row in rows:

        attendance.append({

            "id": row[0],
            "member_name": row[1],
            "date": row[2]

        })

    return jsonify(attendance)

# ================= ADD ATTENDANCE =================

@app.route(
    "/add_attendance",
    methods=["POST"]
)

def add_attendance():

    data = request.json

    cursor.execute("""
    INSERT INTO attendance
    (member_name, date)
    VALUES (?, ?)
    """, (

        data["member_name"],
        data["date"]

    ))

    conn.commit()

    return jsonify({
        "message":
        "Attendance added successfully"
    })

# ================= GET FINANCES =================

@app.route(
    "/finances",
    methods=["GET"]
)

def get_finances():

    cursor.execute(
        "SELECT * FROM finances"
    )

    rows = cursor.fetchall()

    finances = []

    for row in rows:

        finances.append({

            "id": row[0],
            "description": row[1],
            "amount": row[2]

        })

    return jsonify(finances)

# ================= ADD FINANCE =================

@app.route(
    "/add_finance",
    methods=["POST"]
)

def add_finance():

    data = request.json

    cursor.execute("""
    INSERT INTO finances
    (description, amount)
    VALUES (?, ?)
    """, (

        data["description"],
        data["amount"]

    ))

    conn.commit()

    return jsonify({
        "message":
        "Finance added successfully"
    })

# ================= RUN SERVER =================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )