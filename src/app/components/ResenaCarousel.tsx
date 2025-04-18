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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
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

  // Para crear el efecto de desplazamiento continuo
  useEffect(() => {
    if (resenas.length === 0 || !carouselRef.current) return;
    
    // Duplicar las reseñas para crear efecto infinito
    const resenasContainer = carouselRef.current;
    const resenasHeight = resenasContainer.scrollHeight / 2; // Altura de las reseñas originales
    
    const scrollSpeed = 0.5; // velocidad de desplazamiento (píxeles por frame)
    let animationFrameId: number;
    
    const animate = () => {
      // Incrementar la posición de desplazamiento
      setScrollPosition(prevPosition => {
        const newPosition = prevPosition + scrollSpeed;
        
        // Si hemos desplazado la altura completa, volver al inicio
        if (newPosition >= resenasHeight) {
          return 0;
        }
        
        return newPosition;
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [resenas, carouselRef.current]);
  
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

  // Duplicar las reseñas para crear el efecto infinito
  const resenasInfinitas = [...resenas, ...resenas];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative w-full max-w-3xl mx-auto h-[500px] overflow-hidden bg-[#6b5b4e] rounded-lg border-2 border-[#fed856]">
        {/* Contenedor del carrusel vertical con desplazamiento continuo */}
        <div
          ref={carouselRef}
          className="absolute w-full"
          style={{
            transform: `translateY(-${scrollPosition}px)`,
          }}
        >
          {/* Primera serie de reseñas */}
          {resenasInfinitas.map((resena, index) => (
            <div
              key={`${resena._id}-${index}`}
              className="p-5 m-4 rounded-xl bg-gradient-to-r from-[#473f3f] to-[#312b2b] border-2 border-[#fed856] shadow-lg"
            >
              <div className="flex flex-col">
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {renderEstrellas(resena.puntuacion)}
                  </div>
                </div>
                <p className="text-[#f8f1d8] mb-4 font-raleway italic">
                  "{resena.comentario}"
                </p>
                <div className="mt-auto">
                  <p className="text-[#fed856] font-bold font-raleway">
                    {resena.nombre}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 