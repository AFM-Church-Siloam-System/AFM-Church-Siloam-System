from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

members = []

@app.route("/")
def home():
    return jsonify({"message": "Backend running"})

@app.route("/members", methods=["GET"])
def get_members():
    return jsonify(members)

@app.route("/members", methods=["POST"])
def add_member():
    data = request.get_json()

    new_member = {
        "name": data.get("name"),
        "phone": data.get("phone")
    }

    members.append(new_member)

    return jsonify({
        "message": "Member added successfully",
        "member": new_member
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)