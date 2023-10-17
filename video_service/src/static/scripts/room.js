document.addEventListener("DOMContentLoaded", function (event) {});

const pickerOptions = {
    onEmojiSelect: (emoji) => {
        let input = document.getElementById("chat-input");
        input.value += emoji.native;
    },
    locale: "ru",
    // set: "apple",
};

const chat = document.getElementById("chat");
const picker = new EmojiMart.Picker(pickerOptions);
picker.style.display = "none";
picker.style.position = "relative";
picker.style.top = "0";
picker.style.left = "0";

// alert(navigator.userAgentData.mobile);
chat.appendChild(picker);

/**
 * Показывает/скрывает панель с эмодзи
 */
function toggleEmojiPicker() {
    if (picker.style.display === "none") {
        picker.style.display = "flex";
    } else {
        picker.style.display = "none";
    }
}

function openNav() {
    document.getElementById("sideNav").style.width = "100vw";
    document.getElementById("sandwichButton").style.display = "none";
}

function closeNav() {
    document.getElementById("sideNav").style.width = "0";
    document.getElementById("sandwichButton").style.display = "flex";
}

/**
 * Сокет для обмена сообщениями с сервером
 */
// let socket = io.connect(window.location.href);

/**
 * Видео проигрыватель vidstack:
 * {@link "https://old.vidstack.io/docs/player/components/media/player"}
 */
const player = document.querySelector("media-player");
let startScreenShare;
let stopScreenShare;
player.addEventListener("media-player-connect", function (event) {
    player.onAttach(async () => {
        console.log("Player attached");

        // Options for getDisplayMedia()

        const displayMediaOptions = {
            video: {
                displaySurface: "window",
            },
            audio: true,
        };
        /**
         * Starts the screen sharing process.
         *
         * @return {Promise<void>} A promise that resolves when the screen sharing is started.
         */
        startScreenShare = async function screenShare() {
            const mediaStream = await navigator.mediaDevices.getDisplayMedia(
                displayMediaOptions
            );
            player.src = mediaStream;
            let button = document.getElementById("screen-share-button");
            button.classList.remove("btn-secondary");
            button.classList.add("btn-danger");
            button.textContent = "Stop sharing";
            button.onclick = stopScreenShare;
        };

        /**
         * Stops the screen sharing and resets the player and button state.
         *
         * @return {Promise<void>} A promise that resolves when the screen sharing is stopped.
         */
        stopScreenShare = async function stopScreenShare() {
            let tracks = player.src.getTracks();

            tracks.forEach((track) => track.stop());
            player.src = "";

            let button = document.getElementById("screen-share-button");
            button.classList.remove("btn-danger");
            button.classList.add("btn-secondary");
            button.textContent = "Screenshare";
            button.onclick = startScreenShare;
        };

        // add handler to state change: pause, play, seek, rate change.

        const unsubPlaying = player.subscribe(({ playing }) => {
            console.log("Playing: ", playing);

            // stateChangeHandler({
            //     playing: playing,
            //     video_timestamp: player.currentTime,
            //     play_rate: player.playbackRate,
            //     source: player.src,
            // });
        });
        const unsubBuffer = player.subscribe(({ buffered }) => {
            console.log(buffered);
        });
        // sub to source-change event
        const unsubSource = player.subscribe(({ src }) => {
            // console.log("New sourcde:" + src);
            // get user and send chat message about source change
        });

        // const unsubRate = player.subscribe(({ playbackRate }) => {
        //     console.log("Playback rate: ", playbackRate);

        //     stateChangeHandler({
        //         playing: !player.paused,
        //         video_timestamp: player.currentTime,
        //         play_rate: playbackRate,
        //         source: player.src,
        //     });
        // });

        // player.addEventListener("seeked", function (event) {
        //     console.log("Seeked: ", event);

        //     stateChangeHandler({
        //         playing: !player.paused,
        //         video_timestamp: event.srcElement.currentTime,
        //         play_rate: player.playbackRate,
        //         source: player.src,
        //     });
        // });

        // const unsubCurrentTime = player.subscribe(({ currentTime }) => {
        //     console.log("Current time: ", currentTime);
        // });
    });
});

// socket.on("connect", () => {
//     console.log("Socket connection establised to the server");
// });

// socket.on("disconnect", () => {
//     console.log("got disconnected");
//     client_uid = null;
// });

/**
 * Обработчик события изменения состояния видео
 */
// socket.on("state_update_from_server", async function (data) {
//     // console.log("Recieved data:", data);
//     if (data.video_timestamp !== null && data.video_timestamp !== undefined) {
//         player.currentTime = data.video_timestamp;
//     }

//     if (data.play_rate !== null && data.play_rate !== undefined) {
//         player.playbackRate = data.play_rate;
//     }

//     if (
//         data.source !== undefined &&
//         data.source &&
//         data.source !== player.src
//     ) {
//         player.src = data.source;
//         player.startLoading();
//     }

//     if (data.playing !== null && data.playing !== undefined) {
//         if (data.playing && player.paused) {
//             await player.play();
//         } else {
//             await player.pause();
//         }
//     }
// });

// /**
//  * Изменяет состояние видео и отправляет его на сервер
//  * @param {Object} data
//  * @param {boolean} data.playing
//  * @param {number} data.video_timestamp
//  * @param {string} data.source
//  * @param {number} data.play_rate
//  */
// let stateChangeHandler = (data) => {
//     if (data === null || data === undefined) {
//         return;
//     }

//     state_image = {
//         video_timestamp: data.video_timestamp,
//         playing: data.playing,
//         source: data.source,
//         play_rate: data.play_rate,
//     };

//     console.log(state_image);

//     socket.emit("state_update_from_client", state_image);
// };

/**
 * Изменяет источник видео
 * @param {string} source
 */
function changeSource(source) {
    video_source.src = source;
    // player.load();
}

const input = document.getElementById("chat-input");
const sendButton = document.querySelector(".send-button");

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendButton.click();
    }
});

const urlChanger = document.getElementById("url-changer");

urlChanger.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        // validate url validator
        if (urlChanger.value === "") {
            return;
        }

        player.src = urlChanger.value;
    }
});

async function getMessages(count = -1) {
    /* const url = "http://127.0.0.1:22335/api/v1/";
    let response;
    if (count === -1) {
        response = await fetch(url + "get_all_messages");
    } else {
        response = await fetch(url + "get_last_messages/" + count);
    }

    return await response.json();*/
}

async function sendMessage() {
    let chatbox = document.getElementById("chat-input");
    let message = chatbox.value;
    chatbox.value = "";
    // get cookie user_id for sender
    let user_id = document.cookie.split("=")[1];
    addMessage({ sender: user_id, timestamp: Date.now(), text: message });
    // console.log(message);
}

/**
 * Добавляет сообщение в список сообщений
 * @param {{ sender: string; timestamp: Date; text: string }} message Объект сообщения
 */
function addMessage(message) {
    const timestamp = new Date(message.timestamp);

    fetch("/api/add-message", {
        method: "POST",
        body: JSON.stringify({
            messageSender: message.sender | "Anonymous",
            messageTimestamp: timestamp,
            messageContent: message.text,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
    // Получаем элемент, в который будем добавлять сообщения
    const messages = document.getElementById("room-messages");
    const messageElement = document.createElement("li");
    messageElement.classList.add("message");

    // Создаем элементы для имени отправителя и времени отправки
    const messageSender = document.createElement("div");
    messageSender.classList.add("message-sender");
    messageSender.textContent = message.sender;

    const messageTime = document.createElement("span");
    messageTime.classList.add("message-time");

    // Преобразуем время в формат ЧЧ:ММ:СС

    const hours = timestamp.getHours().toString().padStart(2, "0");
    const minutes = timestamp.getMinutes().toString().padStart(2, "0");
    const seconds = timestamp.getSeconds().toString().padStart(2, "0");
    messageTime.textContent = `${hours}:${minutes}:${seconds}`;

    // Создаем элемент для текста сообщения
    const messageContent = document.createElement("p");
    messageContent.classList.add("message-content");
    messageContent.textContent = message.text;

    // Добавляем элементы в DOM
    messageSender.appendChild(messageTime);
    messageElement.appendChild(messageSender);
    messageElement.appendChild(messageContent);
    messages.appendChild(messageElement);

    // Прокручиваем список сообщений вниз
    messages.scrollTop = messages.scrollHeight;
}
