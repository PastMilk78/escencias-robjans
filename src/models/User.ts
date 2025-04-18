import mongoose, { Schema, models } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
}, { timestamps: true });

// Si el modelo ya existe, usarlo; de lo contrario, crearlo
const User = models.User || mongoose.model('User', userSchema);

export default User; 