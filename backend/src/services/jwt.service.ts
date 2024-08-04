import jwt from "jsonwebtoken";

const secretKey = "your-very-secure-secret-key";
const expiresIn = "60d"; // срок действия токена 60 дней

interface JwtPayload {
	sub: string;
	name: string;
	iat?: number;
	exp?: number;
}

export function generateToken(
	payload: Omit<JwtPayload, "iat" | "exp">
): string {
	return jwt.sign(payload, secretKey, { expiresIn });
}

export function verifyToken(token: string): JwtPayload | null {
	try {
		return jwt.verify(token, secretKey) as JwtPayload;
	} catch (error) {
		console.error("Invalid or expired token:", error);
		return null;
	}
}
