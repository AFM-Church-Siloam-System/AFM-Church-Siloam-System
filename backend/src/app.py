from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(_name_)
CORS(app)

members = []
current_id = 1

@app.route("/members", methods=["GET"])
def get_members():
    return jsonify(members)

@app.route("/members", methods=["POST"])
def add_member():
    global current_id

    data = request.json

    new_member = {
        "id": current_id,
        "name": data.get("name"),
        "surname": data.get("surname"),
        "phone": data.get("phone"),
        "email": data.get("email"),
        "role": data.get("role")
    }

    members.append(new_member)
    current_id += 1

    return jsonify(new_member)

@app.route("/members/<int:id>", methods=["DELETE"])
def delete_member(id):
    global members

    members = [m for m in members if m["id"] != id]

    return jsonify({"message": "Deleted"})

@app.route("/members/<int:id>", methods=["PUT"])
def update_member(id):
    data = request.json

    for member in members:
        if member["id"] == id:
            member["name"] = data.get("name")
            member["surname"] = data.get("surname")
            member["phone"] = data.get("phone")
            member["email"] = data.get("email")
            member["role"] = data.get("role")

            return jsonify(member)

    return jsonify({"message": "Member not found"}), 404

if _name_ == "_main_":
    app.run(host="0.0.0.0", port=5000, debug=True)