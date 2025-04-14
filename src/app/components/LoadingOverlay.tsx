"use client";

import { useState, useEffect } from "react";

export default function LoadingOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular un tiempo de carga mínimo para evitar parpadeos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Force hidden overflow durante la carga
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div 
      className="fixed inset-0 bg-[#8e3b00] z-[100] flex items-center justify-center transition-opacity duration-500"
      style={{ 
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? 'auto' : 'none'
      }}
    >
      <div className="text-center">
        <img 
          src="https://i.postimg.cc/T3QxB7Tv/logo-escencias.jpg"
          alt="Logo Escencias Robjans"
          className="h-32 w-auto rounded-2xl shadow-lg mb-8 animate-pulse"
        />
        <div className="w-16 h-16 border-4 border-t-[#fed856] border-r-[#fed856] border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
} 