import express from 'express';
import controller from './controller';
import validator from './validator';

const router = express.Router();

router.get('/', (req, res, next) => res.send("Hi, I am js terminal"));

router.post('/plain-code', controller.executePlainCode);

export default router;