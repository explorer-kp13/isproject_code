from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

import json
file_path = "data.json"



######################################################## - iske niche kuch mt krna

@app.route('/get-data', methods=['GET'])
def receive_data():

    # Read the data from the JSON file and save the data in a variable
    output = ''
    with open(file_path, "r") as file:
        json_data = json.load(file)
        output = json_data

    # Return a response
    return jsonify(output)

@app.route('/update-data', methods=['POST'])
def update_data():
    data = request.json
    p = data.get('product')
    s = data.get('site')
    t = data.get('time')
    q = int(data.get('quantity'))

    # Read the data from the JSON file and update the data
    with open(file_path, "r") as file:
        json_data = json.load(file)
        json_data[p][s][t] = q

    # Write the updated data back to the JSON file
    with open(file_path, "w") as file:
        json.dump(json_data, file)

    # Return a response
    return jsonify({
        "message": "Successfully updated the data",
        "data": json_data
    })

if __name__ == "__main__":
    app.run(port=8001)