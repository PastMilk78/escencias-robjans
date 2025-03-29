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

  try {
    // Verificar si la URI existe antes de conectar
    const uri = process.env.MONGODB_URI;
    console.log('Intentando conectar a MongoDB. URI existe:', !!uri);
    
    // Agregar opciones de conexión para mayor estabilidad
    const options = {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      connectTimeoutMS: 10000
    };
    
    await mongoose.connect(uri, options);
    isConnected = true;
    console.log('Conexión a MongoDB establecida correctamente');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    throw new Error(`Error de conexión a MongoDB: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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