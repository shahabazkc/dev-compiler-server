import express from 'express';
import jsRouter from './js';


const terminalRouter = express.Router();

terminalRouter.use('/js', jsRouter);


export default terminalRouter;