import { createId } from "@paralleldrive/cuid2"
import { NextFunction, Request, Response } from "express";

declare global {
    module Express {
        interface Request {
            reqId: string
        }
    }
}

export const reqIdGenFn = (req: Request, res: Response, next: NextFunction) => {
    req.reqId = createId();
    next();
}