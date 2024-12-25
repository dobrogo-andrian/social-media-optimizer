from flask import Flask, request, jsonify
import pyodbc
import hashlib
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this!
jwt = JWTManager(app)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT PasswordHash FROM Users WHERE Username = ?', (username,))
    user = cursor.fetchone()

    if user:
        stored_password_hash = user[0]
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        if password_hash == stored_password_hash:
            access_token = create_access_token(identity=username)
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({'error': 'Invalid username or password'}), 401
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/user-info')
@jwt_required()
def user_info():
    current_user = get_jwt_identity()
    # Fetch user details from the database using `current_user`
    return jsonify(username=current_user, email="email@example.com")  # Example data

def get_db_connection():
    conn = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=localhost;'
        'DATABASE=social-media-optimizer;'
        'UID=social-media-optimizer;'
        'PWD=social-media-optimizer'
    )
    return conn

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data['username']
    password = data['password']
    email = data['email']

    # Hash the password for security
    password_hash = hashlib.sha256(password.encode()).hexdigest()

    # Connect to the database
    conn = get_db_connection()
    cursor = conn.cursor()

    # Insert new user into the database
    try:
        cursor.execute('''
            INSERT INTO Users (Username, PasswordHash, Email)
            VALUES (?, ?, ?)
        ''', (username, password_hash, email))
        conn.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    app.run(debug=True, port=5000)