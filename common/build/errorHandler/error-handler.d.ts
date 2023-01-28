import { Request, Response, NextFunction } from 'express';
declare const errorHandler: (err: any, req: Request, res: Response, next: NextFunction) => void;
export default errorHandler;
