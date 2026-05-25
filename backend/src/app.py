from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
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

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# =========================
# HOME ROUTE
# =========================
@app.route("/")
def home():
    return jsonify({
        "message": "Backend running"
    })


# =========================
# MEMBERS ROUTE
# =========================
@app.route("/members", methods=["GET", "POST"])
def members():

    conn = get_db_connection()
    cursor = conn.cursor()

    # GET MEMBERS
    if request.method == "GET":

        members = cursor.execute(
            "SELECT * FROM members"
        ).fetchall()

        conn.close()

        return jsonify([
            dict(member) for member in members
        ])

    # ADD MEMBER
    if request.method == "POST":

        data = request.get_json()

        name = data.get("name")
        phone = data.get("phone")

        cursor.execute(
            "INSERT INTO members (name, phone) VALUES (?, ?)",
            (name, phone)
        )

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Member added successfully"
        })


# =========================
# START APP
# =========================

create_tables()

if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(host="0.0.0.0", port=port)