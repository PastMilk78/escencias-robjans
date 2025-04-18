"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

type Resena = {
  _id: string;
  nombre: string;
  comentario: string;
  puntuacion: number;
  fecha: string;
};

export default function ResenaCarousel() {
  const { data: session } = useSession();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Estado para el formulario de nuevas reseñas
  const [formResena, setFormResena] = useState({
    nombre: '',
    comentario: '',
    puntuacion: 5
  });
  const [enviando, setEnviando] = useState(false);
  const [mensajeEnvio, setMensajeEnvio] = useState<{exito: boolean, mensaje: string} | null>(null);
  
  useEffect(() => {
    const fetchResenas = async () => {
      try {
        const response = await fetch('/api/resenas');
        if (!response.ok) {
          throw new Error('Error al cargar reseñas');
        }
        const data = await response.json();
        
        // Si no hay reseñas en la base de datos, usar reseñas de ejemplo
        let resenasData = data.resenas && data.resenas.length > 0 
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
            
        // Aleatorizar el orden de las reseñas
        resenasData = shuffleArray([...resenasData]);
        
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

  // Función para aleatorizar un array (algoritmo Fisher-Yates)
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Para crear el efecto de desplazamiento continuo
  useEffect(() => {
    if (resenas.length === 0 || !carouselRef.current) return;
    
    // Duplicar las reseñas para crear efecto infinito
    const resenasContainer = carouselRef.current;
    const resenasHeight = resenasContainer.scrollHeight / 2; // Altura de las reseñas originales
    
    const scrollSpeed = 0.25; // velocidad de desplazamiento más lenta (píxeles por frame)
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
  
  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormResena({
      ...formResena,
      [name]: value
    });
  };
  
  // Manejar cambio de puntuación
  const handlePuntuacionChange = (valor: number) => {
    setFormResena({
      ...formResena,
      puntuacion: valor
    });
  };
  
  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      setMensajeEnvio({
        exito: false,
        mensaje: 'Debes iniciar sesión para publicar una reseña'
      });
      return;
    }
    
    // Validaciones
    if (!formResena.nombre.trim()) {
      setMensajeEnvio({
        exito: false,
        mensaje: 'Por favor, ingresa tu nombre'
      });
      return;
    }
    
    if (!formResena.comentario.trim()) {
      setMensajeEnvio({
        exito: false,
        mensaje: 'Por favor, ingresa tu comentario'
      });
      return;
    }
    
    setEnviando(true);
    setMensajeEnvio(null);
    
    try {
      const response = await fetch('/api/resenas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formResena)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la reseña');
      }
      
      // Éxito
      setMensajeEnvio({
        exito: true,
        mensaje: '¡Gracias por tu comentario! Aparecerá en el carrusel pronto.'
      });
      
      // Limpiar formulario
      setFormResena({
        nombre: '',
        comentario: '',
        puntuacion: 5
      });
      
      // Recargar reseñas después de 2 segundos
      setTimeout(async () => {
        try {
          const resenasResponse = await fetch('/api/resenas');
          const resenasData = await resenasResponse.json();
          
          if (resenasData.resenas && resenasData.resenas.length > 0) {
            setResenas(shuffleArray([...resenasData.resenas]));
          }
        } catch (err) {
          console.error('Error al recargar reseñas:', err);
        }
      }, 2000);
      
    } catch (err) {
      setMensajeEnvio({
        exito: false,
        mensaje: err instanceof Error ? err.message : 'Error al enviar la reseña'
      });
    } finally {
      setEnviando(false);
    }
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

  // Duplicar las reseñas para crear el efecto infinito
  const resenasInfinitas = [...resenas, ...resenas];

  return (
    <div className="max-w-5xl mx-auto relative">
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
      
      {/* Formulario para dejar una reseña */}
      <div className="mt-12 mb-12 w-full max-w-3xl mx-auto bg-gradient-to-r from-[#473f3f] to-[#312b2b] p-8 rounded-lg border-2 border-[#fed856] shadow-xl">
        <h3 className="text-2xl font-bold text-[#fed856] mb-6 text-center font-raleway">
          ¡Déjanos tu opinión!
        </h3>
        
        {!session ? (
          <div className="text-center p-6 bg-[#594a42] rounded-lg border border-[#fed856] mb-4">
            <p className="text-[#f8f1d8] mb-4 font-raleway">
              Para dejar una reseña, por favor inicia sesión o regístrate
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/login" 
                className="bg-[#fed856] text-[#312b2b] px-6 py-3 rounded-full font-bold hover:bg-white transition-colors font-raleway transform hover:scale-105 transition-transform shadow-lg"
              >
                INICIAR SESIÓN
              </Link>
              <Link 
                href="/registro" 
                className="bg-white text-[#312b2b] px-6 py-3 rounded-full font-bold hover:bg-[#fed856] transition-colors font-raleway transform hover:scale-105 transition-transform shadow-lg"
              >
                REGISTRARSE
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block mb-2 text-[#f8f1d8] font-raleway">
                Tu nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formResena.nombre}
                onChange={handleInputChange}
                className="w-full bg-[#594a42] border border-[#fed856] rounded-md p-3 text-[#f8f1d8] placeholder-[#a39a8e] focus:outline-none focus:ring-2 focus:ring-[#fed856]"
                placeholder="Escribe tu nombre aquí"
              />
            </div>
            
            <div>
              <label htmlFor="comentario" className="block mb-2 text-[#f8f1d8] font-raleway">
                Tu comentario
              </label>
              <textarea
                id="comentario"
                name="comentario"
                value={formResena.comentario}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-[#594a42] border border-[#fed856] rounded-md p-3 text-[#f8f1d8] placeholder-[#a39a8e] focus:outline-none focus:ring-2 focus:ring-[#fed856]"
                placeholder="Comparte tu experiencia con nosotros..."
              ></textarea>
            </div>
            
            <div>
              <p className="block mb-2 text-[#f8f1d8] font-raleway">
                Tu puntuación
              </p>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => handlePuntuacionChange(valor)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg 
                      className={`w-8 h-8 ${formResena.puntuacion >= valor ? 'text-[#fed856]' : 'text-gray-400'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className={`w-full bg-[#fed856] text-[#312b2b] font-bold py-3 px-4 rounded-md hover:bg-[#e5c24c] transition-colors duration-300 font-raleway ${
                  enviando ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={enviando}
              >
                {enviando ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#312b2b]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Enviar Comentario'
                )}
              </button>
            </div>
          </form>
        )}
        
        {mensajeEnvio && (
          <div 
            className={`p-4 rounded-md mt-4 ${
              mensajeEnvio.exito ? 'bg-green-700 text-[#f8f1d8]' : 'bg-red-700 text-[#f8f1d8]'
            }`}
          >
            {mensajeEnvio.mensaje}
          </div>
        )}
      </div>
    </div>
  );
} 