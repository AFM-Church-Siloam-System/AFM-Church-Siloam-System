from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DATABASE = "church.db"


def init_db():
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


@app.route("/")
def home():
    return jsonify({"message": "Backend running"})


@app.route("/members", methods=["GET", "POST"])
def members():

    if request.method == "GET":

        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM members")
        rows = cursor.fetchall()

        members_list = []

        for row in rows:
            members_list.append({
                "id": row[0],
                "name": row[1],
                "phone": row[2]
            })

        conn.close()

        return jsonify(members_list)

    if request.method == "POST":

        data = request.get_json()

        name = data["name"]
        phone = data["phone"]

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

    init_db()

    port = int(os.environ.get("PORT", 5000))

    app.run(host="0.0.0.0", port=port)