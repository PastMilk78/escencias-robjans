import mongoose from 'mongoose';

// Variables para controlar la conexión
let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI no está definido en las variables de entorno');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Conexión a MongoDB establecida');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    throw new Error('No se pudo conectar a la base de datos');
  }
};

export const disconnectFromDatabase = async () => {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Desconectado de MongoDB');
  } catch (error) {
    console.error('Error al desconectar de MongoDB:', error);
  }
}; 