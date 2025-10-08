import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authroutes.js';
import eventRoutes from './routes/eventRoutes.js';
import chatbotRoutes from './routes/chatbot.js'
import path from 'path';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the homepage!',
    status: 'success'
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/events',eventRoutes);

app.use('/api/chatbot',chatbotRoutes);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection failed:', err));
