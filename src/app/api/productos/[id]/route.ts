import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Producto from '@/models/Producto';
import mongoose from 'mongoose';

// Definición correcta para Next.js 15
interface Params {
  id: string;
}

// GET para obtener un producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectToDatabase();
    
    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'ID de producto inválido' },
        { status: 400 }
      );
    }
    
    const producto = await Producto.findById(params.id);
    
    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ producto }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

// PUT para actualizar un producto por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const body = await request.json();
    
    await connectToDatabase();
    
    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'ID de producto inválido' },
        { status: 400 }
      );
    }
    
    // Actualizar producto con la fecha de actualización
    const productoActualizado = await Producto.findByIdAndUpdate(
      params.id,
      {
        ...body,
        fecha_actualizacion: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!productoActualizado) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { mensaje: 'Producto actualizado con éxito', producto: productoActualizado },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

// DELETE para eliminar un producto por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectToDatabase();
    
    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'ID de producto inválido' },
        { status: 400 }
      );
    }
    
    const productoEliminado = await Producto.findByIdAndDelete(params.id);
    
    if (!productoEliminado) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { mensaje: 'Producto eliminado con éxito' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
} 