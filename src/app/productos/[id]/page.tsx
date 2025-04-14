"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CartIcon from '@/app/components/CartIcon';

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

// Define la interfaz para los params de la ruta
interface Params {
  id: string;
}

// Función para determinar si un color es claro (para decidir color de texto)
const esColorClaro = (hexColor: string = '#000000'): boolean => {
  // Si no hay color, asumimos que es oscuro
  if (!hexColor) return false;
  
  // Eliminar el # si existe
  hexColor = hexColor.replace('#', '');
  
  // Convertir a RGB
  const r = parseInt(hexColor.substr(0, 2), 16) || 0;
  const g = parseInt(hexColor.substr(2, 2), 16) || 0;
  const b = parseInt(hexColor.substr(4, 2), 16) || 0;
  
  // Calcular la luminancia (percepción humana del brillo)
  // Fórmula: 0.299*R + 0.587*G + 0.114*B
  const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Si la luminancia es mayor a 0.6, consideramos que es un color claro
  return luminancia > 0.6;
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

export default function ProductoDetalle({ params }: { params: Params }) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const obtenerProducto = async () => {
      setCargando(true);
      setError(null);
      
      try {
        // Primero intentamos obtener el producto de la API
        const respuesta = await fetch(`/api/productos/${params.id}`);
        
        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el producto');
        }
        
        const datos = await respuesta.json();
        setProducto(datos.producto);
      } catch (err) {
        console.error('Error al obtener el producto:', err);
        
        // Si falla, buscamos el producto en los productos fijos
        const productoFijo = productosFijos.find(p => p._id === params.id);
        
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
  }, [params.id, cargando, producto]);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#594a42]">
      {/* Header con navegación */}
      <header className="bg-[#312b2b] p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img
              src="https://i.postimg.cc/K1KCM5K0/logo-escencias.jpg"
              alt="Escencias Robjans Logo"
              className="h-48 w-auto rounded-3xl shadow-xl"
            />
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              href="/productos" 
              className="button button-small bg-[#fed856] text-[#312b2b] hover:bg-[#e5c24c] hover:text-[#312b2b] mr-2 font-raleway"
            >
              Ver Productos
            </Link>
            <a 
              href="/#contacto" 
              className="button button-small bg-[#fed856] text-[#312b2b] hover:bg-[#e5c24c] hover:text-[#312b2b] mr-2 font-raleway"
            >
              Contacto
            </a>
            <CartIcon />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 flex-grow">
        {cargando ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-lg p-8">
            <p className="text-xl text-gray-600 font-raleway">Cargando producto...</p>
          </div>
        ) : error ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded my-4">
            <p className="font-raleway">{error}</p>
            <div className="mt-4">
              <Link 
                href="/productos" 
                className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded hover:bg-[#e5c24c] transition-colors font-raleway"
              >
                Volver a Productos
              </Link>
            </div>
          </div>
        ) : producto ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-xl p-8 border border-[#fed856]">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={producto.imagen || "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg"} 
                alt={producto.nombre}
                className="w-full h-auto rounded-lg shadow-xl max-h-96 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-block bg-[#8c7465] text-white text-sm px-3 py-1 rounded-full mb-2 font-raleway">
                  {producto.categoria}
                </span>
              </div>
            </div>
            <div>
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-[#312b2b] font-raleway mb-2">{producto.nombre}</h1>
                {producto.inspirado_en && (
                  <p className="text-gray-600 mt-1 font-raleway text-lg">
                    Inspirado en: <span className="font-semibold text-[#8c7465]">{producto.inspirado_en}</span>
                  </p>
                )}
                <p className="font-raleway text-gray-700 mt-4 text-lg leading-relaxed">{producto.descripcion}</p>
              </div>
              
              <div className="mb-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-3xl font-bold text-[#312b2b] font-raleway">${producto.precio.toFixed(2)}</p>
                  <p className="inline-block bg-[#312b2b] text-[#fed856] px-3 py-1 rounded-full font-raleway">
                    {producto.stock > 0 
                      ? `${producto.stock} unidades disponibles` 
                      : "Agotado temporalmente"}
                  </p>
                </div>
              </div>
              
              {producto.notas && producto.notas.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-[#312b2b] font-raleway inline-block relative">
                    Notas de fragancia
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#fed856]"></span>
                  </h2>
                  <div className="space-y-4 mt-6">
                    {producto.notas.map((nota, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-[#312b2b] font-raleway flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: nota.color || '#fed856' }}></span>
                            {nota.nombre}
                          </span>
                          <span className="text-sm bg-[#312b2b] text-white px-2 py-0.5 rounded-full font-raleway">{nota.intensidad*10}%</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-[#fed856] h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${nota.intensidad*10}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {producto.stock > 0 && (
                <div className="mt-8">
                  <div className="flex items-center mb-6">
                    <label htmlFor="cantidad" className="mr-4 font-raleway text-black font-medium text-lg">Cantidad:</label>
                    <div className="flex items-center border-2 border-[#fed856] rounded-lg overflow-hidden">
                      <button 
                        onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                        className="px-4 py-2 bg-gray-100 text-black hover:bg-[#fed856] hover:text-[#312b2b] transition-colors font-raleway font-bold"
                      >
                        -
                      </button>
                      <span className="px-6 py-2 font-raleway text-black font-semibold">{cantidad}</span>
                      <button 
                        onClick={() => setCantidad(prev => Math.min(producto.stock, prev + 1))}
                        className="px-4 py-2 bg-gray-100 text-black hover:bg-[#fed856] hover:text-[#312b2b] transition-colors font-raleway font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      // Crear un evento personalizado para añadir al carrito
                      const event = new CustomEvent('add-to-cart', {
                        detail: { producto, cantidad }
                      });
                      window.dispatchEvent(event);
                    }}
                    className="w-full bg-[#fed856] text-[#312b2b] px-6 py-4 rounded-lg hover:bg-[#e5c24c] transition-colors font-raleway font-bold text-lg flex items-center justify-center"
                    disabled={producto.stock <= 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Añadir al Carrito
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-white font-raleway">No se encontró el producto.</p>
            <div className="mt-4">
              <Link 
                href="/productos" 
                className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded hover:bg-[#e5c24c] transition-colors font-raleway"
              >
                Volver a Productos
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#312b2b] text-white py-12 mt-auto border-t-4 border-[#fed856]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center md:text-left">
              <img 
                src="https://i.postimg.cc/T3QxB7Tv/logo-escencias.jpg"
                alt="Logo Escencias Robjans"
                className="h-32 w-auto rounded-2xl shadow-lg mx-auto md:mx-0 mb-6"
              />
              <p className="text-[#f8f1d8] font-raleway">
                Tu tienda de confianza para encontrar las mejores fragancias a precios accesibles.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-6 text-[#fed856] font-raleway relative inline-block">
                Enlaces rápidos
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#fed856] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/"
                    className="text-[#f8f1d8] hover:text-[#fed856] transition-colors font-raleway flex items-center group"
                  >
                    <span className="inline-block w-2 h-2 bg-[#fed856] mr-2 rounded-full group-hover:w-3 transition-all duration-300"></span>
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/productos"
                    className="text-[#f8f1d8] hover:text-[#fed856] transition-colors font-raleway flex items-center group"
                  >
                    <span className="inline-block w-2 h-2 bg-[#fed856] mr-2 rounded-full group-hover:w-3 transition-all duration-300"></span>
                    Todos los productos
                  </Link>
                </li>
                <li>
                  <a 
                    href="/#contacto" 
                    className="text-[#f8f1d8] hover:text-[#fed856] transition-colors font-raleway flex items-center group"
                  >
                    <span className="inline-block w-2 h-2 bg-[#fed856] mr-2 rounded-full group-hover:w-3 transition-all duration-300"></span>
                    Información de Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-6 text-[#fed856] font-raleway">Síguenos</h3>
              <div className="flex justify-center md:justify-start space-x-6">
                <a 
                  href="#" 
                  className="bg-[#473f3f] hover:bg-[#fed856] transition-colors p-3 rounded-full group"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6 text-[#f8f1d8] group-hover:text-[#312b2b] transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="bg-[#473f3f] hover:bg-[#fed856] transition-colors p-3 rounded-full group"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6 text-[#f8f1d8] group-hover:text-[#312b2b] transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-[#473f3f] text-center">
            <p className="text-[#f8f1d8] font-raleway">&copy; {new Date().getFullYear()} Escencias Robjan&apos;s. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 