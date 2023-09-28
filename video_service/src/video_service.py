from flask import Flask, render_template, Response, request, redirect, url_for, flash, Markup
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os
from database_helper import UserHelper

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)
CORS(app)

movie_dir = os.path.join("static", "movies")
static_movies = [
    os.path.splitext(f)[0] for f in os.listdir(movie_dir) if f.endswith(".mp4")
]

# print(static_movies)

ALLOWED_GAP_TIME_IN_SECONDS = 5

num_users = 0

video_state = {
    "playing": False,
    "video_timestamp": 0,
    "source": os.path.join(movie_dir, f"{static_movies[0]}.mp4"),
    "play_rate": 1,
}

@app.route("/")
def index():
    return render_template("index.html", static_movies=static_movies, movie_by_default=static_movies[0])


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/sign-up")
def sign_up():
    return render_template("signup.html")

@app.route("/sign-up", methods=["POST"])
def sign_up_post():
    
    email = request.form.get('email')
    username = request.form.get('username')
    password = request.form.get('password')

    # check username and email uniq
    db = UserHelper("RoomMate_db", "postgres", "admin")

    if (not db.username_is_free(username)):
        flash("This username already taken!", "warning")
        return redirect(url_for('sign_up'))
    
    if (not db.email_is_free(email)):
        flash(Markup("This email address is already taken!\n <a href='/login'><u>Log in?</u></a>"), "warning")
        return redirect(url_for('sign_up'))
    
    db.register_user(username, email, password)
    flash("Registration completed successfully!\nYou can login.", "info")
    return redirect(url_for('login'))

@app.route("/send-message")
def send_message():
    pass
    
# TODO: Добавить синхронизацию времени на клиенте и сервере, ибо возможно клиент будет отставать от сервера по причине подгрузок или подвисаний.

@socketio.on("connect")
def connection_event():
    global num_users
    num_users += 1
    print(f"new user connected, now num users is {num_users}")
    socketio.emit("state_update_from_server", video_state, include_self=False)

@socketio.on("disconnect")
def connection_event():
    global num_users
    num_users -= 1
    print(f"User disconnected, now num users is {num_users}")

# добавить gap в 5 секунд для избегания лишней синхронизации.
@socketio.on("state_update_from_client")
def handle_state_update(data):
    video_state = data
    
    print(data)
    # handle the state update here
    socketio.emit("state_update_from_server", video_state, include_self=False)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=22334)
    socketio.run(app)
