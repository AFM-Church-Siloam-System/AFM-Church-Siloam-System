from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import sqlite3
import jwt
import datetime

app = Flask(__name__)

CORS(app)

# ================= SECRET KEY =================

app.config["SECRET_KEY"] = "afm_secret_key"

# ================= DATABASE =================

DATABASE = "church.db"

# ================= DB CONNECTION =================

def get_db_connection():

    conn = sqlite3.connect(DATABASE)

    conn.row_factory = sqlite3.Row

    return conn

# ================= CREATE TABLES =================

def create_tables():

    conn = get_db_connection()

    cursor = conn.cursor()

    # ================= MEMBERS =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS members (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT,

        phone TEXT,

        department TEXT,

        photo TEXT

    )

    """)

    # ================= ATTENDANCE =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS attendance (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        member_name TEXT,

        date TEXT

    )

    """)

    # ================= FINANCES =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS finances (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        description TEXT,

        amount REAL

    )

    """)

    # ================= USERS =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS users (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        username TEXT UNIQUE,

        password TEXT,

        role TEXT

    )

    """)

    # ================= AUDIT LOGS =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS audit_logs (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        action TEXT,

        username TEXT,

        timestamp TEXT

    )

    """)

    # ================= EVENTS =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS events (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        title TEXT,

        description TEXT,

        event_date TEXT

    )

    """)

    # ================= DEFAULT ADMIN =================

    cursor.execute("""

    SELECT * FROM users
    WHERE username = ?

    """, ("admin",))

    admin = cursor.fetchone()

    if not admin:

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

# ================= AUDIT LOG FUNCTION =================

def add_audit_log(action, username):

    conn = get_db_connection()

    cursor = conn.cursor()

    timestamp = str(datetime.datetime.now())

    cursor.execute("""

    INSERT INTO audit_logs (

        action,
        username,
        timestamp

    )

    VALUES (?, ?, ?)

    """, (

        action,
        username,
        timestamp

    ))

    conn.commit()

    conn.close()

# ================= TOKEN REQUIRED =================

def token_required(f):

    @wraps(f)

    def decorated(*args, **kwargs):

        token = None

        if "Authorization" in request.headers:

            token = request.headers["Authorization"]

            token = token.replace("Bearer ", "")

        if not token:

            return jsonify({

                "message":
                "Token missing"

            }), 401

        try:

            jwt.decode(

                token,

                app.config["SECRET_KEY"],

                algorithms=["HS256"]

            )

        except:

            return jsonify({

                "message":
                "Invalid token"

            }), 401

        return f(*args, **kwargs)

    return decorated

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

        token = jwt.encode(

            {

                "username": username,

                "exp":

                datetime.datetime.utcnow()

                + datetime.timedelta(hours=8)

            },

            app.config["SECRET_KEY"],

            algorithm="HS256"

        )

        return jsonify({

            "success": True,

            "message": "Login successful",

            "role": user["role"],

            "token": token

        })

    return jsonify({

        "success": False,

        "message": "Invalid credentials"

    })

# ================= MEMBERS =================

@app.route("/members", methods=["GET"])

@token_required

def get_members():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM members

    """)

    members = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in members])

# ================= ADD MEMBER =================

@app.route("/add_member", methods=["POST"])

@token_required

def add_member():

    data = request.get_json()

    name = data.get("name")

    phone = data.get("phone")

    department = data.get("department")

    photo = data.get("photo")

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT INTO members (

        name,
        phone,
        department,
        photo

    )

    VALUES (?, ?, ?, ?)

    """, (

        name,
        phone,
        department,
        photo

    ))

    conn.commit()

    conn.close()

    add_audit_log(

        f"Added member: {name}",

        "Admin"

    )

    return jsonify({

        "message":
        "Member added successfully"

    })

# ================= DELETE MEMBER =================

@app.route("/delete_member/<int:id>", methods=["DELETE"])

@token_required

def delete_member(id):

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    DELETE FROM members
    WHERE id = ?

    """, (id,))

    conn.commit()

    conn.close()

    add_audit_log(

        f"Deleted member ID: {id}",

        "Admin"

    )

    return jsonify({

        "message":
        "Member deleted"

    })

# ================= ATTENDANCE =================

@app.route("/attendance", methods=["GET"])

@token_required

def get_attendance():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM attendance

    ORDER BY id DESC

    """)

    attendance = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in attendance])

# ================= ADD ATTENDANCE =================

@app.route("/add_attendance", methods=["POST"])

@token_required

def add_attendance():

    data = request.get_json()

    member_name = data.get("member_name")

    date = data.get("date")

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT INTO attendance (

        member_name,
        date

    )

    VALUES (?, ?)

    """, (

        member_name,
        date

    ))

    conn.commit()

    conn.close()

    return jsonify({

        "message":
        "Attendance added"

    })

# ================= FINANCES =================

@app.route("/finances", methods=["GET"])

@token_required

def get_finances():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM finances

    ORDER BY id DESC

    """)

    finances = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in finances])

# ================= ADD FINANCE =================

@app.route("/add_finance", methods=["POST"])

@token_required

def add_finance():

    data = request.get_json()

    description = data.get("description")

    amount = data.get("amount")

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT INTO finances (

        description,
        amount

    )

    VALUES (?, ?)

    """, (

        description,
        amount

    ))

    conn.commit()

    conn.close()

    return jsonify({

        "message":
        "Finance added"

    })

# ================= CREATE USER =================

@app.route("/create_user", methods=["POST"])

@token_required

def create_user():

    data = request.get_json()

    username = data.get("username")

    password = data.get("password")

    role = data.get("role")

    conn = get_db_connection()

    cursor = conn.cursor()

    try:

        cursor.execute("""

        INSERT INTO users (

            username,
            password,
            role

        )

        VALUES (?, ?, ?)

        """, (

            username,
            password,
            role

        ))

        conn.commit()

        conn.close()

        add_audit_log(

            f"Created user: {username}",

            "Admin"

        )

        return jsonify({

            "message":
            "User created successfully"

        })

    except:

        conn.close()

        return jsonify({

            "message":
            "User already exists"

        })

# ================= AUDIT LOGS =================

@app.route("/audit_logs", methods=["GET"])

@token_required

def get_audit_logs():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM audit_logs

    ORDER BY id DESC

    """)

    logs = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in logs])

# ================= EVENTS =================

@app.route("/events", methods=["GET"])

@token_required

def get_events():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM events

    ORDER BY event_date ASC

    """)

    events = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in events])

# ================= ADD EVENT =================

@app.route("/add_event", methods=["POST"])

@token_required

def add_event():

    data = request.get_json()

    title = data.get("title")

    description = data.get("description")

    event_date = data.get("event_date")

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    INSERT INTO events (

        title,
        description,
        event_date

    )

    VALUES (?, ?, ?)

    """, (

        title,
        description,
        event_date

    ))

    conn.commit()

    conn.close()

    add_audit_log(

        f"Added event: {title}",

        "Admin"

    )

    return jsonify({

        "message":
        "Event added successfully"

    })

# ================= HOME =================

@app.route("/", methods=["GET"])

def home():

    return jsonify({

        "message":
        "AFM Backend Running"

    })

# ================= RUN APP =================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )