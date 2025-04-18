"use client";

import { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Tipos
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

// Componente para renderizar el gráfico de notas
const GraficoNotas = ({ notas }: { notas: Nota[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current || notas.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configuración
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    // Dibujar los ejes de cada nota
    const totalNotas = notas.length;
    const angleStep = (Math.PI * 2) / totalNotas;
    
    // Dibujar círculos concéntricos para referencia
    const maxIntensidad = 10;
    for (let i = 1; i <= maxIntensidad; i++) {
      const radiusStep = (radius / maxIntensidad) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radiusStep, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.stroke();
    }
    
    // Dibujar ejes
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
    ctx.beginPath();
    for (let i = 0; i < totalNotas; i++) {
      const angle = i * angleStep - Math.PI / 2; // Comenzar desde arriba
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      
      // Dibujar nombres de las notas
      ctx.font = '12px Raleway';
      ctx.fillStyle = '#312b2b';
      const textX = centerX + (radius + 15) * Math.cos(angle);
      const textY = centerY + (radius + 15) * Math.sin(angle);
      ctx.textAlign = angle > Math.PI / 2 && angle < Math.PI * 3/2 ? 'right' : 'left';
      ctx.textBaseline = angle > 0 && angle < Math.PI ? 'top' : 'bottom';
      ctx.fillText(notas[i].nombre, textX, textY);
    }
    ctx.stroke();
    
    // Dibujar polígono de intensidades
    ctx.beginPath();
    for (let i = 0; i < totalNotas; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const intensidad = notas[i].intensidad;
      const pointRadius = (radius / maxIntensidad) * intensidad;
      const x = centerX + pointRadius * Math.cos(angle);
      const y = centerY + pointRadius * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(254, 216, 86, 0.4)';
    ctx.fill();
    ctx.strokeStyle = '#fed856';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Dibujar puntos en cada vértice con su color
    for (let i = 0; i < totalNotas; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const intensidad = notas[i].intensidad;
      const pointRadius = (radius / maxIntensidad) * intensidad;
      const x = centerX + pointRadius * Math.cos(angle);
      const y = centerY + pointRadius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = notas[i].color;
      ctx.strokeStyle = '#312b2b';
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
    }
  }, [notas]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={500} 
      height={500} 
      className="mx-auto border border-[#fed856] rounded-lg bg-white"
    />
  );
};

// Componente principal de detalle
function DetalleProductoContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar producto desde la API
  const cargarProducto = async (id: string) => {
    setCargando(true);
    setError(null);
    
    try {
      const respuesta = await fetch(`/api/productos/${id}`);
      
      if (!respuesta.ok) {
        if (respuesta.status === 404) {
          throw new Error('Producto no encontrado');
        }
        throw new Error('Error al cargar el producto');
      }
      
      const datos = await respuesta.json();
      setProducto(datos.producto);
    } catch (err: Error | unknown) {
      console.error('Error al obtener producto:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el producto');
    } finally {
      setCargando(false);
    }
  };
  
  useEffect(() => {
    if (idParam) {
      cargarProducto(idParam);
    }
  }, [idParam]);
  
  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#594a42]">
        <p className="text-[#312b2b] text-xl font-raleway">Cargando información del producto...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#594a42]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <p className="text-lg font-raleway mb-4">{error}</p>
          <div className="flex justify-center">
            <Link 
              href="/admin/productos" 
              className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway mr-4"
            >
              Volver a la lista
            </Link>
            {idParam && (
              <button 
                onClick={() => cargarProducto(idParam)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-raleway"
              >
                Reintentar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#594a42]">
        <p className="text-[#312b2b] text-xl font-raleway">Producto no encontrado</p>
        <Link 
          href="/admin/productos" 
          className="mt-4 bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway"
        >
          Volver a la lista
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-[#594a42]">
      {/* Barra de navegación */}
      <header className="bg-[#312b2b] shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className="h-24 w-auto">
                <img 
                  src="https://i.postimg.cc/K1KCM5K0/logo-escencias.jpg" 
                  alt="Escencias Robjan&apos;s" 
                  className="h-full object-contain rounded-xl"
                />
              </Link>
              <span className="text-xl text-[#fed856] font-raleway">
                Panel de Administración
              </span>
            </div>
            <div>
              <Link
                href="/admin/productos"
                className="text-[#fed856] hover:text-white transition-colors font-raleway"
              >
                Volver a Productos
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#312b2b] font-raleway">
            Detalle de Producto
          </h1>
          <Link
            href={`/admin/productos?edit=${producto._id}`}
            className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway"
          >
            Editar Producto
          </Link>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-[#fed856]">
          <div className="md:flex">
            <div className="md:w-1/3 bg-[#312b2b] p-8 flex items-center justify-center">
              <div className="w-full h-64 mb-8 bg-[#473f3f] flex items-center justify-center overflow-hidden rounded-md">
                <img 
                  src="https://i.postimg.cc/75pdMT0w/perfume-destacado.jpg" 
                  alt={producto.nombre} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#312b2b] mb-2 font-raleway">{producto.nombre}</h2>
                <div className="flex items-center text-sm mb-4">
                  <span className="text-white bg-[#312b2b] px-2 py-1 rounded-md mr-3 font-raleway">
                    {producto.categoria}
                  </span>
                  <span className="text-[#312b2b] font-raleway">
                    Inspirado en: <strong>{producto.inspirado_en}</strong>
                  </span>
                </div>
                <p className="text-gray-700 mb-4 font-raleway">{producto.descripcion}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-md">
                    <span className="block text-sm text-gray-500 font-raleway">Precio</span>
                    <span className="text-xl font-bold text-[#312b2b] font-raleway">
                      ${producto.precio.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <span className="block text-sm text-gray-500 font-raleway">Stock</span>
                    <span className="text-xl font-bold text-[#312b2b] font-raleway">
                      {producto.stock} unidades
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-[#312b2b] mb-4 font-raleway">
                  Notas del Perfume
                </h3>
                
                {producto.notas.length > 0 ? (
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-raleway">
                            Nota
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-raleway">
                            Intensidad
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-raleway">
                            Color
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {producto.notas.map((nota, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-raleway">
                              {nota.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-raleway">
                              {nota.intensidad} / 10
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div
                                  className="h-6 w-6 rounded-full mr-2"
                                  style={{ backgroundColor: nota.color }}
                                ></div>
                                <span className="text-sm text-gray-500 font-raleway">{nota.color}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 italic font-raleway">No hay notas registradas para este perfume.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Gráfico de notas */}
        {producto.notas.length > 0 && (
          <div className="mt-10 bg-white shadow-lg rounded-lg overflow-hidden border border-[#fed856] p-8">
            <h3 className="text-xl font-bold text-[#312b2b] mb-6 text-center font-raleway">
              Perfil de Aroma
            </h3>
            <GraficoNotas notas={producto.notas} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#312b2b] text-white py-8 mt-auto border-t-2 border-[#fed856]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#f8f1d8] font-raleway">
            &copy; {new Date().getFullYear()} Escencias Robjan&apos;s - Panel de Administración
          </p>
        </div>
      </footer>
    </div>
  );
}

// Componente envoltorio con Suspense
export default function DetalleProducto() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#594a42]">
        <p className="text-[#312b2b] text-xl font-raleway">Cargando...</p>
      </div>
    }>
      <DetalleProductoContent />
    </Suspense>
  );
} 