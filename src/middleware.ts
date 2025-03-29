import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Clave de acceso simple para proteger el panel
const ADMIN_PASSWORD = 'escencias2024';

export function middleware(request: NextRequest) {
  // Obtener la ruta actual
  const { pathname } = request.nextUrl;

  // Proteger solo las rutas de administración
  if (pathname.startsWith('/admin')) {
    // Verificar si el usuario está autenticado
    const authCookie = request.cookies.get('admin_auth');
    
    // Si no hay cookie o la cookie no es válida, redirigir al login
    if (!authCookie || authCookie.value !== 'true') {
      // Permitir acceso a la página de login
      if (pathname === '/admin/login') {
        return NextResponse.next();
      }
      
      // Redirigir a login para cualquier otra ruta de admin
      const url = new URL('/admin/login', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  // Permitir el acceso para rutas no protegidas
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 