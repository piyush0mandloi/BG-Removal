import express from 'express';
import { clerkWebhooks, paymentRazorpay, userCredits } from '../controllers/UserControllers.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/webhooks', clerkWebhooks);
userRouter.get('/credits', authUser,userCredits);
userRouter.post('/pay-razor', authUser, paymentRazorpay)

export default userRouter;