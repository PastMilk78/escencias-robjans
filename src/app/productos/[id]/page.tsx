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
              className="h-40 rounded-xl"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-6">
            <div>
              <img 
                src={producto.imagen || "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg"} 
                alt={producto.nombre}
                className="w-full h-auto rounded-lg shadow-md max-h-96 object-cover"
              />
            </div>
            <div>
              <div className="mb-4">
                <span className="inline-block bg-[#8c7465] text-white text-sm px-3 py-1 rounded-full mb-2 font-raleway">
                  {producto.categoria}
                </span>
                <h1 className="text-3xl font-bold text-[#312b2b] font-raleway">{producto.nombre}</h1>
                {producto.inspirado_en && (
                  <p className="text-gray-600 mt-1 font-raleway">
                    Inspirado en: <span className="font-semibold">{producto.inspirado_en}</span>
                  </p>
                )}
              </div>
              
              <div className="mb-6">
                <p className="font-raleway text-gray-700 mb-4">{producto.descripcion}</p>
                <p className="text-3xl font-bold text-[#312b2b] mb-2 font-raleway">${producto.precio.toFixed(2)}</p>
                <p className="text-sm text-gray-500 font-raleway">
                  {producto.stock > 0 
                    ? `${producto.stock} unidades disponibles` 
                    : "Agotado temporalmente"}
                </p>
              </div>
              
              {producto.notas && producto.notas.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 text-[#312b2b] font-raleway">Notas de fragancia</h2>
                  <div className="space-y-3">
                    {producto.notas.map((nota, index) => (
                      <div key={index} className="bg-gray-100 p-3 rounded">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-[#312b2b] font-raleway">{nota.nombre}</span>
                          <span className="text-sm text-[#8c7465] font-raleway">{nota.intensidad}%</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2.5">
                          <div 
                            className="bg-[#fed856] h-2.5 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${nota.intensidad}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {producto.stock > 0 && (
                <div className="mt-6">
                  <div className="flex items-center mb-4">
                    <label htmlFor="cantidad" className="mr-3 font-raleway text-black font-medium">Cantidad:</label>
                    <div className="flex items-center border border-gray-300 rounded">
                      <button 
                        onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                        className="px-3 py-1 bg-gray-100 text-black hover:bg-gray-200 font-raleway"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 font-raleway text-black">{cantidad}</span>
                      <button 
                        onClick={() => setCantidad(prev => Math.min(producto.stock, prev + 1))}
                        className="px-3 py-1 bg-gray-100 text-black hover:bg-gray-200 font-raleway"
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
                    className="w-full bg-[#fed856] text-[#312b2b] px-6 py-3 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway font-bold"
                    disabled={producto.stock <= 0}
                  >
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
      <footer className="bg-[#312b2b] text-white py-8 mt-auto border-t-2 border-[#fed856]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[#f8f1d8] font-raleway">
            &copy; {new Date().getFullYear()} Escencias Robjans. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
} 