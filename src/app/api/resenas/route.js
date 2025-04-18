import { connectToDatabase } from '@/lib/mongodb';
import ResenaModel from '@/models/Resena';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Obtener todas las reseñas
    const resenas = await ResenaModel.find({})
      .sort({ fecha: -1 }) // Ordenar por fecha descendente
      .limit(10); // Limitar a 10 reseñas
    
    return NextResponse.json({ resenas }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    return NextResponse.json(
      { error: 'Error al obtener reseñas' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    
    // Obtener los datos de la reseña del cuerpo de la solicitud
    const body = await request.json();
    
    // Validar los datos requeridos
    if (!body.nombre || !body.comentario || !body.puntuacion) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (nombre, comentario, puntuación)' },
        { status: 400 }
      );
    }
    
    // Validar la puntuación (entre 1 y 5)
    if (body.puntuacion < 1 || body.puntuacion > 5) {
      return NextResponse.json(
        { error: 'La puntuación debe estar entre 1 y 5' },
        { status: 400 }
      );
    }
    
    // Crear una nueva reseña
    const nuevaResena = new ResenaModel({
      nombre: body.nombre,
      comentario: body.comentario,
      puntuacion: body.puntuacion,
      fecha: new Date()
    });
    
    // Guardar la reseña en la base de datos
    await nuevaResena.save();
    
    return NextResponse.json(
      { mensaje: 'Reseña creada exitosamente', resena: nuevaResena },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear reseña:', error);
    return NextResponse.json(
      { error: 'Error al crear la reseña' },
      { status: 500 }
    );
  }
} 