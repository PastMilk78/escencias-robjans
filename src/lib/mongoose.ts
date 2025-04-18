import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);
  
  if(isConnected) {
    console.log('MongoDB ya está conectado');
    return;
  }
  
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no está definido en las variables de entorno');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    isConnected = true;
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
  }
}; 