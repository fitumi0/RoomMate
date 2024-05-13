import jwt from 'jsonwebtoken';

export function generateAccessToken({
    id,
    username,
    name,
    passwordHash,
    email,
    registrationDate,
    dateModified,
}) {
    return jwt.sign(
        { id, username, name, email, registrationDate, dateModified }, // Включаем данные в объекте
        process.env.SECRET_KEY
    );
}

export function decodeAccessToken(token) {
    try {
        ;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        return decoded;
    } catch (error) {
        return null; // Если произошла ошибка верификации, возвращаем null
    }
}
