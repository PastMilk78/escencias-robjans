"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Nota = {
  nombre: string;
  intensidad: number;
  color: string;
};

type Producto = {
  _id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagen: string;
  inspirado_en: string;
  notas: Nota[];
};

interface ProductoCardProps {
  producto: Producto;
  onOpenModal: (id: string) => void;
}

const ProductoCard = ({ producto, onOpenModal }: ProductoCardProps) => {
  return (
    <div 
      key={producto._id}
      className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-[#fed856]"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={producto.imagen || "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg"}
          alt={producto.nombre}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-0 right-0 bg-[#fed856] text-[#312b2b] px-3 py-1 m-2 rounded-full font-bold font-raleway">
          ${producto.precio.toFixed(2)}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-2">
          <span className="inline-block bg-[#8c7465] text-white text-xs px-2 py-1 rounded-full font-raleway mr-2">
            {producto.categoria}
          </span>
          <span className="text-sm text-gray-600 font-raleway">
            Inspirado en {producto.inspirado_en}
          </span>
        </div>
        <h2 className="text-xl font-bold text-[#312b2b] mb-4 font-raleway">{producto.nombre}</h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenModal(producto._id)}
            className="bg-[#312b2b] text-[#fed856] px-3 py-2 rounded-md text-sm hover:bg-[#473f3f] transition-colors font-raleway"
          >
            Ver detalles
          </button>
          <button 
            onClick={() => {
              // Crear un evento personalizado para añadir al carrito
              const event = new CustomEvent('add-to-cart', {
                detail: { producto, cantidad: 1 }
              });
              window.dispatchEvent(event);
            }}
            className="bg-[#fed856] text-[#312b2b] px-3 py-2 rounded-md text-sm hover:bg-[#e5c24c] transition-colors border border-[#fed856] font-raleway"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoCard; 