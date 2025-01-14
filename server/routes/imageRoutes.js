import express from 'express';
import { removeBgImage } from '../controllers/Imagecontroller.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/auth.js';

const imageRouter = express.Router();

imageRouter.post('/remove-bg',authUser,upload.single('image'),removeBgImage);

export default imageRouter;