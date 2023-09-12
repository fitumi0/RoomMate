import time
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, send
from flask_login import LoginManager, login_required, current_user
from flask_cors import CORS
# from Classes.Message import Message
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)
app.config['SECRET'] = 'secret!'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///chat_history.db"

CORS(app)

db = SQLAlchemy()
db.init_app(app)
socketio = SocketIO(app, cors_allowed_origins="*")


# region Classes

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(32), nullable=False)
    text = db.Column(db.String(256), nullable=False)
    timestamp = db.Column(db.Integer, nullable=False)

    def get_dict(self):
        return {
            'id': self.id,
            'sender': self.sender,
            'text': self.text,
            'timestamp': self.timestamp
        }

# endregion


# инициализируем объект LoginManager
login_manager = LoginManager(app)

@app.route("/api/v1/login", methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    
    print({
        'username': username,
        'password': password
    })

    if (username == "admin" and password == "admin"):
        return jsonify({'status': 'success', 'message': 'Admin logged in successfully'})


    # user = User.authenticate(username, password)
    # if user is not None:
    #     login_user(user)
    #     return jsonify({'status': 'success', 'message': 'Logged in successfully'})
    # else:
    #     return jsonify({'status': 'fail', 'message': 'Invalid username or password'})

# определяем функцию для загрузки пользователя
@login_manager.user_loader
def load_user(user_id):
    # реализуйте логику загрузки пользователя из базы данных
    return "1"

@app.route("/api/v1/send_message/<string:message>", methods=['POST'])
# @login_required
def handle_message(message):
    print('received message: ' + message)
    request_data = request.get_json()

    try:
        msg = Message(
            sender=request_data["username"], 
            text=message, 
            timestamp=time.time() * 1000)
        db.session.add(msg)
        db.session.commit()

        # Если удалось сохранить, возвращаем на клиент в текущую комнату.
        return jsonify(
            {
                'status': True, 
                'data': msg.get_dict()
            })
    except SQLAlchemyError as e:
        print(e)

        db.session.rollback()

        # Если не удалось сохранить, возвращаем на клиент ошибку.
        return jsonify(
            {
                'status': False, 
                'data': msg.get_dict()
            })        
    
@app.route("/api/v1/ping", methods=['GET'])
# @login_required
def ping():
    return jsonify(
        {
            'status': True, 
            'message': 'pong!'
        })

@app.route("/api/v1/get_last_messages/<int:count>", methods=['GET'])
# @login_required
def get_last_messages(count):
    return [i.get_dict() for i in Message.query.order_by(Message.id.desc()).limit(count).all()]

@app.route("/api/v1/get_all_messages", methods=['GET'])
# @login_required
def get_all_messages():
    return [i.get_dict() for i in Message.query.order_by(Message.id.desc()).all()]