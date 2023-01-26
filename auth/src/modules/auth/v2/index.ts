import express from 'express';

const router = express.Router();


router.post('/login');
router.get('verify-auth');
router.post('/logout');


export default router;
