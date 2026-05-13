from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATABASE = "church.db"


# =========================
# DATABASE CONNECTION
# =========================

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# =========================
# CREATE TABLES
# =========================

def create_tables():

    conn = get_db_connection()
    cursor = conn.cursor()

    # USERS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    """)

    # MEMBERS
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        surname TEXT,
        phone TEXT,
        email TEXT,
        role TEXT,
        photo TEXT
    )
    """)

    # FINANCES
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS finances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member TEXT,
        amount REAL,
        type TEXT,
        created_at TEXT
    )
    """)

    # ATTENDANCE
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_name TEXT,
        date TEXT
    )
    """)

    # CREATE DEFAULT ADMIN
    admin = cursor.execute("""
        SELECT * FROM users
        WHERE username = 'admin'
    """).fetchone()

    if not admin:

        cursor.execute("""
            INSERT INTO users
            (username, password)
            VALUES (?, ?)
        """, ("admin", "admin123"))

    conn.commit()
    conn.close()


create_tables()


# =========================
# HOME
# =========================

@app.route("/")
def home():
    return "AFM Church Siloam Backend Running"


# =========================
# LOGIN
# =========================

@app.route("/login", methods=["POST"])
def login():

    data = request.json

    username = data.get("username")
    password = data.get("password")

    conn = get_db_connection()

    user = conn.execute("""
        SELECT * FROM users
        WHERE username = ?
        AND password = ?
    """, (username, password)).fetchone()

    conn.close()

    if user:

        return jsonify({
            "success": True,
            "message": "Login successful"
        })

    return jsonify({
        "success": False,
        "message": "Invalid credentials"
    })


# =========================
# MEMBERS
# =========================

@app.route("/members", methods=["GET"])
def get_members():

    conn = get_db_connection()

    members = conn.execute("""
        SELECT * FROM members
        ORDER BY id DESC
    """).fetchall()

    conn.close()

    return jsonify([
        dict(member) for member in members
    ])


@app.route("/add_member", methods=["POST"])
def add_member():

    data = request.json

    conn = get_db_connection()

    conn.execute("""
        INSERT INTO members
        (name, surname, phone, email, role, photo)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data.get("name"),
        data.get("surname"),
        data.get("phone"),
        data.get("email"),
        data.get("role"),
        data.get("photo")
    ))

    conn.commit()

    member = conn.execute("""
        SELECT * FROM members
        ORDER BY id DESC
        LIMIT 1
    """).fetchone()

    conn.close()

    return jsonify(dict(member))


@app.route("/delete_member/<int:id>", methods=["DELETE"])
def delete_member(id):

    conn = get_db_connection()

    conn.execute("""
        DELETE FROM members
        WHERE id = ?
    """, (id,))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Member deleted"
    })


# =========================
# FINANCES
# =========================

@app.route("/finances", methods=["GET"])
def get_finances():

    conn = get_db_connection()

    finances = conn.execute("""
        SELECT * FROM finances
        ORDER BY id DESC
    """).fetchall()

    conn.close()

    return jsonify([
        dict(finance) for finance in finances
    ])


@app.route("/add_finance", methods=["POST"])
def add_finance():

    data = request.json

    conn = get_db_connection()

    conn.execute("""
        INSERT INTO finances
        (member, amount, type, created_at)
        VALUES (?, ?, ?, ?)
    """, (
        data.get("member"),
        data.get("amount"),
        data.get("type"),
        datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    conn.commit()

    finance = conn.execute("""
        SELECT * FROM finances
        ORDER BY id DESC
        LIMIT 1
    """).fetchone()

    conn.close()

    return jsonify(dict(finance))


# =========================
# ATTENDANCE
# =========================

@app.route("/attendance", methods=["GET"])
def get_attendance():

    conn = get_db_connection()

    attendance = conn.execute("""
        SELECT * FROM attendance
        ORDER BY id DESC
    """).fetchall()

    conn.close()

    return jsonify([
        dict(item) for item in attendance
    ])


@app.route("/add_attendance", methods=["POST"])
def add_attendance():

    data = request.json

    conn = get_db_connection()

    conn.execute("""
        INSERT INTO attendance
        (member_name, date)
        VALUES (?, ?)
    """, (
        data.get("member_name"),
        datetime.now().strftime("%Y-%m-%d")
    ))

    conn.commit()

    attendance = conn.execute("""
        SELECT * FROM attendance
        ORDER BY id DESC
        LIMIT 1
    """).fetchone()

    conn.close()

    return jsonify(dict(attendance))


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":
    if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=10000
    )