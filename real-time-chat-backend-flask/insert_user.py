from pymongo import MongoClient
from flask_bcrypt import Bcrypt

# Create a Bcrypt instance
bcrypt = Bcrypt()

# Assuming your MongoDB service is named `mongo` and runs on the standard port
client = MongoClient('localhost', 27017)
db = client.test_database

username = 'seanb118'
password = 'password'

# Hash the password
hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

# Insert a user
result = db.users.insert_one({'username': username, 'password': hashed_password})
print(f'User inserted with ID: {result.inserted_id}')
