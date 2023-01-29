import express from 'express';
import v1Router from './v1';

const jsRouter = express.Router();

jsRouter.use('/v1', v1Router);

export default jsRouter;