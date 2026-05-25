from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DATABASE = "church.db"


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


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


@app.route("/")
def home():
    return jsonify({"message": "Backend running"})


@app.route("/members", methods=["GET"])
def get_members():

    conn = get_db_connection()

    members = conn.execute(
        "SELECT * FROM members"
    ).fetchall()

    conn.close()

    return jsonify([
        {
            "id": member["id"],
            "name": member["name"],
            "phone": member["phone"]
        }
        for member in members
    ])


@app.route("/members", methods=["POST"])
def add_member():

    data = request.get_json()

    name = data["name"]
    phone = data["phone"]

    conn = get_db_connection()

    conn.execute(
        "INSERT INTO members (name, phone) VALUES (?, ?)",
        (name, phone)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Member added successfully"
    })


if __name__ == "__main__":

    create_tables()

    port = int(os.environ.get("PORT", 5000))

    app.run(host="0.0.0.0", port=port)