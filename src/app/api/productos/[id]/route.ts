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

// Definir el tipo para parámetros
interface Params {
  id: string;
}

// GET para obtener un producto por ID
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  
  try {
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
    
    await connectToDatabase();
    
    // Para IDs válidos en MongoDB
    let producto;
    
    try {
      // Intentar buscar en MongoDB primero
      producto = await Producto.findById(id);
    } catch (error) {
      console.log('Error al buscar por ID en MongoDB, verificando productos fijos');
      // Si hay error (por ejemplo, ID no válido), buscar en productos fijos
      const productoFijo = productosFijos.find(p => p._id === id);
      
      if (productoFijo) {
        return NextResponse.json({ producto: productoFijo }, { status: 200 });
      }
    }
    
    if (!producto) {
      // Si no se encuentra en MongoDB, intentar buscar en productos fijos
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
    
    return NextResponse.json({ producto }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    
    // En caso de error, intentar con productos fijos
    const productoFijo = productosFijos.find(p => p._id === id);
      
    if (productoFijo) {
      return NextResponse.json(
        { 
          producto: productoFijo,
          error: 'Error al obtener producto desde MongoDB. Mostrando producto de demostración.'
        }, 
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Error al obtener producto' },
        { status: 500 }
      );
    }
  }
}

// PUT para actualizar un producto
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  
  try {
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
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  
  try {
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