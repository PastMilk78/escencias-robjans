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

// GET para obtener todos los productos
export async function GET() {
  try {
    // Verificar primero si MONGODB_URI existe
    if (!process.env.MONGODB_URI) {
      console.log('MONGODB_URI no definido, usando productos fijos');
      return NextResponse.json({ productos: productosFijos }, { status: 200 });
    }
    
    await connectToDatabase();
    
    const productos = await Producto.find({}).sort({ fecha_creacion: -1 });
    
    // Si no hay productos, devolver los fijos
    if (!productos || productos.length === 0) {
      console.log('No se encontraron productos en MongoDB, usando productos fijos');
      return NextResponse.json({ productos: productosFijos }, { status: 200 });
    }
    
    return NextResponse.json({ productos }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    
    // En caso de error, devolver productos fijos
    return NextResponse.json(
      { 
        productos: productosFijos,
        error: 'Error al obtener productos desde MongoDB. Mostrando productos de demostración.'
      },
      { status: 200 }
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
      imagen: body.imagen || 'https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg',
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