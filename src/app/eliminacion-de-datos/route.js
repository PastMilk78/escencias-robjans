import { NextResponse } from 'next/server';

export async function GET() {
  // Redirigir a la página de eliminación de datos
  return NextResponse.rewrite(new URL('/eliminacion-de-datos', 'https://escencias-robjans.vercel.app'));
} 