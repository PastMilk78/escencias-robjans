import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Producto from '@/models/Producto';

// Productos fijos para mostrar cuando hay error
const productosFijos = [
  {
    _id: "producto1",
    nombre: "Aroma Intenso",
    categoria: "Mujer",
    precio: 299.99,
    stock: 25,
    descripcion: "Una fragancia intensa inspirada en los perfumes más exclusivos. Con notas predominantes de vainilla y frutos rojos.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "One Million",
    notas: [
      { nombre: "Vainilla", intensidad: 8, color: "#F3E5AB" },
      { nombre: "Frutos Rojos", intensidad: 7, color: "#C41E3A" }
    ]
  },
  {
    _id: "producto2",
    nombre: "Esencia Fresca",
    categoria: "Hombre",
    precio: 249.99,
    stock: 30,
    descripcion: "Fragancia fresca y duradera con notas cítricas y amaderadas. Ideal para el uso diario.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "Acqua di Gio",
    notas: [
      { nombre: "Cítrico", intensidad: 9, color: "#FFD700" },
      { nombre: "Madera", intensidad: 6, color: "#8B4513" }
    ]
  },
  {
    _id: "producto3",
    nombre: "Aroma Seductor",
    categoria: "Mujer",
    precio: 279.99,
    stock: 20,
    descripcion: "Una fragancia seductora con notas florales y especiadas. Perfecta para ocasiones especiales.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "Coco Mademoiselle",
    notas: [
      { nombre: "Flores", intensidad: 7, color: "#FFC0CB" },
      { nombre: "Especias", intensidad: 8, color: "#8B4513" }
    ]
  },
  {
    _id: "producto4",
    nombre: "Perfume Elegante",
    categoria: "Unisex",
    precio: 349.99,
    stock: 15,
    descripcion: "Una mezcla elegante y sofisticada con notas amaderadas y almizcle. Perfecto para cualquier ocasión.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "CK One",
    notas: [
      { nombre: "Almizcle", intensidad: 6, color: "#D3D3D3" },
      { nombre: "Madera", intensidad: 7, color: "#8B4513" }
    ]
  }
];

// GET para obtener un producto por ID
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    // Extraer el id correctamente usando await para cumplir con Next.js 15
    const { id } = await context.params;
    console.log(`Solicitando producto con ID: ${id}`);
    
    // Verificar primero si MONGODB_URI existe
    if (!process.env.MONGODB_URI) {
      console.log('MONGODB_URI no definido, buscando en productos fijos');
      const productoFijo = productosFijos.find(p => p._id === id);
      
      if (productoFijo) {
        return NextResponse.json({ producto: productoFijo }, { status: 200 });
      } else {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }
    }
    
    try {
      await connectToDatabase();
      
      // Intentar buscar en MongoDB primero
      const producto = await Producto.findById(id);
      
      if (producto) {
        return NextResponse.json({ producto }, { status: 200 });
      }
      
      // Si no hay resultado en MongoDB, buscar en productos fijos
      const productoFijo = productosFijos.find(p => p._id === id);
      
      if (productoFijo) {
        return NextResponse.json({ 
          producto: productoFijo,
          source: 'demo'
        }, { status: 200 });
      }
      
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    } catch (mongoError) {
      console.error('Error específico de MongoDB:', mongoError);
      
      // Intentar con producto fijo como fallback
      const productoFijo = productosFijos.find(p => p._id === id);
      
      if (productoFijo) {
        return NextResponse.json({ 
          producto: productoFijo,
          error: 'Error de base de datos, mostrando producto de demostración.'
        }, { status: 200 });
      }
      
      throw mongoError; // Re-lanzar para el manejador general
    }
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

// PUT para actualizar un producto
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    // Extraer el id correctamente usando await para cumplir con Next.js 15
    const { id } = await context.params;
    
    const body = await request.json();
    
    await connectToDatabase();
    
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      {
        nombre: body.nombre,
        categoria: body.categoria,
        precio: body.precio,
        stock: body.stock,
        descripcion: body.descripcion,
        imagen: body.imagen || 'https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg',
        inspirado_en: body.inspirado_en,
        notas: body.notas || []
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

// DELETE para eliminar un producto
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    // Extraer el id correctamente usando await para cumplir con Next.js 15
    const { id } = await context.params;
    
    await connectToDatabase();
    
    const productoEliminado = await Producto.findByIdAndDelete(id);
    
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