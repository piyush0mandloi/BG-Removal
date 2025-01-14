import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

// App Config
const PORT = process.env.PORT || 8001;
const app = express();
await connectDB()

// Initialize middlewares
app.use(express.json()); 
app.use(cors());

// Api route
app.get('/', (req, res) => res.status(200).send('Hello World'));
app.use('/api/users', userRouter);
app.use('/api/image', imageRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
