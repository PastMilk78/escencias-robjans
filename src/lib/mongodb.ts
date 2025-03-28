import mongoose from 'mongoose';

// Variables para controlar la conexión
let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Usando conexión existente a MongoDB');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI no está definido en las variables de entorno');
    throw new Error('MONGODB_URI no está definido en las variables de entorno');
  }

  console.log('Intentando conectar a MongoDB con URI:', process.env.MONGODB_URI);
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('Conexión a MongoDB establecida correctamente');
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