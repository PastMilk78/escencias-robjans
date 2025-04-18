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
    // Almacenar el ID del producto para el modal en localStorage
    if (action === 'view') {
      localStorage.setItem('selectedProductId', id);
    }
    
    // Redirigir a la página de productos
    router.push('/productos');
  }, [router, id, action]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#594a42] text-white">
      <div className="text-center">
        <p className="text-xl mb-4">Redirigiendo a la galería de productos...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fed856]"></div>
      </div>
    </div>
  );
} 