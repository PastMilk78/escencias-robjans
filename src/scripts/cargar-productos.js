// Script para cargar productos en MongoDB
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Conexión a MongoDB
const conectarMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexión a MongoDB establecida');
    return true;
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
    return false;
  }
};

// Definición del esquema y modelo
const NotaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  intensidad: { type: Number, required: true, min: 1, max: 10 },
  color: { type: String, required: true }
});

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true, enum: ['Mujer', 'Hombre', 'Unisex'] },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  descripcion: { type: String, required: true },
  imagen: { type: String, default: '/placeholder.jpg' },
  inspirado_en: { type: String },
  notas: [NotaSchema],
  fecha_creacion: { type: Date, default: Date.now },
  fecha_actualizacion: { type: Date, default: Date.now }
});

const Producto = mongoose.model('Producto', ProductoSchema);

// Datos de ejemplo para productos
const productosEjemplo = [
  {
    nombre: "Perfume Floral",
    categoria: "Mujer",
    precio: 850,
    stock: 20,
    descripcion: "Fragancia floral con notas de jazmín y rosa. Ideal para uso diario.",
    imagen: "/images/perfume-destacado.jpg",
    inspirado_en: "J'adore",
    notas: [
      { nombre: "Jazmín", intensidad: 8, color: "#FFD700" },
      { nombre: "Rosa", intensidad: 7, color: "#FF69B4" },
      { nombre: "Vainilla", intensidad: 5, color: "#F5DEB3" }
    ]
  },
  {
    nombre: "Aroma Intenso",
    categoria: "Hombre",
    precio: 780,
    stock: 15,
    descripcion: "Fragancia amaderada con notas de sándalo y vetiver. Perfecta para ocasiones especiales.",
    imagen: "/images/perfume-destacado.jpg",
    inspirado_en: "Sauvage",
    notas: [
      { nombre: "Sándalo", intensidad: 9, color: "#8B4513" },
      { nombre: "Vetiver", intensidad: 7, color: "#556B2F" },
      { nombre: "Pimienta", intensidad: 6, color: "#2F4F4F" }
    ]
  },
  {
    nombre: "Esencia Fresca",
    categoria: "Unisex",
    precio: 720,
    stock: 25,
    descripcion: "Fragancia cítrica y refrescante con notas de limón y bergamota. Ideal para climas cálidos.",
    imagen: "/images/perfume-destacado.jpg",
    inspirado_en: "CK One",
    notas: [
      { nombre: "Limón", intensidad: 8, color: "#FFFF00" },
      { nombre: "Bergamota", intensidad: 7, color: "#ADFF2F" },
      { nombre: "Lavanda", intensidad: 5, color: "#E6E6FA" }
    ]
  },
  {
    nombre: "Aroma Seductor",
    categoria: "Mujer",
    precio: 920,
    stock: 10,
    descripcion: "Fragancia oriental con notas de ámbar y almizcle. Perfecta para la noche.",
    imagen: "/images/perfume-destacado.jpg",
    inspirado_en: "Black Opium",
    notas: [
      { nombre: "Ámbar", intensidad: 9, color: "#DAA520" },
      { nombre: "Almizcle", intensidad: 8, color: "#D2691E" },
      { nombre: "Vainilla", intensidad: 7, color: "#F5DEB3" }
    ]
  }
];

// Función para cargar productos en la base de datos
const cargarProductos = async () => {
  // Conectar a MongoDB
  const conectado = await conectarMongoDB();
  if (!conectado) {
    process.exit(1);
  }

  try {
    // Eliminar productos existentes (opcional)
    await Producto.deleteMany({});
    console.log('Colección de productos limpiada');

    // Insertar nuevos productos
    const resultado = await Producto.insertMany(productosEjemplo);
    console.log(`${resultado.length} productos insertados con éxito`);
    console.log('IDs de productos:');
    resultado.forEach(prod => {
      console.log(`- ${prod._id}: ${prod.nombre}`);
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
  } finally {
    // Cerrar conexión
    await mongoose.disconnect();
    console.log('Conexión a MongoDB cerrada');
  }
};

// Ejecutar la función
cargarProductos(); 