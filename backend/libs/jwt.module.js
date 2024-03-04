import * as jwt from 'jsonwebtoken';
import { createHash } from 'node:crypto';

export function generateAccessToken(username, password) {
    return jwt.sign(
        username,
        createHash('sha256')
            .update(username + password)
            .digest('hex'));
}