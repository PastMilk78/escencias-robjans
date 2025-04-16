"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Header from '@/app/components/Header';

function OrderDetails() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // En una implementación completa, aquí haríamos una petición al backend
    // para verificar la sesión de pago y obtener detalles del pedido
    
    // Simulamos una carga para una mejor experiencia de usuario
    const timer = setTimeout(() => {
      setOrderInfo({
        id: sessionId || 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        status: 'completado',
        date: new Date().toLocaleDateString()
      });
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 border-2 border-[#fed856]">
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#fed856]"></div>
          <p className="mt-4 text-lg text-gray-600 font-raleway">Confirmando su pedido...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-[#312b2b] mb-4 font-raleway">¡Gracias por su compra!</h1>
          <p className="text-lg text-gray-600 mb-8 font-raleway">
            Su pedido ha sido recibido y está siendo procesado. Le enviaremos una confirmación por correo electrónico en breve.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-[#312b2b] font-raleway">Detalles del pedido</h2>
            <p className="text-gray-600 font-raleway mb-2">
              <span className="font-medium">Número de Pedido:</span> {orderInfo.id}
            </p>
            <p className="text-gray-600 font-raleway mb-2">
              <span className="font-medium">Estado:</span> {orderInfo.status}
            </p>
            <p className="text-gray-600 font-raleway">
              <span className="font-medium">Fecha:</span> {orderInfo.date}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/productos"
              className="bg-[#fed856] text-[#312b2b] px-6 py-3 rounded-md font-bold hover:bg-[#e5c24c] transition-colors font-raleway"
            >
              Continuar Comprando
            </Link>
            <Link 
              href="/#contacto"
              className="bg-[#312b2b] text-white px-6 py-3 rounded-md font-bold hover:bg-[#473f3f] transition-colors font-raleway"
            >
              Contacto
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de carga fallback para Suspense
function OrderLoading() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 border-2 border-[#fed856]">
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#fed856]"></div>
        <p className="mt-4 text-lg text-gray-600 font-raleway">Cargando información del pedido...</p>
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen flex flex-col bg-[#594a42]">
      <Header />
      
      <main className="flex-grow container mx-auto py-20 px-4">
        <Suspense fallback={<OrderLoading />}>
          <OrderDetails />
        </Suspense>
      </main>
      
      <footer className="bg-[#312b2b] text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#f8f1d8] font-raleway">
            &copy; {new Date().getFullYear()} Escencias Robjan&apos;s. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
} 