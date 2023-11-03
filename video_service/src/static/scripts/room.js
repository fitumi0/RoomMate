// variables start

let protocol = window.location.protocol;
let socket = io(protocol + "//" + document.domain + ":" + location.port, {
    autoConnect: true,
});

const rtcPeer = new Peer(undefined, {
    host: "/",
    port: "3001",
});

let sendMessageButton = document.getElementById("send-message-button");

let currentRoom = window.location.pathname.split("/")[2];

// variables end

// constants start

/**
 * Видео проигрыватель vidstack:
 * {@link "https://www.vidstack.io/"}
 */
const player = document.querySelector("media-player");

const PC_CONFIGURATION = new RTCPeerConnection({
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
            ],
        },
    ],
});

const peers = {};

// constants end

// sockets start

socket.on("connect", () => {
    console.log(`Socket connection established! Your id ${socket.id}`);
    // console.log(`Peer connection established! Your id ${rtcPeer.id}`);
    socket.emit("join-room", currentRoom, rtcPeer.id);
});

socket.on("disconnect", (currentRoom) => {
    console.log("Socket disconnected!");
    socket.emit("leave-room", currentRoom, rtcPeer.id);
});

socket.on("create-room", () => {
    let id = currentRoom;
    currentRoom = id;
    socket.emit("create-room", id);
});

socket.on("message", (message, room_id) => {
    addMessage({
        sender: message.sender,
        timestamp: Date.now(),
        text: message.text,
    });
});

socket.on("user-connected", (ids) => {
    id = ids.socket_id;
    rtcId = ids.rtc_id;
    connectToNewUser(id, rtcId)

    console.log(`User ${id} connected`);
})

socket.on("user-disconnected", (id) => {
    // connectToNewUser(id)

    console.log(`User ${id} disconnected`);

    if (peers[id]) peers[id].close();
    delete peers[id];
})

// sockets end

sendMessageButton.addEventListener("click", () => {
    let chatbox = document.getElementById("chat-input");
    let message = chatbox.value;
    socket.emit("message", getCookie("username"), message, currentRoom);
});

player.addEventListener("media-player-connect", function (event) {
    player.onAttach(async () => {
        console.log("Player attached");

        const playingState = player.subscribe(({ paused, playing }) => {

        });

        const sourceState = player.subscribe(({ source }) => {
            // console.log(source);
            // send to all peers peerjs message
        })

    });
});

const displayMediaOptions = {
    video: true,
    audio: true,
};

let setStream = (stream) => {
    player.src = stream;
    player.muted = true;
    player.paused = false;
    changeShareButtonState(false)
}

let stopStream = () => {
    player.src = "";
    player.paused = true;
}

/**
 * Если WebRtc соединение не установлено (первое включение стрима), 
 * устанавливает его, а если установлено, меняет источник стрима.
 * (Разрыв peer соединения и повторная установка)
 * @param {*} streamSource 
 */
let changeStreamingSource = (streamSource) => {
    Object.values(peers).forEach((peer) => {
        peer.peer.setStreams(streamSource);
    });
}

rtcPeer.on('open', (id) => {
    localId = id;
})

rtcPeer.on("call", (call) => {
    // console.log(call);
    call.answer(null)
    call.on("stream", (stream) => {
        console.log(stream);
        setStream(stream);
    })
})

let connectToNewUser = (id, rtcPeerId) => {
    if (peers[id]) {
        return;
    }

    peers[id] = rtcPeer.connect(rtcPeerId);

    socket.emit("join-room", currentRoom, rtcPeer.id);
}

rtcPeer.on("connection", (connection) => {
    // connection.on("open", () => {
    //     console.log("RTCConnection established!");
    // });

    connection.on('data', function (data) {
        console.log('Received', data);
    });
})

let renderVideo = (stream) => {
    let video = document.createElement("video");
    document.getElementById("main").appendChild(video);
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        video.play();
    }
}

let changeStreamingSources = (stream) => {
    Object.values(peers).forEach((peer) => {
        console.log(`New source for peer ${peer.peer}: ${stream}`);
        rtcPeer.call(peer.peer, stream);
    })
}

/**
 * Starts the screen sharing process.
 *
 * @return {Promise<void>} A promise that resolves when the screen sharing is started.
 */
let startScreenShare = () => {
    navigator.mediaDevices
        .getDisplayMedia(displayMediaOptions)
        .then((stream) => {
            player.src = stream;

            changeStreamingSources(stream)
        });

    changeShareButtonState(true);

};

/**
 * Stops the screen sharing and resets the player and button state.
 *
 * @return {Promise<void>} A promise that resolves when the screen sharing is stopped.
 */
let stopScreenShare = async () => {
    let tracks = player.src.getTracks();

    tracks.forEach((track) => track.stop());
    changeStreamingSources("");
    changeShareButtonState(false);
};

let changeShareButtonState = (state) => {
    let button = document.getElementById("screen-share-button");
    if (state) {
        button.classList.remove("btn-secondary");
        button.classList.add("btn-danger");
        button.textContent = "Stop sharing";
        button.onclick = stopScreenShare;
    } else {
        button.classList.remove("btn-danger");
        button.classList.add("btn-secondary");
        button.textContent = "Screenshare";
        button.onclick = startScreenShare;
    }
}
