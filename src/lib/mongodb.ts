import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('⚠️ Defina MONGODB_URI no .env.local');
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB conectado com Mongoose');
  } catch (err) {
    console.error('❌ Erro ao conectar com o MongoDB:', err);
    throw err;
  }
};
