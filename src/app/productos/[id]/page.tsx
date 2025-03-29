"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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

// Tipo para items del carrito
type ItemCarrito = {
  producto: Producto;
  cantidad: number;
};

// Productos fijos de referencia por si falla la conexión
const productosFijos = [
  {
    _id: "producto1",
    nombre: "Aroma Intenso",
    categoria: "Mujer",
    precio: 299.99,
    stock: 25,
    descripcion: "Una fragancia intensa inspirada en los perfumes más exclusivos. Con notas predominantes de vainilla y frutos rojos.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "One Million",
    notas: [
      { nombre: "Vainilla", intensidad: 8, color: "#F3E5AB" },
      { nombre: "Frutos Rojos", intensidad: 7, color: "#C41E3A" }
    ]
  },
  {
    _id: "producto2",
    nombre: "Esencia Fresca",
    categoria: "Hombre",
    precio: 249.99,
    stock: 30,
    descripcion: "Fragancia fresca y duradera con notas cítricas y amaderadas. Ideal para el uso diario.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "Acqua di Gio",
    notas: [
      { nombre: "Cítrico", intensidad: 9, color: "#FFD700" },
      { nombre: "Madera", intensidad: 6, color: "#8B4513" }
    ]
  },
  {
    _id: "producto3",
    nombre: "Aroma Seductor",
    categoria: "Mujer",
    precio: 279.99,
    stock: 20,
    descripcion: "Una fragancia seductora con notas florales y especiadas. Perfecta para ocasiones especiales.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "Coco Mademoiselle",
    notas: [
      { nombre: "Flores", intensidad: 7, color: "#FFC0CB" },
      { nombre: "Especias", intensidad: 8, color: "#8B4513" }
    ]
  },
  {
    _id: "producto4",
    nombre: "Perfume Elegante",
    categoria: "Unisex",
    precio: 349.99,
    stock: 15,
    descripcion: "Una mezcla elegante y sofisticada con notas amaderadas y almizcle. Perfecto para cualquier ocasión.",
    imagen: "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg",
    inspirado_en: "CK One",
    notas: [
      { nombre: "Almizcle", intensidad: 6, color: "#D3D3D3" },
      { nombre: "Madera", intensidad: 7, color: "#8B4513" }
    ]
  }
];

export default function DetalleProductoPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [mensajeCarrito, setMensajeCarrito] = useState<string | null>(null);
  
  useEffect(() => {
    const obtenerProducto = async () => {
      setCargando(true);
      setError(null);
      
      try {
        // Primero intentamos obtener el producto de la API
        const respuesta = await fetch(`/api/productos/${id}`);
        
        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el producto');
        }
        
        const datos = await respuesta.json();
        setProducto(datos.producto);
      } catch (err) {
        console.error('Error al obtener el producto:', err);
        
        // Si falla, buscamos el producto en los productos fijos
        const productoFijo = productosFijos.find(p => p._id === id);
        
        if (productoFijo) {
          setProducto(productoFijo);
          setError("No se pudo conectar a la base de datos. Mostrando datos de demostración.");
        } else {
          setError("No se encontró el producto solicitado.");
        }
      } finally {
        setCargando(false);
      }
    };
    
    obtenerProducto();
    
    // Recuperar carrito del localStorage si existe
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (e) {
        console.error('Error al cargar el carrito:', e);
        localStorage.removeItem('carrito');
      }
    }
    
    // Agregar la animación para las barras
    if (!cargando && producto) {
      setTimeout(() => {
        const barras = document.querySelectorAll('.barra-animada');
        barras.forEach((barra: Element) => {
          const elemento = barra as HTMLElement;
          elemento.style.width = '0%';
          setTimeout(() => {
            elemento.style.transition = 'width 1.5s ease-out';
            elemento.style.width = `${parseInt(elemento.style.width || '0') * 10}%`;
          }, 100);
        });
      }, 300);
    }
  }, [id, cargando, producto]);
  
  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);
  
  // Manejar cambio en la cantidad seleccionada
  const handleCantidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCantidadSeleccionada(parseInt(e.target.value));
  };
  
  // Función para añadir al carrito
  const añadirAlCarrito = (producto: Producto, cantidad: number) => {
    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.producto._id === producto._id);
    
    if (itemExistente) {
      // Actualizar cantidad del item existente
      setCarrito(carrito.map(item => 
        item.producto._id === producto._id 
          ? { ...item, cantidad: item.cantidad + cantidad } 
          : item
      ));
    } else {
      // Añadir nuevo item al carrito
      setCarrito([...carrito, { producto, cantidad }]);
    }
    
    // Mostrar mensaje de confirmación
    setMensajeCarrito(`${producto.nombre} añadido al carrito`);
    setTimeout(() => {
      setMensajeCarrito(null);
    }, 3000);
  };
  
  // Calcular total de items en el carrito
  const totalItemsCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
  
  if (cargando) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f1d8]">
        <header className="bg-[#312b2b] shadow-md">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Link href="/" className="h-24 w-auto">
                  <img 
                    src="https://i.postimg.cc/K1KCM5K0/logo-escencias.jpg" 
                    alt="Escencias Robjan&apos;s" 
                    className="h-full object-contain rounded-xl"
                  />
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/productos" className="text-[#fed856] hover:text-white font-raleway">
                  Volver al Catálogo
                </Link>
                <div className="relative">
                  <button className="text-[#fed856] hover:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {totalItemsCarrito > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-2 -right-2">
                        {totalItemsCarrito}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </header>
        
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-lg text-[#312b2b] font-raleway">Cargando detalles del producto...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (error && !producto) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f1d8]">
        <header className="bg-[#312b2b] shadow-md">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Link href="/" className="h-24 w-auto">
                  <img 
                    src="https://i.postimg.cc/K1KCM5K0/logo-escencias.jpg" 
                    alt="Escencias Robjan&apos;s" 
                    className="h-full object-contain rounded-xl"
                  />
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/productos" className="text-[#fed856] hover:text-white font-raleway">
                  Volver al Catálogo
                </Link>
                <div className="relative">
                  <button className="text-[#fed856] hover:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {totalItemsCarrito > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-2 -right-2">
                        {totalItemsCarrito}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </header>
        
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-raleway">{error}</p>
              <Link 
                href="/productos"
                className="mt-4 inline-block bg-[#312b2b] text-white px-4 py-2 rounded-md hover:bg-[#473f3f] font-raleway"
              >
                Volver al Catálogo
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!producto) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f1d8]">
        <header className="bg-[#312b2b] shadow-md">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Link href="/" className="h-24 w-auto">
                  <img 
                    src="https://i.postimg.cc/K1KCM5K0/logo-escencias.jpg" 
                    alt="Escencias Robjan&apos;s" 
                    className="h-full object-contain rounded-xl"
                  />
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/productos" className="text-[#fed856] hover:text-white font-raleway">
                  Volver al Catálogo
                </Link>
                <div className="relative">
                  <button className="text-[#fed856] hover:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {totalItemsCarrito > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-2 -right-2">
                        {totalItemsCarrito}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </header>
        
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <p className="text-lg text-[#312b2b] font-raleway">No se encontró el producto solicitado.</p>
              <Link 
                href="/productos"
                className="mt-4 inline-block bg-[#312b2b] text-white px-4 py-2 rounded-md hover:bg-[#473f3f] font-raleway"
              >
                Volver al Catálogo
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f1d8]">
      <header className="bg-[#312b2b] shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="h-24 w-auto">
                <img 
                  src="https://i.postimg.cc/K1KCM5K0/logo-escencias.jpg" 
                  alt="Escencias Robjan&apos;s" 
                  className="h-full object-contain rounded-xl"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/productos" className="text-[#fed856] hover:text-white font-raleway">
                Volver al Catálogo
              </Link>
              <div className="relative">
                <button className="text-[#fed856] hover:text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {totalItemsCarrito > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-2 -right-2">
                      {totalItemsCarrito}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="flex-grow">
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              <p className="font-raleway">{error}</p>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-[#473f3f] flex items-center justify-center">
                <img
                  src={producto.imagen || "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg"}
                  alt={producto.nombre}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
              <div className="md:w-2/3 p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#312b2b] font-raleway">{producto.nombre}</h1>
                    <p className="text-gray-600 font-raleway">Categoría: {producto.categoria}</p>
                  </div>
                  <span className="text-2xl font-bold text-[#312b2b] font-raleway">${producto.precio.toFixed(2)}</span>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 font-raleway mb-4">{producto.descripcion}</p>
                  <p className="text-gray-700 font-raleway">
                    <span className="font-semibold">Inspirado en:</span> {producto.inspirado_en}
                  </p>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-[#312b2b] mb-3 font-raleway">Notas de Fragancia</h2>
                  <div className="space-y-6">
                    {producto.notas.map((nota, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-raleway text-lg font-medium">{nota.nombre}</span>
                          <span className="font-raleway bg-[#312b2b] text-white px-2 py-1 rounded-full text-xs">{nota.intensidad}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                          <div 
                            className="h-8 rounded-full barra-animada flex items-center justify-end pr-3" 
                            style={{
                              width: `${nota.intensidad * 10}%`,
                              backgroundColor: nota.color || '#000'
                            }}
                          >
                            <span className="text-white font-medium text-sm">{nota.nombre}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="mb-4 sm:mb-0 sm:mr-4">
                    <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">Cantidad</label>
                    <select
                      id="cantidad"
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway"
                      value={cantidadSeleccionada}
                      onChange={handleCantidadChange}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => añadirAlCarrito(producto, cantidadSeleccionada)}
                    className="w-full sm:w-auto bg-[#fed856] text-[#312b2b] px-6 py-3 rounded-md font-bold hover:bg-[#e5c24c] transition-colors font-raleway"
                  >
                    Añadir al Carrito
                  </button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 font-raleway">
                    <span className="font-semibold">Disponibilidad:</span> {producto.stock > 0 ? `${producto.stock} unidades en stock` : 'Agotado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-[#312b2b] text-white py-8 mt-auto border-t-2 border-[#fed856]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#f8f1d8] font-raleway">
            &copy; {new Date().getFullYear()} Escencias Robjan&apos;s. Todos los derechos reservados.
          </p>
        </div>
      </footer>
      
      {/* Mensaje de confirmación de carrito */}
      {mensajeCarrito && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 font-raleway">
          {mensajeCarrito}
        </div>
      )}
    </div>
  );
} 