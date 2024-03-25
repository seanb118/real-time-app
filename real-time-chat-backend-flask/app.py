from flask import Flask, jsonify, request
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_bcrypt import Bcrypt
from pymongo import MongoClient
import pymongo



app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*")
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

try:
    conn = pymongo.MongoClient('localhost', 27017)
    db = conn.test_database
    print("MongoDB connected:", db)
    print("Available collections:", db.list_collection_names())
except Exception as e:
    print("Error connecting to MongoDB:", e)




@app.route('/user_register', methods=['POST'])
def user_register():
    username = request.json.get('username')
    password = request.json.get('password')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    if users_collection.find_one({'username': username}):
        return jsonify({'message': 'Username already exists!'}), 400

    users_collection.insert_one({'username': username, 'password': hashed_password})

    return jsonify({'message': 'User registered successfully!'}), 201


@app.route('/login', methods=['POST'])
def login():
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
    message = data['message']
    username = get_jwt_identity()

    messages_collection.insert_one({'message': message, 'username': username})

    send(data, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)
