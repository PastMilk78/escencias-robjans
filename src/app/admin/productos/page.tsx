"use client";

import { Suspense } from 'react';
import ProductosAdminContent from './ProductosAdminContent';

function Fallback() {
  return (
    <div className="min-h-screen flex flex-col bg-[#594a42] justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <p className="text-xl text-[#312b2b] font-raleway">Cargando panel de administración...</p>
      </div>
    </div>
  );
}

export default function ProductosAdminPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <ProductosAdminContent />
    </Suspense>
  );
} 