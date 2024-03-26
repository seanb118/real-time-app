from flask import Flask, jsonify, request
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_bcrypt import Bcrypt
import pymongo


app = Flask(__name__)
CORS(app)
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

    if user and bcrypt.check_password_hash(user['password'], password):
        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token}), 200

    return jsonify({'message': 'Invalid credentials!'}), 401


@socketio.on('message')
@jwt_required()
def handle_message(data):
    db = get_db()
    messages_collection = db.messages

    message = data['message']
    username = get_jwt_identity()

    messages_collection.insert_one({'message': message, 'username': username})

    send(data, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)
