import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    // Validaciones básicas
    if (!name || !email || !password) {
      return NextResponse.json({ 
        message: "Todos los campos son obligatorios" 
      }, { status: 400 });
    }
    
    if (password.length < 8) {
      return NextResponse.json({ 
        message: "La contraseña debe tener al menos 8 caracteres" 
      }, { status: 400 });
    }
    
    // Conectar a la base de datos
    await connectToDB();
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json({ 
        message: "El correo electrónico ya está registrado" 
      }, { status: 409 });
    }
    
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Crear el usuario
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user"
    });
    
    // Eliminar la contraseña del objeto de respuesta por seguridad
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    return NextResponse.json({ 
      message: "Usuario registrado exitosamente",
      user: userWithoutPassword
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error en API de registro:", error);
    return NextResponse.json({ 
      message: "Error al registrar el usuario" 
    }, { status: 500 });
  }
} 