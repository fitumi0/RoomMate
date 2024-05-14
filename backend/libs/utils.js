import * as jwtModule from './jwt.module.js';
import { createHash } from 'node:crypto';

export function hashPassword(password) {
    return createHash('sha256').update(password).digest('hex');
}
export function getPayload(req) {
    if (!req.headers.authorization) {
        return null;
    }

    return jwtModule.decodeAccessToken(req.headers.authorization.split(' ')[1]);
}