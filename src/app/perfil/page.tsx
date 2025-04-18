"use client";

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PerfilPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };
  
  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fed856]"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#473f3f] to-[#312b2b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-[#6b5b4e] p-8 rounded-xl border-2 border-[#fed856] shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#fed856] font-raleway">
            Mi Perfil
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-[#fed856]">
            {session?.user?.image ? (
              <Image 
                src={session.user.image} 
                alt="Foto de perfil"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#594a42] text-[#f8f1d8]">
                <span className="text-4xl font-bold">
                  {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#f8f1d8] mb-2">
              {session?.user?.name}
            </h2>
            <p className="text-[#a39a8e] mb-4">
              {session?.user?.email}
            </p>
            <p className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#fed856] text-[#312b2b]">
              {session?.user?.role === 'admin' ? 'Administrador' : 'Cliente'}
            </p>
          </div>
        </div>
        
        <div className="border-t border-[#594a42] pt-6">
          <h3 className="text-xl font-bold text-[#f8f1d8] mb-4 font-raleway">
            Opciones de cuenta
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => router.push('/pedidos')}
              className="w-full p-4 bg-[#594a42] hover:bg-[#6d5a50] text-[#f8f1d8] rounded-md transition-colors flex items-center justify-between"
            >
              <span>Mis Pedidos</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button 
              onClick={() => router.push('/actualizar-perfil')}
              className="w-full p-4 bg-[#594a42] hover:bg-[#6d5a50] text-[#f8f1d8] rounded-md transition-colors flex items-center justify-between"
            >
              <span>Actualizar Perfil</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button 
              onClick={() => router.push('/cambiar-contrasena')}
              className="w-full p-4 bg-[#594a42] hover:bg-[#6d5a50] text-[#f8f1d8] rounded-md transition-colors flex items-center justify-between"
            >
              <span>Cambiar Contraseña</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button 
              onClick={() => router.push('/direcciones')}
              className="w-full p-4 bg-[#594a42] hover:bg-[#6d5a50] text-[#f8f1d8] rounded-md transition-colors flex items-center justify-between"
            >
              <span>Mis Direcciones</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="mt-8">
            <button
              onClick={handleSignOut}
              className="w-full py-3 px-4 border border-transparent text-sm font-bold rounded-md text-[#312b2b] bg-[#fed856] hover:bg-[#e5c24c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#fed856] font-raleway"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 