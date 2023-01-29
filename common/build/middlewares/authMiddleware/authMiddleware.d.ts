import { NextFunction, Request, Response } from "express";
interface JwtPayload {
    userId: string;
    origin: string;
}
declare global {
    namespace Express {
        interface Request {
            jwtData?: JwtPayload;
            userId?: string;
        }
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
