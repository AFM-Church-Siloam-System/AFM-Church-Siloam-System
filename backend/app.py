from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE = "church.db"


# CREATE DATABASE TABLES
def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_name TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS finances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL
    )
    """)

    # SAMPLE DATA
    cursor.execute("SELECT * FROM members")
    if len(cursor.fetchall()) == 0:
        cursor.execute("INSERT INTO members (name) VALUES ('John')")
        cursor.execute("INSERT INTO members (name) VALUES ('Mary')")

    cursor.execute("SELECT * FROM finances")
    if len(cursor.fetchall()) == 0:
        cursor.execute("INSERT INTO finances (amount) VALUES (50)")

    conn.commit()
    conn.close()


init_db()


# HOME
@app.route("/")
def home():
    return jsonify({"message": "AFM Church Backend Running"})


# GET MEMBERS
@app.route("/members", methods=["GET"])
def get_members():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM members")
    rows = cursor.fetchall()

    members = []

    for row in rows:
        members.append({
            "id": row[0],
            "name": row[1]
        })

    conn.close()

    return jsonify(members)


# ADD MEMBER
@app.route("/members", methods=["POST"])
def add_member():
    data = request.get_json()

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO members (name) VALUES (?)",
        (data["name"],)
    )

    conn.commit()

    new_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "id": new_id,
        "name": data["name"]
    })


# EVENTS
@app.route("/events")
def get_events():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM events")
    rows = cursor.fetchall()

    events = []

    for row in rows:
        events.append({
            "id": row[0],
            "title": row[1]
        })

    conn.close()

    return jsonify(events)


# ATTENDANCE
@app.route("/attendance")
def get_attendance():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM attendance")
    rows = cursor.fetchall()

    attendance = []

    for row in rows:
        attendance.append({
            "id": row[0],
            "member_name": row[1]
        })

    conn.close()

    return jsonify(attendance)


# FINANCES
@app.route("/finances")
def get_finances():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM finances")
    rows = cursor.fetchall()

    finances = []

    for row in rows:
        finances.append({
            "id": row[0],
            "amount": row[1]
        })

    conn.close()

    return jsonify(finances)


if __name__ == "__main__":
    app.run(debug=True)