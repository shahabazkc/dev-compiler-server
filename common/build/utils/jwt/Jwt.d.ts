import jwt from 'jsonwebtoken';
export declare class JWT {
    static generateJwtToken(payload: any): Promise<string>;
    static verifyJwtToken(token: string): Promise<string | jwt.JwtPayload>;
}
