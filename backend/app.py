from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)

CORS(app)

DATABASE = "church.db"

# ================= DATABASE CONNECTION =================

def get_db_connection():

    conn = sqlite3.connect(DATABASE)

    conn.row_factory = sqlite3.Row

    return conn

# ================= CREATE TABLES =================

def create_tables():

    conn = get_db_connection()

    cursor = conn.cursor()

    # ================= USERS TABLE =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS users (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        username TEXT,

        password TEXT,

        role TEXT

    )

    """)

    # ================= MEMBERS TABLE =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS members (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT,

        phone TEXT,

        department TEXT

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

    # ================= EVENTS TABLE =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS events (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        title TEXT,

        description TEXT,

        event_date TEXT

    )

    """)

    # ================= RESET ADMIN USER =================

    cursor.execute("""

    DELETE FROM users

    WHERE username = ?

    """, ("admin",))

    cursor.execute("""

    INSERT INTO users (

        username,
        password,
        role

    )

    VALUES (?, ?, ?)

    """, (

        "admin",
        "admin123",
        "Admin"

    ))

    conn.commit()

    conn.close()

create_tables()

# ================= HOME =================

@app.route("/")

def home():

    return jsonify({

        "message":
        "Backend running"

    })

# ================= LOGIN =================

@app.route("/login", methods=["POST"])

def login():

    data = request.get_json()

    username = data.get("username")

    password = data.get("password")

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM users

    WHERE username = ?
    AND password = ?

    """, (

        username,
        password

    ))

    user = cursor.fetchone()

    conn.close()

    if user:

        return jsonify({

            "success": True,

            "role": user["role"],

            "token": "demo-token"

        })

    return jsonify({

        "success": False,

        "message":
        "Invalid login"

    })

# ================= MEMBERS =================

@app.route("/members", methods=["GET"])

def get_members():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM members

    """)

    members = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in members])

# ================= ADD MEMBER =================

@app.route("/add_member", methods=["POST"])

def add_member():

    data = request.get_json()

    name = data.get("name")

    phone = data.get("phone")

    department = data.get("department")

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT INTO members (

        name,
        phone,
        department

    )

    VALUES (?, ?, ?)

    """, (

        name,
        phone,
        department

    ))

    conn.commit()

    conn.close()

    return jsonify({

        "message":
        "Member added"

    })

# ================= ATTENDANCE =================

@app.route("/attendance", methods=["GET"])

def get_attendance():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM attendance

    ORDER BY id DESC

    """)

    attendance = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in attendance])

# ================= ADD ATTENDANCE =================

@app.route("/add_attendance", methods=["POST"])

def add_attendance():

    data = request.get_json()

    member_name = data.get("member_name")

    date = data.get("date")

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT INTO attendance (

        member_name,
        date

    )

    VALUES (?, ?)

    """, (

        member_name,
        date

    ))

    conn.commit()

    conn.close()

    return jsonify({

        "message":
        "Attendance added"

    })

# ================= FINANCES =================

@app.route("/finances", methods=["GET"])

def get_finances():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM finances

    ORDER BY id DESC

    """)

    finances = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in finances])

# ================= ADD FINANCE =================

@app.route("/add_finance", methods=["POST"])

def add_finance():

    data = request.get_json()

    description = data.get("description")

    amount = data.get("amount")

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT INTO finances (

        description,
        amount

    )

    VALUES (?, ?)

    """, (

        description,
        amount

    ))

    conn.commit()

    conn.close()

    return jsonify({

        "message":
        "Finance added"

    })

# ================= EVENTS =================

@app.route("/events", methods=["GET"])

def get_events():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM events

    ORDER BY id DESC

    """)

    events = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in events])

# ================= ADD EVENT =================

@app.route("/add_event", methods=["POST"])

def add_event():

    data = request.get_json()

    title = data.get("title")

    description = data.get("description")

    event_date = data.get("event_date")

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT INTO events (

        title,
        description,
        event_date

    )

    VALUES (?, ?, ?)

    """, (

        title,
        description,
        event_date

    ))

    conn.commit()

    conn.close()

    return jsonify({

        "message":
        "Event added"

    })

# ================= RUN APP =================

if __name__ == "__main__":

    port = int(

        os.environ.get(

            "PORT",
            5000

        )

    )

    app.run(

        host="0.0.0.0",

        port=port

    )