import jwt from 'jsonwebtoken';

export interface JWT {
    username: string;
    password: string;
    mail: string;
}

export function SignJWT(data: any, key: string) : string {
    return jwt.sign(data, key);
}

export function VerifyJWT(token: string, key: string) : JWT {
    return jwt.verify(token, key) as JWT; 
}
