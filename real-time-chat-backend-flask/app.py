from flask import Flask, jsonify, request
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_bcrypt import Bcrypt
import pymongo
import json


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        # Custom JSON encoding logic
        if isinstance(obj, YourCustomClass):
            return obj.to_json()
        return super().default(obj)


app = Flask(__name__)
app.json_encoder = CustomJSONEncoder
# Replace app with your Flask app variable
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'

socketio = SocketIO(app, cors_allowed_origins="*")
jwt = JWTManager(app)
bcrypt = Bcrypt(app)


# Define get_db function to retrieve a database instance
def get_db():
    client = pymongo.MongoClient('mongo', 27017)
    return client.test_database


@app.route('/user_register', methods=['POST'])
def user_register():
    db = get_db()
    users_collection = db.users

    username = request.json.get('username')
    password = request.json.get('password')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    if users_collection.find_one({'username': username}):
        return jsonify({'message': 'Username already exists!'}), 400

    users_collection.insert_one({'username': username, 'password': hashed_password})

    return jsonify({'message': 'User registered successfully!'}), 201


@app.route('/login', methods=['POST'])
def login():
    db = get_db()
    users_collection = db.users
    username = request.json.get('username')
    password = request.json.get('password')

    user = users_collection.find_one({'username': username})

    if user:
        stored_hashed_password = user['password']
        print(f"Stored Hashed Password: {stored_hashed_password}")  # Print the stored hashed password

        password_check_result = bcrypt.check_password_hash(stored_hashed_password, password)
        print(f"Password Check Result: {password_check_result}")  # Print the result of the password check

        if password_check_result:
            access_token = create_access_token(identity=username)
            return jsonify({'access_token': access_token}), 200
            
        else:
            return jsonify({'message': f'Password is incorrect for user: {username}'}), 401

    return jsonify({'message': 'Invalid credentials!'}), 401


@socketio.on('message')
@app.route('/messages', methods=['POST'])
@jwt_required()
def handle_message():
    username = get_jwt_identity()
    endpoint = f'/{username}/messages'  # Unique endpoint based on username

    db = get_db()
    messages_collection = db.messages

    message = request.json.get('message')
    
    if not message:
        return jsonify({'error': 'Message content is required'}), 400

    messages_collection.insert_one({'message': message, 'username': username})

    send({'message': message, 'username': username}, broadcast=True)

    return jsonify({'message': 'Message sent successfully'}), 200


@app.route('/token')
def get_token():
    # Logic to generate and return a JWT token
    return jsonify({'token': create_access_token(identity='test_user')})


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', debug=True)
