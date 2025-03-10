import { Request } from "express"
import { APP_SECRET_KEY } from "../configs"
import jwt from 'jsonwebtoken'
import { AuthPayload } from "../dto/Auth.dto"

export const GenerateSignature = async (payload: AuthPayload) => {
    return jwt.sign(payload, APP_SECRET_KEY, {
        expiresIn: '1d'
    })
}

export const ValidateSignature = async (req: Request) => {
    const signature = req.get('Authorization')
    if (signature) {
        try {
            const token = signature.split(' ')[1];
            const payload = jwt.verify(token, APP_SECRET_KEY) as AuthPayload;
            (req as any).user = payload;
            return true;
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                console.error('Token has expired');
            } else {
                console.error('Invalid token', err);
            }
            return false;
        }
    }
    return false;
}