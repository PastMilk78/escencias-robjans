import mongoose from 'mongoose';

const ResenaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor ingrese el nombre'],
  },
  comentario: {
    type: String,
    required: [true, 'Por favor ingrese el comentario'],
  },
  puntuacion: {
    type: Number,
    required: [true, 'Por favor ingrese la puntuación'],
    min: 1,
    max: 5,
  },
  fecha: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

export default mongoose.models.Resena || mongoose.model('Resena', ResenaSchema); 