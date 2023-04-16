import { authMiddleware } from '@dev-compiler/common';
import express from 'express';
import controller from './controller';
import validator from './validator';
const router = express.Router();

router.post('/login', validator.login, controller.loginController);
router.post('/signup', validator.signup, controller.signup);
router.post('/signInWithGithub', validator.signInWithGithub, controller.signInWithGithub);
router.post('/signInWithGoogle', validator.signInWithGoogle, controller.signInWithGoogle);
router.get('/getGoogleSignInUrl', controller.getGoogleSignInUrl);
router.use(authMiddleware);
router.get('/verify-auth', controller.verifyAuth);
router.post('/logout', controller.logout);


export default router;
