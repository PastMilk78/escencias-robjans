"use client";

import { useState, useEffect, useRef } from 'react';

type Resena = {
  _id: string;
  nombre: string;
  comentario: string;
  puntuacion: number;
  fecha: string;
};

export default function ResenaCarousel() {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchResenas = async () => {
      try {
        const response = await fetch('/api/resenas');
        if (!response.ok) {
          throw new Error('Error al cargar reseñas');
        }
        const data = await response.json();
        
        // Si no hay reseñas en la base de datos, usar reseñas de ejemplo
        const resenasData = data.resenas && data.resenas.length > 0 
          ? data.resenas 
          : [
              {
                _id: '1',
                nombre: 'María López',
                comentario: 'Las fragancias son increíbles, duran todo el día y tienen un aroma idéntico a las originales.',
                puntuacion: 5,
                fecha: new Date().toISOString()
              },
              {
                _id: '2',
                nombre: 'Juan Pérez',
                comentario: 'Excelente calidad y precio. El servicio al cliente es excepcional, muy recomendado.',
                puntuacion: 5,
                fecha: new Date().toISOString()
              },
              {
                _id: '3',
                nombre: 'Ana González',
                comentario: 'Me encantó la fragancia inspirada en One Million, es prácticamente idéntica y dura varias horas.',
                puntuacion: 4,
                fecha: new Date().toISOString()
              },
              {
                _id: '4',
                nombre: 'Carlos Ramírez',
                comentario: 'Servicio rápido y atención personalizada. Las fragancias son de muy buena calidad.',
                puntuacion: 5,
                fecha: new Date().toISOString()
              },
              {
                _id: '5',
                nombre: 'Laura Martínez',
                comentario: 'La mejor tienda de perfumes en Dolores Hidalgo. Precios accesibles y gran variedad.',
                puntuacion: 5,
                fecha: new Date().toISOString()
              }
            ];
            
        setResenas(resenasData);
      } catch (err) {
        setError('Error al cargar las reseñas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResenas();
  }, []);

  // Rotación automática cada 5 segundos
  useEffect(() => {
    if (resenas.length === 0) return;
    
    const interval = setInterval(() => {
      rotarReseñasHaciaArriba();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [resenas, currentIndex]);
  
  // Función para rotar las reseñas hacia arriba
  const rotarReseñasHaciaArriba = () => {
    if (resenas.length <= 1) return;
    
    const nextIndex = (currentIndex + 1) % resenas.length;
    setCurrentIndex(nextIndex);
  };
  
  // Renderizar estrellas según la puntuación
  const renderEstrellas = (puntuacion: number) => {
    const estrellas = [];
    for (let i = 0; i < 5; i++) {
      if (i < puntuacion) {
        estrellas.push(
          <svg key={i} className="w-5 h-5 text-[#fed856]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        );
      } else {
        estrellas.push(
          <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        );
      }
    }
    return estrellas;
  };

  // Obtener el array de reseñas reorganizado para mostrar la reseña actual en el centro
  const getReorganizedResenas = () => {
    if (resenas.length === 0) return [];
    
    // Crear una copia del array para no modificar el original
    let reorganized = [...resenas];
    
    // Reorganizar el array para que la reseña actual esté en el centro
    const currentIndexPosition = 2; // Posición del elemento actual (centro en un grupo de 4-5 elementos)
    
    // Desplazar el array para que el elemento actual esté en la posición central
    const offset = (currentIndex - currentIndexPosition + reorganized.length) % reorganized.length;
    reorganized = [
      ...reorganized.slice(offset),
      ...reorganized.slice(0, offset)
    ];
    
    return reorganized;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fed856]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (resenas.length === 0) {
    return <div className="text-center py-8">No hay reseñas disponibles</div>;
  }

  const reorganizedResenas = getReorganizedResenas();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative flex flex-col items-center">
        {/* Flecha indicadora arriba */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 z-10 text-[#fed856]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </div>
        
        {/* Contenedor del carrusel vertical */}
        <div
          ref={carouselRef}
          className="flex flex-col space-y-4 py-8 w-full max-w-3xl mx-auto"
        >
          {reorganizedResenas.slice(0, 4).map((resena, index) => {
            const isActive = index === 1; // El segundo elemento (índice 1) es el "activo"
            const colorClasses = [
              "bg-[#f03b3b] border-[#d32f2f]", // Rojo
              "bg-[#ff9800] border-[#f57c00]", // Naranja
              "bg-[#ffd700] border-[#fbc02d]", // Amarillo
              "bg-[#3f51b5] border-[#303f9f]", // Azul
            ];
            
            return (
              <div
                key={resena._id}
                className={`
                  transition-all duration-700 ease-in-out
                  ${colorClasses[index]} 
                  ${isActive 
                    ? 'scale-105 z-10 opacity-100 shadow-xl' 
                    : 'scale-95 opacity-85 shadow-md'
                  }
                  p-5 rounded-xl border-2 transform
                `}
              >
                <div className="flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="flex mr-2">
                      {renderEstrellas(resena.puntuacion)}
                    </div>
                  </div>
                  <p className={`${isActive ? 'text-white' : 'text-gray-900'} mb-4 font-raleway italic`}>
                    "{resena.comentario}"
                  </p>
                  <div className="mt-auto">
                    <p className={`${isActive ? 'text-white font-bold' : 'text-gray-900 font-medium'} font-raleway`}>
                      {resena.nombre}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Flecha indicadora abajo */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-6 z-10 text-[#fed856]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
          </svg>
        </div>
      </div>
      
      {/* Controles manuales */}
      <div className="flex justify-center space-x-4 mt-16">
        <button 
          onClick={rotarReseñasHaciaArriba}
          className="bg-[#fed856] text-[#312b2b] px-6 py-2 rounded-full hover:bg-[#e5c24c] transition-colors font-bold flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Siguiente
        </button>
      </div>
    </div>
  );
} 