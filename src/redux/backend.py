from flask import Flask, request, jsonify
import pyodbc
import hashlib
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from transformers import MBartForConditionalGeneration, MBart50Tokenizer
import os

os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'

app = Flask(__name__)
CORS(app)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
jwt = JWTManager(app)
tokenizer = MBart50Tokenizer.from_pretrained("facebook/mbart-large-50-many-to-many-mmt")
model = MBartForConditionalGeneration.from_pretrained("facebook/mbart-large-50-many-to-many-mmt")


def enhance_text(text):
    # Remove musical note characters
    unwanted_start = "Проаналізуй текст, і оптимізуй його для зручного сприйняття читачем, початок тексту:"
    tokenizer.src_lang = "uk_UA"
    tokenizer.tgt_lang = "uk_UA"
    inputs = tokenizer(f"{unwanted_start} {text}", return_tensors="pt")
    outputs = model.generate(
        **inputs,
        forced_bos_token_id=tokenizer.lang_code_to_id["uk_UA"],
        max_length=2200,
        num_beams=5,  # Use beam search with 5 beams
        no_repeat_ngram_size=2,  # Avoid repeating n-grams of size 2
        early_stopping=True  # Stop when all beams reach the end token
    )
    generated_text = tokenizer.batch_decode(outputs, skip_special_tokens=True)
    generated_text = generated_text[0].replace("♫", "").replace("♪", "").replace("Проаналізуй текст, і оптимізуй його для зручного для читача сприйняття, початок тексту:", "").replace("Проаналізуй текст, і оптимізуй його для зручного сприйняття читачем, початок тексту:", "").replace('""', "").replace("Проаналізуй текст, і оптимізуй його для зручного сприйняття читача, початок тексту:", "").strip()
    return generated_text


@app.route('/improve-text', methods=['POST'])
@jwt_required()
def improve_text():
    data = request.json
    text_content = data['text']
    try:
        optimized_text = enhance_text(text_content)
        return jsonify(suggestions=optimized_text), 200
    except Exception as e:
        return jsonify(error=str(e)), 500


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
