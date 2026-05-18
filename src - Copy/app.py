from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import sqlite3
import shutil
import os

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
        username TEXT,
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

    # EVENTS

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        date TEXT,
        venue TEXT
    )
    """)

    # RESET ADMIN

    cursor.execute("DELETE FROM users")

    cursor.execute("""
    INSERT INTO users (username, password)
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
            "success": True
        })

    return jsonify({
        "success": False,
        "message": "Invalid login"
    })


# =========================
# MEMBERS
# =========================

@app.route("/members")
def members():

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


@app.route("/update_member/<int:id>", methods=["PUT"])
def update_member(id):

    data = request.json

    conn = get_db_connection()

    conn.execute("""
    UPDATE members
    SET
        name = ?,
        surname = ?,
        phone = ?,
        email = ?,
        role = ?,
        photo = ?
    WHERE id = ?
    """, (
        data.get("name"),
        data.get("surname"),
        data.get("phone"),
        data.get("email"),
        data.get("role"),
        data.get("photo"),
        id
    ))

    conn.commit()

    member = conn.execute("""
    SELECT * FROM members
    WHERE id = ?
    """, (id,)).fetchone()

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
        "message": "Deleted"
    })


# =========================
# FINANCES
# =========================

@app.route("/finances")
def finances():

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
    VALUES (?, ?, ?, datetime('now'))
    """, (
        data.get("member"),
        data.get("amount"),
        data.get("type")
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

@app.route("/attendance")
def attendance():

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
    VALUES (?, date('now'))
    """, (
        data.get("member_name"),
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
# EVENTS
# =========================

@app.route("/events")
def events():

    conn = get_db_connection()

    events = conn.execute("""
    SELECT * FROM events
    ORDER BY id DESC
    """).fetchall()

    conn.close()

    return jsonify([
        dict(event) for event in events
    ])


@app.route("/add_event", methods=["POST"])
def add_event():

    data = request.json

    conn = get_db_connection()

    conn.execute("""
    INSERT INTO events
    (title, date, venue)
    VALUES (?, ?, ?)
    """, (
        data.get("title"),
        data.get("date"),
        data.get("venue")
    ))

    conn.commit()

    event = conn.execute("""
    SELECT * FROM events
    ORDER BY id DESC
    LIMIT 1
    """).fetchone()

    conn.close()

    return jsonify(dict(event))


# =========================
# BACKUP DATABASE
# =========================

@app.route("/backup")
def backup():

    backup_file = "church_backup.db"

    if os.path.exists(backup_file):
        os.remove(backup_file)

    shutil.copyfile(
        "church.db",
        backup_file
    )

    return send_file(
        backup_file,
        as_attachment=True
    )


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=10000
    )