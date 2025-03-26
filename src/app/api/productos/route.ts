import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Producto from '@/models/Producto';

// GET para obtener todos los productos
export async function GET() {
  try {
    await connectToDatabase();
    
    const productos = await Producto.find({}).sort({ fecha_creacion: -1 });
    
    return NextResponse.json({ productos }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST para crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    await connectToDatabase();
    
    const nuevoProducto = new Producto({
      nombre: body.nombre,
      categoria: body.categoria,
      precio: body.precio,
      stock: body.stock,
      descripcion: body.descripcion,
      imagen: body.imagen || '/placeholder.jpg',
      inspirado_en: body.inspirado_en,
      notas: body.notas || []
    });
    
    await nuevoProducto.save();
    
    return NextResponse.json(
      { mensaje: 'Producto creado con éxito', producto: nuevoProducto },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
} 