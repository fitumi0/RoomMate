const pickerOptions = {
    onEmojiSelect: (emoji) => {
        let input = document.getElementById("chat-input");
        input.value += emoji.native;
    },
    locale: "ru",
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

const input = document.getElementById("chat-input");
const sendButton = document.querySelector(".send-button");

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendButton.click();
    }
});

const urlChanger = document.getElementById("url-changer");

let changePlayerSourceUrl = () => {
    if (urlChanger.value === "") {
        return;
    }

    player.src = urlChanger.value;
}

urlChanger.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();

        changePlayerSourceUrl();
    }
});

/**
 * Добавляет сообщение в список сообщений
 * @param {{ sender: string; timestamp: Date; text: string }} message Объект сообщения
 */
function addMessage(message) {
    const timestamp = new Date(Date.now());
    // Получаем элемент, в который будем добавлять сообщения
    const messages = document.getElementById("room-messages");
    const messageElement = document.createElement("li");
    messageElement.classList.add("message");

    // Создаем элементы для имени отправителя и времени отправки
    const messageSender = document.createElement("div");
    messageSender.classList.add("message-sender");
    messageSender.textContent = message.sender;
    if (message.sender === getCookie("username")) {
        messageSender.style.color = "var(--accent-color)";
    }

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

    input.value = "";
}

// anonymous account cookie

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function setCookie(name, value) {
    document.cookie = `${name}=${value}; path=/`;
}


if (document.cookie.indexOf('username') === -1) {
    // Генерация уникальной последовательности на основе хэша длиной 16 символов
    const username = generateRandomString(16);
    setCookie('username', username);
}

let changeUsername = document.getElementById("nickname-changer-button");
changeUsername.addEventListener("click", function () {
    let newUsername = document.getElementById("nickname-changer").value;
    if (newUsername === "") {
        alert("Incorrect nickname")
        return;
    }
    setCookie('username', newUsername);
    document.getElementById("nickname-changer").value = "";
})

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}