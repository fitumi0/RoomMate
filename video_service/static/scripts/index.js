document.addEventListener("DOMContentLoaded", function (event) {
    const pickerOptions = {
        onEmojiSelect: console.log,
        locale: 'ru',
        set: 'apple',
    }
    const picker = new EmojiMart.Picker(pickerOptions)
    picker.style.position = 'absolute';
    picker.style.bottom = '0';
    picker.style.right = '0';
    // document.body.appendChild(picker)
});

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("sideNav").style.width = "100vw";
    document.getElementById("sandwichButton").style.display = "none";

}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("sideNav").style.width = "0";
    document.getElementById("sandwichButton").style.display = "flex";
}

let socket = io.connect(window.location.href);

let video = document.querySelector("video");
let video_soruce = document.getElementById("video-source");


socket.on("connect", () => {
    console.log("Socket connection establised to the server");
});

// disconnection event
socket.on("disconnect", () => {
    console.log("got disconnected");
    client_uid = null;
});

socket.on("state_update_from_server", function (data) {
    console.log("Recieved data:", data);
    if (data.video_timestamp !== null && data.video_timestamp !== undefined) {
        video.currentTime = data.video_timestamp;
    }

    if (data.play_rate !== null && data.play_rate !== undefined) {
        video.playbackRate = data.play_rate;
    }

    if (
        data.source !== null &&
        data.source !== undefined &&
        data.source !== video_soruce.src
    ) {
        video_soruce.src = data.source;
        video.load();
    }

    if (data.playing !== null && data.playing !== undefined) {
        if (data.playing === true && video.paused) {
            video.play();
        } else if (data.playing === false && !video.paused) {
            video.pause();
        }
    }
});

let state_change_handler = (event) => {
    let video_playing = false;
    if (event === null && event === undefined) {
        return;
    }

    if (event.type === "pause") {
        video_playing = false;
    } else if (event.type === "play") {
        video_playing = true;
    }

    state_image = {
        video_timestamp: video.currentTime,
        playing: video_playing,
        source: video_soruce.src,
        play_rate: video.playbackRate,
    };

    socket.emit("state_update_from_client", state_image);
};

video.onpause = state_change_handler;
video.onplay = state_change_handler;
video.onratechange = state_change_handler;

// let movieList = document.getElementById("movie-list");

// movieList.addEventListener("click", function (event) {
// console.log(event.target)
// if (event.target.tagName === "LI") {
//     var movieName = event.target.textContent;
//     var movieUrl = "/static/movies/" + movieName + ".mp4";
//     video_soruce.src = movieUrl;
//     video.load();

//     closeButton.click();
// }
// });

function changeSource(source) {
    video_soruce.src = source;
    video.load();
}

async function getMessages(count = -1) {
    const url = 'http://127.0.0.1:22335/api/v1/';
    let response;
    if (count === -1) {
        response = await fetch(url + 'get_all_messages');
    }
    else {
        response = await fetch(url + 'get_last_messages/' + count);
    }

    return await response.json();
}

async function sendMessage(message) { }

function addMessage(message) {
    const messages = document.getElementById('room-messages');
    const messageElement = document.createElement('li');
    messageElement.classList.add('message');
    
    const messageSender = document.createElement('div');
    messageSender.classList.add('message-sender');
    messageSender.textContent = message.sender;

    const messageTime = document.createElement('span');
    messageTime.classList.add('message-time');
    messageTime.textContent = message.timestamp;
    messageSender.appendChild(messageTime);

    const messageContent = document.createElement('p');
    messageContent.classList.add('message-content');
    messageContent.textContent = message.text;

    messageElement.appendChild(messageSender);
    messageElement.appendChild(messageContent);
    messages.appendChild(messageElement);
}