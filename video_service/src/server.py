from flask import Flask, render_template, make_response, Response, request, redirect, url_for, flash, Markup
# from flask_socketio import SocketIO, emit
from flask_cors import CORS
import m3u8

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
# socketio = SocketIO(app)
CORS(app)

# # # # # # # # # # # # # # # # # # # # 
import uuid

def generate_user_id():
    return str(uuid.uuid4())

    # TODO: use it inside room
    # user_id = request.cookies.get('user_id')

    # if not user_id:
    #     user_id = generate_user_id()

    # response = make_response(render_template("index.html"))
    # response.set_cookie('user_id', generate_user_id())
    # return response

import random

def generate_nickname():
    adjectives = ['sleepy', 'slow', 'smelly', 'wet', 'fat', 'red', 'orange',
                  'yellow', 'green', 'blue', 'purple', 'fluffy', 'white', 'proud',
                  'brave', 'amazing', 'fierce', 'grumpy', 'tiny', 'shy', 'great', 'happy',
                  'silly', 'funny', 'cool', 'sweet', 'kind', 'gentle', 'clever', 'jolly',
                  'jumpy', 'lucky', 'odd', 'perfect', 'proud', 'silly', 'sleepy', 'super',
                  'tame', 'wild', 'chatty', 'chilly', 'crazy', 'fancy', 'hungry', 'itchy']
    
    nouns = ['cat', 'dog', 'bird', 'fish', 'tree', 'flower', 'car', 'bike', 'boat',
             'socks', 'pants', 'shirt', 'hat', 'chair', 'table', 'duck', 'bed', 'mouse',
             'house', 'ball', 'clown', 'toy', 'pen', 'laptop', 'phone', 'bottle', 'cup',
             'fork', 'knife', 'spoon', 'banana', 'apple', 'orange', 'grapes', 'cheese',
             'lion', 'tiger', 'bear', 'goat', 'zebra', 'cow', 'horse', 'pig', 'chicken',
             'sheep', 'fish', 'rabbit', 'panda', 'monkey', 'kangaroo', 'elephant', 'giraffe']
    
    adjective = random.choice(adjectives)
    noun = random.choice(nouns)
    return f"{adjective}_{noun}"

    # user_nickname = request.cookies.get('user_nickname')
    # if not user_nickname:
    #     user_nickname = generate_nickname()
    # response = make_response(render_template("index.html"))
    # response.set_cookie('user_nickname', user_nickname)
    # return response

# # # # # # # # # # # # # # # # # # # # 

@app.route("/")
def index():
    
    return render_template("index.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/sign-up")
def sign_up():
    return render_template("signup.html")

@app.route("/get-m3u8/<path:link>")
def get_m3u8(link):
    playlist = m3u8.load(link)
    return(playlist.dumps())

@app.route("/sign-up", methods=["POST"])
def sign_up_post():
    email = request.form.get('email')
    username = request.form.get('username')
    password = request.form.get('password')
    return redirect(url_for('login'))
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

@app.route("/create-room")
def create_room():
    # return "create room"
    return render_template("room.html", movie_by_default="2020.09.15-23.06_01.mp4")



if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=22334)