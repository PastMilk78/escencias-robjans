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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rotateDegree, setRotateDegree] = useState(0);
  const ruletaRef = useRef<HTMLDivElement>(null);
  
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
      girarRuleta();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [resenas, currentIndex]);
  
  // Función para girar la ruleta
  const girarRuleta = () => {
    if (resenas.length <= 1) return;
    
    const nextIndex = (currentIndex + 1) % resenas.length;
    const rotationAmount = 360 / resenas.length;
    
    // Actualizar la rotación
    setRotateDegree(prevDegree => prevDegree - rotationAmount);
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

  return (
    <div className="relative w-full max-w-5xl mx-auto py-12">
      {/* Indicador de la ruleta */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-12 z-10">
        <div className="w-0 h-0 mx-auto border-l-[15px] border-r-[15px] border-b-[20px] border-l-transparent border-r-transparent border-b-[#fed856]"></div>
      </div>
      
      {/* Contenedor de la ruleta */}
      <div className="relative w-full h-80 overflow-hidden">
        <div 
          ref={ruletaRef}
          className="absolute w-full h-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `rotate(${rotateDegree}deg)` }}
        >
          {resenas.map((resena, index) => {
            // Calcular la posición de cada reseña en la ruleta
            const angle = (360 / resenas.length) * index;
            return (
              <div 
                key={resena._id}
                className="absolute top-0 left-0 w-full h-full flex justify-center"
                style={{ 
                  transform: `rotate(${angle}deg) translateY(-42%)`,
                  transformOrigin: 'center 150%'
                }}
              >
                <div 
                  className={`
                    w-3/4 p-6 rounded-lg shadow-xl transform 
                    ${currentIndex === index ? 'scale-100 opacity-100' : 'scale-90 opacity-40'}
                    transition-all duration-500 ease-in-out
                    bg-gradient-to-r from-[#473f3f] to-[#312b2b] border-2 border-[#fed856]
                  `}
                  style={{ transform: `rotate(-${rotateDegree + angle}deg)` }}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-3">
                      <div className="flex mr-2">
                        {renderEstrellas(resena.puntuacion)}
                      </div>
                    </div>
                    <p className="text-[#f8f1d8] mb-4 font-raleway italic">"{resena.comentario}"</p>
                    <div className="mt-auto">
                      <p className="text-[#fed856] font-bold font-raleway">{resena.nombre}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Controles manuales */}
      <div className="flex justify-center space-x-4 mt-8">
        <button 
          onClick={girarRuleta}
          className="bg-[#fed856] text-[#312b2b] px-6 py-2 rounded-full hover:bg-[#e5c24c] transition-colors font-bold flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Girar
        </button>
      </div>
    </div>
  );
} 