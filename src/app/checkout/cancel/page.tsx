"use client";

import Link from 'next/link';
import Header from '@/app/components/Header';

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen flex flex-col bg-[#594a42]">
      <Header />
      
      <main className="flex-grow container mx-auto py-20 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8 border-2 border-[#fed856]">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-[#312b2b] mb-4 font-raleway">Orden Cancelada</h1>
            <p className="text-lg text-gray-600 mb-8 font-raleway">
              Su proceso de compra ha sido cancelado. Si experimentó algún problema durante el proceso de pago, no dude en contactarnos.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/productos"
                className="bg-[#fed856] text-[#312b2b] px-6 py-3 rounded-md font-bold hover:bg-[#e5c24c] transition-colors font-raleway"
              >
                Volver a Productos
              </Link>
              <Link 
                href="#contacto"
                className="bg-[#312b2b] text-white px-6 py-3 rounded-md font-bold hover:bg-[#473f3f] transition-colors font-raleway"
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
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