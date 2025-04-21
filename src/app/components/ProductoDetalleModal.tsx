"use client";

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

interface ProductoDetalleModalProps {
  productoId: string | null;
  onClose: () => void;
}

// Productos fijos de referencia por si falla la conexión
const productosFijos = [
  {
    _id: "producto1",
    nombre: "Aroma Intenso",
    categoria: "Hombre",
    precio: 195,
    stock: 15,
    descripcion: "Fragancia amaderada con notas de sándalo y vetiver. Perfecta para ocasiones especiales.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "Sauvage",
    notas: [
      { nombre: "Sándalo", intensidad: 8, color: "#8B4513" },
      { nombre: "Vetiver", intensidad: 7, color: "#556B2F" },
      { nombre: "Pimienta", intensidad: 6, color: "#2F4F4F" }
    ]
  },
  {
    _id: "producto2",
    nombre: "Esencia Fresca",
    categoria: "Hombre",
    precio: 195,
    stock: 30,
    descripcion: "Fragancia fresca y duradera con notas cítricas y amaderadas. Ideal para el uso diario.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "Acqua di Gio",
    notas: [
      { nombre: "Cítrico", intensidad: 9, color: "#FFD700" },
      { nombre: "Madera", intensidad: 6, color: "#8B4513" },
      { nombre: "Marino", intensidad: 7, color: "#1E90FF" }
    ]
  },
  {
    _id: "producto3",
    nombre: "Aroma Seductor",
    categoria: "Mujer",
    precio: 195,
    stock: 10,
    descripcion: "Fragancia oriental con notas de ámbar y almizcle. Perfecta para la noche.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "Black Opium",
    notas: [
      { nombre: "Ámbar", intensidad: 9, color: "#FFA500" },
      { nombre: "Almizcle", intensidad: 8, color: "#8B4513" },
      { nombre: "Vainilla", intensidad: 7, color: "#FFFACD" }
    ]
  },
  {
    _id: "producto4",
    nombre: "Perfume Elegante",
    categoria: "Unisex",
    precio: 195,
    stock: 15,
    descripcion: "Una mezcla elegante y sofisticada con notas amaderadas y cítricas. Perfecto para cualquier ocasión.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "CK One",
    notas: [
      { nombre: "Almizcle", intensidad: 6, color: "#D3D3D3" },
      { nombre: "Bergamota", intensidad: 8, color: "#FFFF00" },
      { nombre: "Madera", intensidad: 7, color: "#8B4513" }
    ]
  },
  {
    _id: "producto5",
    nombre: "Esencia Floral",
    categoria: "Mujer",
    precio: 195,
    stock: 20,
    descripcion: "Delicada fragancia floral con notas de jazmín y rosa. Ideal para el día a día.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "Daisy",
    notas: [
      { nombre: "Rosa", intensidad: 9, color: "#FF69B4" },
      { nombre: "Jazmín", intensidad: 8, color: "#FFFFF0" },
      { nombre: "Fresia", intensidad: 6, color: "#BA55D3" }
    ]
  }
];

export default function ProductoDetalleModal({ productoId, onClose }: ProductoDetalleModalProps) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [tamanioSeleccionado, setTamanioSeleccionado] = useState<string>("30ml");
  
  // Definir los tamaños y precios
  const tamanios = [
    { valor: "30ml", nombre: "30ml", precio: 195 },
    { valor: "60ml", nombre: "60ml", precio: 295 },
    { valor: "120ml", nombre: "120ml", precio: 450 }
  ];
  
  // Función para obtener el precio según el tamaño seleccionado
  const obtenerPrecio = () => {
    const tamanioElegido = tamanios.find(t => t.valor === tamanioSeleccionado);
    return tamanioElegido ? tamanioElegido.precio : 195; // Precio base es 195 (30ml)
  };

  useEffect(() => {
    if (!productoId) {
      setCargando(false);
      return;
    }

    const obtenerProducto = async () => {
      setCargando(true);
      setError(null);
      setProducto(null); // Reset producto
      
      console.log('ProductoDetalleModal - Obteniendo producto con ID:', productoId);
      
      try {
        // Primero intentamos obtener el producto de la API
        const respuesta = await fetch(`/api/productos/${productoId}`);
        
        if (!respuesta.ok) {
          console.error('Error en respuesta API:', respuesta.status, respuesta.statusText);
          throw new Error('No se pudo cargar el producto');
        }
        
        const datos = await respuesta.json();
        console.log('ProductoDetalleModal - Datos recibidos de API:', datos);
        
        if (datos && datos.producto) {
          setProducto({
            ...datos.producto,
            precio: 195 // Establecer precio base como el de 30ml
          });
          console.log('ProductoDetalleModal - Producto cargado correctamente:', datos.producto);
        } else {
          console.error('ProductoDetalleModal - Formato de respuesta incorrecto:', datos);
          throw new Error('Formato de respuesta incorrecto');
        }
      } catch (err) {
        console.error('ProductoDetalleModal - Error al obtener el producto:', err);
        
        // Si falla, buscamos el producto en los productos fijos
        console.log('ProductoDetalleModal - Buscando en productos fijos con ID:', productoId);
        const productoFijo = productosFijos.find(p => p._id === productoId);
        
        if (productoFijo) {
          setProducto({
            ...productoFijo,
            precio: 195 // Establecer precio base como el de 30ml
          });
          console.log('ProductoDetalleModal - Usando producto fijo:', productoFijo);
          setError("No se pudo conectar a la base de datos. Mostrando datos de demostración.");
        } else {
          setError("No se encontró el producto solicitado.");
        }
      } finally {
        setCargando(false);
        // Mostrar notificación de consola cuando termine de cargar
        console.log('ProductoDetalleModal - Carga completa para ID:', productoId);
      }
    };
    
    // Pequeño timeout para asegurar que todo esté inicializado antes de llamar a la API
    setTimeout(() => {
      obtenerProducto();
    }, 100);
  }, [productoId]); // Dependemos solo del productoId

  // Manejar la animación de las barras cuando cambia el producto
  useEffect(() => {
    if (!cargando && producto) {
      console.log('Iniciando animación para producto:', producto.nombre);
      
      // Pequeño timeout para asegurar que el DOM está listo
      setTimeout(() => {
        const barras = document.querySelectorAll('.barra-animada');
        console.log('Barras encontradas:', barras.length);
        
        barras.forEach((barra: Element) => {
          const elemento = barra as HTMLElement;
          elemento.style.width = '0%';
          
          setTimeout(() => {
            elemento.style.transition = 'width 1.5s ease-out';
            const intensidad = parseInt(elemento.dataset.intensidad || '0');
            console.log('Animando barra con intensidad:', intensidad);
            elemento.style.width = `${intensidad * 10}%`;
          }, 100);
        });
      }, 300);
    }
  }, [cargando, producto]);

  // Si no hay ID de producto, no mostramos nada
  if (!productoId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-gradient-to-br from-[#2d2520] to-[#3a302a] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#fed856]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#fed856] hover:text-white transition-colors z-10 bg-[#312b2b] rounded-full p-1"
        >
          <XMarkIcon className="h-7 w-7" />
        </button>

        <div className="p-8">
          {cargando ? (
            <div className="text-center py-16">
              <p className="text-2xl text-[#fed856] font-raleway mb-6">Cargando producto...</p>
              <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-t-2 border-[#fed856] mx-auto"></div>
            </div>
          ) : error && !producto ? (
            <div className="bg-[#473f3f] border border-[#fed856] text-[#fed856] px-6 py-4 rounded-lg my-6">
              <p className="font-raleway text-lg">{error}</p>
              <div className="mt-6">
                <button 
                  onClick={onClose}
                  className="bg-[#fed856] text-[#312b2b] px-6 py-3 rounded-lg hover:bg-[#e5c24c] transition-colors font-raleway font-bold"
                >
                  Volver a Productos
                </button>
              </div>
            </div>
          ) : producto ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative overflow-hidden rounded-xl group">
                <img 
                  src={producto.imagen || "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg"} 
                  alt={producto.nombre}
                  className="w-full h-auto rounded-xl shadow-2xl max-h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback si la imagen no carga
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.src = "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg";
                    console.log('Error al cargar imagen, usando fallback');
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-[#8c7465] text-white text-sm px-4 py-2 rounded-full mb-2 font-raleway font-bold shadow-lg">
                    {producto.categoria}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              </div>
              <div>
                <div className="mb-8 pb-6 border-b border-[#473f3f]">
                  <h1 className="text-4xl font-bold text-[#fed856] font-raleway mb-3">{producto.nombre}</h1>
                  {producto.inspirado_en && (
                    <p className="text-white mt-2 font-raleway text-lg">
                      Inspirado en: <span className="font-semibold text-[#fed856]">{producto.inspirado_en}</span>
                    </p>
                  )}
                  <p className="font-raleway text-[#f8f1d8] mt-6 text-lg leading-relaxed">{producto.descripcion}</p>
                </div>
                
                <div className="mb-8 py-4 border-b border-[#473f3f]">
                  <div className="flex justify-between items-center">
                    <p className="text-4xl font-bold text-[#fed856] font-raleway">${obtenerPrecio().toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Selector de tamaño */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-[#fed856] font-raleway">Selecciona el tamaño</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {tamanios.map((tamanio) => (
                      <button
                        key={tamanio.valor}
                        className={`py-3 px-4 rounded-lg font-bold transition-all duration-300 ${
                          tamanioSeleccionado === tamanio.valor
                            ? 'bg-[#fed856] text-[#312b2b] shadow-lg transform scale-105'
                            : 'bg-[#473f3f] text-[#f8f1d8] hover:bg-[#5a4f4a]'
                        }`}
                        onClick={() => setTamanioSeleccionado(tamanio.valor)}
                      >
                        <div className="text-lg font-semibold">{tamanio.nombre}</div>
                        <div className="text-sm mt-1">${tamanio.precio.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {producto.notas && producto.notas.length > 0 ? (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6 text-[#fed856] font-raleway inline-block relative">
                      Notas de fragancia
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#fed856]"></span>
                    </h2>
                    <div className="space-y-6 mt-6">
                      {producto.notas.map((nota, index) => (
                        <div key={index} className="bg-[#473f3f] p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#473f3f] hover:border-[#fed856]">
                          <div className="flex justify-between mb-3">
                            <span className="font-medium text-[#f8f1d8] font-raleway flex items-center text-lg">
                              <span className="inline-block w-4 h-4 rounded-full mr-3" style={{ backgroundColor: nota.color || '#fed856' }}></span>
                              {nota.nombre}
                            </span>
                            <span className="text-[#fed856] font-bold px-3 py-1 rounded-full font-raleway">
                              {nota.intensidad}/10
                            </span>
                          </div>
                          <div className="w-full bg-[#2d2520] rounded-full h-3 overflow-hidden">
                            <div 
                              className="barra-animada h-3 rounded-full"
                              data-intensidad={nota.intensidad}
                              style={{ 
                                width: '0%', 
                                backgroundColor: nota.color || '#fed856' 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                
                <div className="mt-8">
                  <div className="flex items-center mb-6">
                    <label htmlFor="cantidad" className="mr-6 font-raleway text-[#f8f1d8] font-medium text-xl">Cantidad:</label>
                    <div className="flex items-center border-2 border-[#fed856] rounded-lg overflow-hidden">
                      <button 
                        onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                        className="px-5 py-3 bg-[#473f3f] text-[#fed856] hover:bg-[#fed856] hover:text-[#312b2b] transition-colors font-raleway font-bold text-xl"
                      >
                        -
                      </button>
                      <span className="px-8 py-3 font-raleway text-[#f8f1d8] font-semibold text-lg bg-[#312b2b]">{cantidad}</span>
                      <button 
                        onClick={() => setCantidad(prev => Math.min(10, prev + 1))}
                        className="px-5 py-3 bg-[#473f3f] text-[#fed856] hover:bg-[#fed856] hover:text-[#312b2b] transition-colors font-raleway font-bold text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      // Crear un evento personalizado para añadir al carrito con el tamaño seleccionado
                      const productoConTamanio = {
                        ...producto,
                        tamanio: tamanioSeleccionado,
                        precio: obtenerPrecio(),
                        precioBase: 195 // Añadir precio base explícitamente
                      };
                      
                      const event = new CustomEvent('add-to-cart', {
                        detail: { producto: productoConTamanio, cantidad }
                      });
                      window.dispatchEvent(event);
                      // Cerrar el modal después de añadir al carrito
                      onClose();
                    }}
                    className="w-full bg-[#fed856] text-[#312b2b] px-6 py-4 rounded-lg hover:bg-[#e5c24c] transition-colors font-raleway font-bold text-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-2xl text-[#fed856] font-raleway">No se encontró el producto.</p>
              <div className="mt-6">
                <button 
                  onClick={onClose}
                  className="bg-[#fed856] text-[#312b2b] px-6 py-3 rounded-lg hover:bg-[#e5c24c] transition-colors font-raleway font-bold"
                >
                  Volver a Productos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 