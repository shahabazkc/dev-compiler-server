import express from 'express';
import v1Router from './v1';
import v2Router from './v2'
const authRouter = express.Router();


authRouter.use('/v1', v1Router);
authRouter.use('/v2', v2Router);


export default authRouter;