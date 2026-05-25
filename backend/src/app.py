from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

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

    conn.execute("""
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
    return jsonify({"message": "Backend running"})


# =========================
# GET ALL MEMBERS
# =========================
@app.route("/members", methods=["GET"])
def get_members():

    conn = get_db_connection()

    members = conn.execute(
        "SELECT * FROM members ORDER BY id DESC"
    ).fetchall()

    conn.close()

    return jsonify([dict(member) for member in members])


# =========================
# ADD MEMBER
# =========================
@app.route("/members", methods=["POST"])
def add_member():

    data = request.json

    name = data.get("name")
    phone = data.get("phone")

    if not name or not phone:
        return jsonify({"error": "Missing data"}), 400

    conn = get_db_connection()

    conn.execute(
        "INSERT INTO members (name, phone) VALUES (?, ?)",
        (name, phone)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Member added successfully"})


# =========================
# RUN APP
# =========================
if __name__ == "__main__":
    create_tables()
    app.run(host="0.0.0.0", port=5000)