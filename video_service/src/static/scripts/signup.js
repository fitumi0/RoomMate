function validateForm() {
    let form = document.querySelector(".form");

    let usernameInput = form.querySelector("#username");
    let emailInput = form.querySelector("#email");
    let passwordInput = form.querySelector("#password");
    let passwordConfirmationInput = form.querySelector(
        "#password-confirmation"
    );

    // Проверка никнейма
    let username = usernameInput.value.trim();
    if (username.length < 2 || /[^a-zA-Z0-9]/.test(username)) {
        alert(
            "Никнейм должен содержать минимум 2 символа (латиница) и не содержать специальных символов."
        );
        return false;
    }

    // Проверка почты
    let email = emailInput.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Почта должна быть в формате example@example.com.");
        return false;
    }

    // Проверка длины и содержания цифр в пароле
    let password = passwordInput.value.trim();
    if (/\s/.test(password)) {
        alert("Пароль не должен содержать пробелов.");
        return false;
    }
    if (password.length < 6 || !/\d/.test(password)) {
        alert(
            "Пароль должен содержать минимум 6 символов, включая хотя бы одну цифру."
        );
        return false;
    }

    // Проверка совпадения паролей
    let passwordConfirmation = passwordConfirmationInput.value.trim();
    if (password !== passwordConfirmation) {
        alert("Пароли не совпадают.");
        return false;
    }

    return true;
}
