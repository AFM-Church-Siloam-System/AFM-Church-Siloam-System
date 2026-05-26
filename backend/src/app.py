from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DATABASE = "church.db"


# CREATE DATABASE TABLE
def create_table():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# HOME ROUTE
@app.route("/")
def home():
    return jsonify({"message": "Backend running"})


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
            "name": row[1],
            "phone": row[2]
        })

    conn.close()

    return jsonify(members)


# ADD MEMBER
@app.route("/members", methods=["POST"])
def add_member():
    data = request.get_json()

    name = data.get("name")
    phone = data.get("phone")

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO members (name, phone) VALUES (?, ?)",
        (name, phone)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Member added successfully"
    })


if __name__ == "__main__":
    create_table()

    port = int(os.environ.get("PORT", 5000))

    app.run(host="0.0.0.0", port=port)