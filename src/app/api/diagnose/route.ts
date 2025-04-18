import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Verificar si MONGODB_URI existe
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: false,
        message: 'MONGODB_URI no está definido en las variables de entorno',
        mongodbUri: false,
        connected: false,
        collections: []
      });
    }
    
    // Intentar conectar a la base de datos
    await connectToDatabase();
    
    // Verificar el estado de la conexión
    const isConnected = mongoose.connection.readyState === 1;
    
    // Obtener la lista de colecciones si está conectado
    let collections: string[] = [];
    if (isConnected && mongoose.connection.db) {
      const collectionsArray = await mongoose.connection.db.listCollections().toArray();
      collections = collectionsArray.map(c => c.name);
    }
    
    return NextResponse.json({
      success: true,
      message: isConnected ? 'Conexión a MongoDB establecida' : 'No conectado a MongoDB',
      mongodbUri: true,
      connected: isConnected,
      collections: collections
    });
  } catch (error) {
    console.error('Error en diagnóstico de MongoDB:', error);
    
    return NextResponse.json({
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      mongodbUri: !!process.env.MONGODB_URI,
      connected: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
} 