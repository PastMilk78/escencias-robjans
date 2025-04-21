"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function ProductoDetalleRedirect({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id;
  const action = searchParams.get('action') || 'view';

  useEffect(() => {
    try {
      // Almacenar el ID del producto para el modal en localStorage
      if (action === 'view' && id) {
        console.log("Guardando ID de producto en localStorage:", id);
        // Primero, limpiamos cualquier ID existente
        localStorage.removeItem('selectedProductId');
        // Luego guardamos el nuevo ID
        localStorage.setItem('selectedProductId', id);
        
        // Verificamos que se haya guardado correctamente
        const storedId = localStorage.getItem('selectedProductId');
        console.log("ID guardado verificado:", storedId);
      }
      
      // Timeout más largo para asegurar que localStorage se actualiza antes de la redirección
      setTimeout(() => {
        // Volvemos a verificar
        const storedId = localStorage.getItem('selectedProductId');
        console.log("ID antes de redirección:", storedId);
        
        // Redirigir a la página de productos
        router.push('/productos');
      }, 500);
    } catch (error) {
      console.error("Error al guardar ID de producto:", error);
      // Asegurar que la redirección ocurra incluso si hay un error
      router.push('/productos');
    }
  }, [router, id, action]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#594a42] text-white">
      <div className="text-center">
        <p className="text-xl mb-4 font-raleway">Cargando detalles del producto...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fed856]"></div>
      </div>
    </div>
  );
} 