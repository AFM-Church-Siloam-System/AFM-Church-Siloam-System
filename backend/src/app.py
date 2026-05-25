from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DATABASE = "church.db"


def connect_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def create_table():
    conn = connect_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            phone TEXT
        )
    """)

    conn.commit()
    conn.close()


create_table()


@app.route("/")
def home():
    return jsonify({"message": "Backend running"})


@app.route("/members", methods=["GET", "POST"])
def members():

    conn = connect_db()

    if request.method == "GET":

        members = conn.execute(
            "SELECT * FROM members"
        ).fetchall()

        conn.close()

        return jsonify([
            dict(member) for member in members
        ])

    if request.method == "POST":

        data = request.get_json()

        conn.execute(
            "INSERT INTO members (name, phone) VALUES (?, ?)",
            (
                data["name"],
                data["phone"]
            )
        )

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Member added"
        })


if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )