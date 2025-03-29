"use client";

import { Suspense } from "react";
import ProductosAdminContent from './ProductosAdminContent';

// Componente envoltorio con Suspense
export default function ProductosAdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f1d8]">
        <p className="text-[#312b2b] text-xl font-raleway">Cargando...</p>
      </div>
    }>
      <ProductosAdminContent />
    </Suspense>
  );
} 