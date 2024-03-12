from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # This will enable CORS for all routes

@app.route('/process-text', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data.get('text', '')
    processed_text = text + " world"
    return jsonify({'processed_text': processed_text})

if __name__ == '__main__':
    app.run(debug=True)
