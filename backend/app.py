from flask import (
    Flask,
    request,
    jsonify,
    send_from_directory
)
from flask_cors import CORS
import sqlite3
import bcrypt
import os
from werkzeug.utils import secure_filename
import jwt
import datetime

from functools import wraps

app = Flask(__name__)

CORS(app)

# ================= SECRET KEY =================

app.config["SECRET_KEY"] = "afm_super_secret_key"

DATABASE = "church.db"
UPLOAD_FOLDER = "uploads"

app.config["UPLOAD_FOLDER"] =
    UPLOAD_FOLDER
# ================= JWT TOKEN REQUIRED =================

def token_required(f):

    @wraps(f)

    def decorated(*args, **kwargs):

        token = None

        if "Authorization" in request.headers:

            bearer = request.headers["Authorization"]

            token = bearer.split(" ")[1]

        if not token:

            return jsonify({

                "message":
                "Token is missing"

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

# ================= DATABASE CONNECTION =================

def get_db_connection():

    conn = sqlite3.connect(DATABASE)

    conn.row_factory = sqlite3.Row

    return conn

# ================= CREATE TABLES =================

def create_tables():

    conn = get_db_connection()

    cursor = conn.cursor()

    # ================= USERS TABLE =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS users (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        username TEXT UNIQUE,

        password TEXT,

        role TEXT

    )

    """)

    # ================= MEMBERS TABLE =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS members (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT,

        phone TEXT,

        department TEXT,

        photo TEXT

    )

    """)

    # ================= ATTENDANCE TABLE =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS attendance (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        member_name TEXT,

        date TEXT

    )

    """)

    # ================= FINANCES TABLE =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS finances (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        description TEXT,

        amount REAL

    )

    """)

    # ================= AUDIT LOGS TABLE =================

    cursor.execute("""

    CREATE TABLE IF NOT EXISTS audit_logs (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        action TEXT,

        username TEXT,

        date TEXT

    )

    """)

    # ================= CREATE DEFAULT ADMIN =================

    cursor.execute("""

    SELECT * FROM users
    WHERE username=?

    """, ("admin",))

    admin = cursor.fetchone()

    if not admin:

        hashed_password = bcrypt.hashpw(

            "1234".encode("utf-8"),

            bcrypt.gensalt()

        ).decode("utf-8")

        cursor.execute("""

        INSERT INTO users (

            username,
            password,
            role

        )

        VALUES (?, ?, ?)

        """, (

            "admin",
            hashed_password,
            "Admin"

        ))

    conn.commit()

    conn.close()

# RUN TABLE CREATION

create_tables()

# ================= ADD AUDIT LOG =================

def add_audit_log(action, username):

    conn = get_db_connection()

    cursor = conn.cursor()

    current_date = str(

        datetime.datetime.now()

    )

    cursor.execute("""

    INSERT INTO audit_logs (

        action,
        username,
        date

    )

    VALUES (?, ?, ?)

    """, (

        action,
        username,
        current_date

    ))

    conn.commit()

    conn.close()

# ================= HOME =================

@app.route("/")

def home():

    return jsonify({

        "message":
        "AFM Church Backend Running"

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
    WHERE username=?

    """, (

        username,

    ))

    user = cursor.fetchone()

    conn.close()

    if user and bcrypt.checkpw(

        password.encode("utf-8"),

        user["password"].encode("utf-8")

    ):

        token = jwt.encode({

            "username":
            user["username"],

            "role":
            user["role"],

            "exp":
            datetime.datetime.utcnow() +
            datetime.timedelta(hours=12)

        },

        app.config["SECRET_KEY"],

        algorithm="HS256")

        add_audit_log(

            "User logged in",

            username

        )

        return jsonify({

            "success": True,

            "message":
            "Login successful",

            "role":
            user["role"],

            "token":
            token

        })

    else:

        return jsonify({

            "success": False,

            "message":
            "Invalid username or password"

        })

# ================= GET USERS =================

@app.route("/users", methods=["GET"])

@token_required

def get_users():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT id, username, role
    FROM users

    """)

    users = cursor.fetchall()

    conn.close()

    return jsonify([dict(row) for row in users])

# ================= CREATE USER =================

@app.route("/create_user", methods=["POST"])

@token_required

def create_user():

    data = request.get_json()

    username = data.get("username")

    password = data.get("password")

    role = data.get("role")

    hashed_password = bcrypt.hashpw(

        password.encode("utf-8"),

        bcrypt.gensalt()

    ).decode("utf-8")

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
            hashed_password,
            role

        ))

        conn.commit()

        conn.close()

        add_audit_log(

            f"Created user: {username}",

            "Admin"

        )

        return jsonify({

            "success": True,

            "message":
            "User created successfully"

        })

    except:

        conn.close()

        return jsonify({

            "success": False,

            "message":
            "Username already exists"

        })

# ================= UPDATE ROLE =================

@app.route("/update_role/<int:id>", methods=["PUT"])

@token_required

def update_role(id):

    data = request.get_json()

    role = data.get("role")

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    UPDATE users
    SET role=?
    WHERE id=?

    """, (

        role,
        id

    ))

    conn.commit()

    conn.close()

    add_audit_log(

        f"Updated role for user ID: {id}",

        "Admin"

    )

    return jsonify({

        "message":
        "Role updated successfully"

    })

# ================= DELETE USER =================

@app.route("/delete_user/<int:id>", methods=["DELETE"])

@token_required

def delete_user(id):

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    DELETE FROM users
    WHERE id=?

    """, (id,))

    conn.commit()

    conn.close()

    add_audit_log(

        f"Deleted user ID: {id}",

        "Admin"

    )

    return jsonify({

        "message":
        "User deleted successfully"

    })

# ================= GET MEMBERS =================

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
# ================= UPLOAD PHOTO =================

@app.route("/upload_photo", methods=["POST"])

@token_required

def upload_photo():

    if "photo" not in request.files:

        return jsonify({

            "message":
            "No photo uploaded"

        }), 400

    photo = request.files["photo"]

    filename = secure_filename(
        photo.filename
    )

    filepath = os.path.join(

        app.config["UPLOAD_FOLDER"],

        filename

    )

    photo.save(filepath)

    return jsonify({

        "photo_url":
        filepath

    })
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
    WHERE id=?

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

# ================= GET ATTENDANCE =================

@app.route("/attendance", methods=["GET"])

@token_required

def get_attendance():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM attendance

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

    add_audit_log(

        f"Marked attendance for: {member_name}",

        "Admin"

    )

    return jsonify({

        "message":
        "Attendance added"

    })

# ================= GET FINANCES =================

@app.route("/finances", methods=["GET"])

@token_required

def get_finances():

    conn = get_db_connection()

    cursor = conn.cursor()

    cursor.execute("""

    SELECT * FROM finances

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

    add_audit_log(

        f"Added finance: {description}",

        "Admin"

    )

    return jsonify({

        "message":
        "Finance added"

    })

# ================= GET AUDIT LOGS =================

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
# ================= DASHBOARD STATS =================

@app.route("/dashboard_stats", methods=["GET"])

@token_required

def dashboard_stats():

    conn = get_db_connection()

    cursor = conn.cursor()

    # MEMBERS

    cursor.execute("""

    SELECT COUNT(*) as total
    FROM members

    """)

    total_members =
        cursor.fetchone()["total"]

    # USERS

    cursor.execute("""

    SELECT COUNT(*) as total
    FROM users

    """)

    total_users =
        cursor.fetchone()["total"]

    # AUDIT LOGS

    cursor.execute("""

    SELECT COUNT(*) as total
    FROM audit_logs

    """)

    total_logs =
        cursor.fetchone()["total"]

    # FINANCES

    cursor.execute("""

    SELECT SUM(amount) as total
    FROM finances

    """)

    finance_result =
        cursor.fetchone()["total"]

    total_finances =
        finance_result if finance_result else 0

    conn.close()

    return jsonify({

        "total_members":
        total_members,

        "total_users":
        total_users,

        "total_logs":
        total_logs,

        "total_finances":
        total_finances

    })
# ================= RESTORE DATABASE =================

@app.route("/restore", methods=["POST"])

@token_required

def restore_database():

    try:

        file = request.files["file"]

        file.save("church.db")

        return jsonify({

            "message":
            "Database restored successfully"

        })

    except:

        return jsonify({

            "message":
            "Restore failed"

        }), 500
# ================= BACKUP DATABASE =================

@app.route("/backup", methods=["GET"])

@token_required

def backup_database():

    try:

        with open(

            "church.db",

            "rb"

        ) as file:

            database = file.read()

        return database

    except:

        return jsonify({

            "message":
            "Backup failed"

        }), 500
# ================= RUN APP =================

if __name__ == "__main__":

    port = int(

        os.environ.get(
            "PORT",
            5000
        )

    )

    app.run(

        host="0.0.0.0",
        port=port,
        debug=True

    )