from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE = "church.db"


# ================= DATABASE =================

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
        title TEXT NOT NULL
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

    conn.commit()
    conn.close()


init_db()


# ================= HOME =================

@app.route("/")
def home():
    return jsonify({
        "message": "AFM Church Backend Running"
    })


# ================= MEMBERS =================

@app.route("/members", methods=["GET"])
def get_members():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM members")
    rows = cursor.fetchall()

    conn.close()

    members = []

    for row in rows:
        members.append({
            "id": row[0],
            "name": row[1]
        })

    return jsonify(members)


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

    member_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "id": member_id,
        "name": data["name"]
    })


@app.route("/members/<int:id>", methods=["DELETE"])
def delete_member(id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM members WHERE id = ?",
        (id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Member deleted"
    })


# ================= EVENTS =================

@app.route("/events", methods=["GET"])
def get_events():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM events")
    rows = cursor.fetchall()

    conn.close()

    events = []

    for row in rows:
        events.append({
            "id": row[0],
            "title": row[1]
        })

    return jsonify(events)


@app.route("/events", methods=["POST"])
def add_event():
    data = request.get_json()

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO events (title) VALUES (?)",
        (data["title"],)
    )

    conn.commit()

    event_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "id": event_id,
        "title": data["title"]
    })


@app.route("/events/<int:id>", methods=["DELETE"])
def delete_event(id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM events WHERE id = ?",
        (id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Event deleted"
    })


# ================= ATTENDANCE =================

@app.route("/attendance", methods=["GET"])
def get_attendance():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM attendance")
    rows = cursor.fetchall()

    conn.close()

    attendance = []

    for row in rows:
        attendance.append({
            "id": row[0],
            "member_name": row[1]
        })

    return jsonify(attendance)


# ================= FINANCES =================

@app.route("/finances", methods=["GET"])
def get_finances():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM finances")
    rows = cursor.fetchall()

    conn.close()

    finances = []

    for row in rows:
        finances.append({
            "id": row[0],
            "amount": row[1]
        })

    return jsonify(finances)


@app.route("/finances", methods=["POST"])
def add_finance():
    data = request.get_json()

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO finances (amount) VALUES (?)",
        (data["amount"],)
    )

    conn.commit()

    finance_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "id": finance_id,
        "amount": data["amount"]
    })


@app.route("/finances/<int:id>", methods=["DELETE"])
def delete_finance(id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM finances WHERE id = ?",
        (id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Finance deleted"
    })


# ================= RUN APP =================

if __name__ == "__main__":
    app.run(debug=True)