import { ApiError, log } from '@dev-compiler/common';
import { Request, NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { runPlainNodeCode } from '../../../utils/executor/node/plainExecutor/runPlainNode';

export default {

    executePlainCode: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { code } = req.body;
            const response = await runPlainNodeCode(code, req.reqId);
            return res.send(response);
        } catch (err) {
            log.debug("Error while login");
            log.error(err);
            return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
        }
    }
}