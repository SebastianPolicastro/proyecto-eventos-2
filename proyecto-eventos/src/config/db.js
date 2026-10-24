import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  await mongoose.connect(env.MONGO_URL);
  console.log('Conectado a MongoDB');
};
