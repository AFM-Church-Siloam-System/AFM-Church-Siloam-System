from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

DATABASE = "church.db"


# DATABASE CONNECTION
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


# CREATE TABLE
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


create_tables()


# HOME ROUTE
@app.route("/")
def home():
    return jsonify({
        "message": "Backend running"
    })


# GET MEMBERS
@app.route("/members", methods=["GET"])
def get_members():

    conn = get_db_connection()
    cursor = conn.cursor()

    members = cursor.execute(
        "SELECT * FROM members"
    ).fetchall()

    conn.close()

    return jsonify([
        dict(member) for member in members
    ])


# ADD MEMBER
@app.route("/members", methods=["POST"])
def add_member():

    data = request.get_json()

    name = data.get("name")
    phone = data.get("phone")

    conn = get_db_connection()
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


# START APP
if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(host="0.0.0.0", port=port)