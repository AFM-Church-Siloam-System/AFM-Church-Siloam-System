from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)

CORS(app)

DATABASE = "church.db"

# ================= DATABASE =================

def get_db_connection():

    conn = sqlite3.connect(DATABASE)

    conn.row_factory = sqlite3.Row

    return conn

# ================= CREATE TABLES =================

def create_tables():

    conn = get_db_connection()

    cursor = conn.cursor()

    # USERS

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS users (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        username TEXT,

        password TEXT,

        role TEXT

    )

    """)

    # MEMBERS

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS members (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT,

        phone TEXT,

        department TEXT

    )

    """)

    # CREATE ADMIN

    cursor.execute("""

    DELETE FROM users

    WHERE username = ?

    """, ("admin",))

    cursor.execute("""

    INSERT INTO users (

        username,
        password,
        role

    )

    VALUES (?, ?, ?)

    """, (

        "admin",
        "admin123",
        "Admin"

    ))

    conn.commit()

    conn.close()

create_tables()

# ================= HOME =================

@app.route("/")

def home():

    return jsonify({

        "message":
        "Backend running"

    })

# ================= LOGIN =================

@app.route("/login", methods=["POST"])

def login():

    data = request.get_json()

    username = data.get("username")

    password = data.get("password")

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM users

    WHERE username = ?
    AND password = ?

    """, (

        username,
        password

    ))

    user = cursor.fetchone()

    conn.close()

    if user:

        return jsonify({

            "success": True,

            "role": user["role"],

            "token": "demo-token"

        })

    return jsonify({

        "success": False,

        "message":
        "Invalid login"

    })

# ================= MEMBERS =================

@app.route("/members")

def members():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM members

    """)

    data = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in data])

# ================= RUN =================

if __name__ == "__main__":

    port = int(

        os.environ.get(

            "PORT",
            5000

        )

    )

    app.run(

        host="0.0.0.0",

        port=port

    )