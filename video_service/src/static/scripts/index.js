document.addEventListener("DOMContentLoaded", function (event) {});

/* window.mobileCheck = function () {
    let check = false;
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}; */

const pickerOptions = {
    onEmojiSelect: (emoji) => {
        // console.log(emoji);
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
let socket = io.connect(window.location.href);

/**
 * Видео проигрыватель vidstack: 
 * {@link "https://www.vidstack.io/docs/player/components/media/player"}
 */
let player = document.querySelector("media-player");

let fromWebSocket = false;

socket.on("connect", () => {
    console.log("Socket connection establised to the server");
});

socket.on("disconnect", () => {
    console.log("got disconnected");
    client_uid = null;
});

/**
 * Обработчик события изменения состояния видео
 */
socket.on("state_update_from_server", function (data) {
    // console.log("Recieved data:", data);
    if (data.video_timestamp !== null && data.video_timestamp !== undefined) {
        player.currentTime = data.video_timestamp;
    }

    if (data.play_rate !== null && data.play_rate !== undefined) {
        player.playbackRate = data.play_rate;
    }

    if (
        data.source !== undefined &&
        data.source &&
        data.source !== player.src
    ) {
        player.src = data.source;
    }

    fromWebSocket = true;

    if (data.playing !== null && data.playing !== undefined) {
        if (data.playing && player.paused) {
            player.play();
        } else if (!data.playing && !player.paused) {
            player.pause();
        }
    }

    fromWebSocket = false;
});

/**
 * Изменяет состояние видео и отправляет его на сервер
 * @param {*} event
 */
let stateChangeHandler = (event) => {
    if (event === null || event === undefined) {
        return;
    }

    let video_playing = false;

    if (event.type === "pause") {
        video_playing = false;
    } else if (event.type === "play") {
        video_playing = true;
    }

    state_image = {
        video_timestamp: player.currentTime,
        playing: video_playing,
        source: player.src,
        play_rate: player.playbackRate,
    };

    console.log(state_image);

    socket.emit("state_update_from_client", state_image);
};

player.onpause = (event) => {
    if (!fromWebSocket) {
        stateChangeHandler(event);
    }
};
player.onplay = stateChangeHandler;
player.onratechange = stateChangeHandler;
player.onseeked = stateChangeHandler;

/**
 * Изменяет источник видео
 * @param {string} source
 */
function changeSource(source) {
    video_source.src = source;
    // player.load();
}

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
    let message = document.getElementById("chat-input").value;
    console.log(message);
}

/**
 * Добавляет сообщение в список сообщений
 * @param {{ sender: string; timestamp: Date; text: string }} message Объект сообщения
 */
function addMessage(message) {
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
    const timestamp = new Date(message.timestamp);
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
