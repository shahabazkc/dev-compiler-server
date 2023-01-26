import express from 'express';
import controller from './controller';
import validator from './validator';
const router = express.Router();


router.post('/login', validator.login, controller.loginController);
router.post('/signup', validator.signup, controller.signup);
router.get('/verify-auth', controller.verifyAuth);
router.post('/logout', controller.logout);


export default router;
