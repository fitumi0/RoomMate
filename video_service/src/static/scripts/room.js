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
let screenShare = false;
let fileShare = false;
let currentRoom = window.location.pathname.split("/")[2];

// variables end

// constants start

/**
 * Видео проигрыватель vidstack:
 * {@link "https://www.vidstack.io/"}
 */
const player = document.querySelector("media-player");
let video;
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

        const filePick = document.getElementById("file-share-button");
        filePick.accept = "video/mp4, video/quicktime";
        filePick.addEventListener("change", handleFileInput);

        function handleFileInput(event) {
            const file = event.target.files[0];
            if (file) {
                player.src = URL.createObjectURL(file);
                player.startLoading();
                // fileShare = true;
                // const stream = new MediaStream(video.captureStream(50));
                // setStreamingSources(stream);
            }
        }

        const playingState = player.subscribe(({ paused }) => {
            // if (screenShare) {
            //     return;
            // }
            // Object.values(peers).forEach((peer) => {
            //     peer.send({
            //         type: "stream",
            //         source: player.src,
            //         paused: paused,
            //         currentTime: player.currentTime,
            //         playbackrate: player.playbackRate,
            //         screenShare: screenShare
            //     })
            // })
        });

        const sourceState = player.subscribe(({ source }) => {
            // send to all peers peerjs message
        })

        const currentTimeState = player.subscribe(({ seeking }) => {
            // if (screenShare) {
            //     return;
            // }
            // if (!seeking) {
            //     Object.values(peers).forEach((peer) => {
            //         peer.send({
            //             source: player.src,
            //             paused: player.paused,
            //             currentTime: player.currentTime,
            //             playbackrate: player.playbackRate,
            //             screenShare: screenShare
            //         })
            //     })
            // }
        })
    });

    player.addEventListener('loaded-metadata', (event) => {
        // Available on all media events!
        const target = event.trigger?.target;
        if (target instanceof HTMLVideoElement) {
            video = target; // `HTMLVideoElement`
            // console.log(element);
            // const stream = new MediaStream(element.captureStream(50));
            // setStreamingSources(stream);
        }

    });
});

const displayMediaOptions = {
    audio: true,
    video: {
        frameRate: {
            ideal: 50,
        },
    },
};

let setStream = (stream) => {
    player.src = stream;
    player.muted = true;
    player.paused = false;
    changeShareButtonState(false);
}

let stopStream = () => {
    player.src = "";
    player.paused = true;
}

rtcPeer.on('open', (id) => {
    localId = id;
})

rtcPeer.on("call", (call) => {
    call.answer(null)
    call.on("stream", (stream) => {
        setStream(stream);
    })
})

let connectToNewUser = (id, rtcPeerId) => {
    if (peers[id]) {
        return;
    }

    peers[id] = rtcPeer.connect(rtcPeerId);

    if (screenShare) {
        setStreamingSourceByPeer(peers[id].peer, player.src)
    }


    // TODO: изменить способ возврата id всем вошедшим
    socket.emit("join-room", currentRoom, rtcPeer.id);
}

rtcPeer.on("connection", (connection) => {
    // connection.on("open", () => {
    //     console.log("RTCConnection established!");
    // });

    // connection.on('data', handlePlayerState)
});

/**
         * 
         * @param {{source: string, paused: boolean, currentTime: number, playbackrate: number}} data 
         */
let handlePlayerState = (data) => {
    player.src = data.source;
    player.paused = data.paused;
    player.currentTime = data.currentTime;
    player.playbackRate = data.playbackrate;
    screenShare = data.screenShare;
};

let renderVideo = (stream) => {
    let video = document.createElement("video");
    document.getElementById("video-chat").appendChild(video);
    video.srcObject = stream;
    video.onloadedmetadata = () => {
        video.play();
    }
}

/**
 * 
 * @param {MediaSource} content 
 */
let setVideoSources = (content) => {
    Object.values(peers).forEach((peer) => {
        peer.send({
            source: content,
            paused: player.paused,
            currentTime: player.currentTime,
            playbackrate: player.playbackRate
        })
    })
}

let setStreamingSources = (stream) => {
    Object.values(peers).forEach((peer) => {
        rtcPeer.call(peer.peer, stream);
    })
}

let setStreamingSourceByPeer = (peer, stream) => {
    rtcPeer.call(peer, stream);
}

let changeStreamingSources = (stream) => {
    Object.values(peers).forEach((peer) => {
        peer.peerConnection.getSenders().forEach((sender) => {
            stream.getVideoTracks().forEach((track) => {
                sender.replaceTrack(track)
            })
        })

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
            stream.getVideoTracks()[0].onended = function () {
                stopScreenShare();
            };
            setStreamingSources(stream)
            changeShareButtonState(true);
        });
};

/**
 * Stops the screen sharing and resets the player and button state.
 *
 * @return {Promise<void>} A promise that resolves when the screen sharing is stopped.
 */
let stopScreenShare = async () => {
    player.src.getTracks().forEach((track) => {
        track.stop()
        player.src.removeTrack(track);
    }
    )
    player.src = "";

    setStreamingSources(player.src);
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

    screenShare = state;
}
