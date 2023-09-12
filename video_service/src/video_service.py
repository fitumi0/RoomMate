from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app)
CORS(app)

movie_dir = os.path.join("src", "static", "movies")
static_movies = [
    os.path.splitext(f)[0] for f in os.listdir(movie_dir) if f.endswith(".mp4")
]

# print(static_movies)

ALOOWED_GAP_TIME_IN_SECONDS = 5

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
    # handle the state update here
    socketio.emit("state_update_from_server", video_state, include_self=False)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=22334)
    socketio.run(app)
