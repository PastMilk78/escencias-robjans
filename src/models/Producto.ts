import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para las notas
export interface INota {
  nombre: string;
  intensidad: number;
  color: string;
}

// Interfaz para el producto
export interface IProducto extends Document {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagen: string;
  inspirado_en: string;
  notas: INota[];
  fecha_creacion: Date;
  fecha_actualizacion: Date;
}

// Schema para las notas
const NotaSchema = new Schema<INota>({
  nombre: { type: String, required: true },
  intensidad: { type: Number, required: true, min: 1, max: 10 },
  color: { type: String, required: true }
});

// Schema para el producto
const ProductoSchema = new Schema<IProducto>({
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

// Crear modelo (o usar el existente si ya está definido)
const Producto = mongoose.models.Producto || mongoose.model<IProducto>('Producto', ProductoSchema);

export default Producto; 