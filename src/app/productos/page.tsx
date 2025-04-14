"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CartIcon from "@/app/components/CartIcon";

// Tipo de datos para productos
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
  
  // Si la luminancia es mayor a 0.5, consideramos que es un color claro
  return luminancia > 0.6;
};

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("nombreAsc");
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  
  // Cargar productos desde MongoDB
  const cargarProductos = async () => {
    setCargando(true);
    setError(null);
    
    try {
      // Utilizar el modelo importado
      // Nota: Esto servirá en el servidor (SSR), pero para cliente necesitamos usar la API
      const data = await fetch('/api/productos');
      
      if (!data.ok) {
        throw new Error('Error al cargar productos desde la API');
      }
      
      const productos = await data.json();
      setProductos(productos.productos);
    } catch (err: Error | unknown) {
      console.error('Error al obtener productos:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
      
      // Cargar productos fijos cuando hay error
      setProductos([
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
      ]);
      
      // Cambiar el mensaje de error para que sea más amigable
      setError("No se pudo conectar a la base de datos. Mostrando productos de demostración.");
    } finally {
      setCargando(false);
    }
  };
  
  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);
  
  // Función para abrir el modal con los detalles del producto
  const abrirDetallesProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
    setCantidadSeleccionada(1);
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    
    // Reiniciar animaciones
    setTimeout(() => {
      const barras = document.querySelectorAll('.barra-animada');
      barras.forEach((barra: Element) => {
        const elemento = barra as HTMLElement;
        elemento.style.width = '0%';
        setTimeout(() => {
          if (elemento.dataset.ancho) {
            elemento.style.transition = 'width 1.5s ease-out';
            elemento.style.width = elemento.dataset.ancho;
          }
        }, 100);
      });
    }, 50);
  };
  
  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
    setCantidadSeleccionada(1);
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  };
  
  // Manejar cambio en la cantidad seleccionada
  const handleCantidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCantidadSeleccionada(parseInt(e.target.value));
  };
  
  // Filtrar productos por categoría
  const productosFiltrados = categoriaSeleccionada === 'Todas'
    ? productos
    : productos.filter(producto => producto.categoria === categoriaSeleccionada);
  
  // Ordenar productos
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    switch (ordenSeleccionado) {
      case 'nombreAsc':
        return a.nombre.localeCompare(b.nombre);
      case 'nombreDesc':
        return b.nombre.localeCompare(a.nombre);
      case 'precioAsc':
        return a.precio - b.precio;
      case 'precioDesc':
        return b.precio - a.precio;
      default:
        return 0;
    }
  });
  
  const manejarCambioCategoria = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoriaSeleccionada(e.target.value);
  };
  
  const manejarCambioOrden = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrdenSeleccionado(e.target.value);
  };
  
  const categorias = ['Todas', 'Mujer', 'Hombre', 'Unisex'];
  
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
            <a href="/#contacto" className="button button-small bg-[#fed856] text-[#312b2b] hover:bg-[#e5c24c] hover:text-[#312b2b] mr-2 font-raleway">
              Contacto
            </a>
            <CartIcon />
          </div>
        </div>
      </header>
      
      {/* Banner Titulo */}
      <div className="bg-[#594a42] text-white py-10">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#fed856] font-playfair">Nuestros Perfumes</h1>
          <p className="mt-2 text-[#f8f1d8] font-raleway">Descubre fragancias exclusivas inspiradas en los mejores perfumes</p>
        </div>
      </div>
      
      {/* Contenido principal */}
      <main className="container mx-auto py-10 px-4 flex-grow bg-[#594a42]">
        {/* Mensaje de error si existe */}
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
            <p className="font-raleway">{error}</p>
          </div>
        )}
        
        {/* Filtros y ordenación */}
        <div className="flex flex-col md:flex-row justify-between mb-8 bg-[#8c7465] p-4 rounded-lg shadow-md">
          <div className="mb-4 md:mb-0">
            <label htmlFor="categoria" className="block text-sm font-medium text-white mb-2 font-raleway">Filtrar por categoría</label>
            <select
              id="categoria"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway"
              value={categoriaSeleccionada}
              onChange={manejarCambioCategoria}
            >
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="orden" className="block text-sm font-medium text-white mb-2 font-raleway">Ordenar por</label>
            <select
              id="orden"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway"
              value={ordenSeleccionado}
              onChange={manejarCambioOrden}
            >
              <option value="nombreAsc">Nombre (A-Z)</option>
              <option value="nombreDesc">Nombre (Z-A)</option>
              <option value="precioAsc">Precio (Menor a Mayor)</option>
              <option value="precioDesc">Precio (Mayor a Menor)</option>
            </select>
          </div>
        </div>
        
        {/* Lista de productos */}
        {cargando ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-lg p-8">
            <p className="text-xl text-gray-600 font-raleway">Cargando productos...</p>
          </div>
        ) : productosOrdenados.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-lg p-8">
            <p className="text-xl text-gray-600 font-raleway">No se encontraron productos en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productosOrdenados.map((producto) => (
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
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500 font-raleway">{producto.stock} en stock</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => abrirDetallesProducto(producto)}
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
            ))}
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
      
      {/* Modal de detalles del producto */}
      {modalAbierto && productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end p-2">
              <button 
                onClick={cerrarModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="md:flex">
                <div className="md:w-1/3 bg-[#473f3f] flex items-center justify-center rounded-lg overflow-hidden">
                  <img
                    src={productoSeleccionado.imagen}
                    alt={productoSeleccionado.nombre}
                    className="w-full h-auto max-h-[300px] object-cover"
                  />
                </div>
                <div className="md:w-2/3 md:pl-8 mt-6 md:mt-0">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[#312b2b] font-raleway">{productoSeleccionado.nombre}</h2>
                      <p className="text-gray-600 font-raleway">Categoría: {productoSeleccionado.categoria}</p>
                    </div>
                    <span className="text-2xl font-bold text-[#312b2b] font-raleway">${productoSeleccionado.precio.toFixed(2)}</span>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-700 font-raleway mb-4">{productoSeleccionado.descripcion}</p>
                    <p className="text-gray-700 font-raleway">
                      <span className="font-semibold">Inspirado en:</span> {productoSeleccionado.inspirado_en}
                    </p>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#312b2b] mb-4 font-raleway">Notas de Fragancia</h3>
                    <div className="space-y-6">
                      {productoSeleccionado.notas.map((nota, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-raleway text-lg font-medium text-[#312b2b]">{nota.nombre}</span>
                            <span className="font-raleway bg-[#312b2b] text-white px-2 py-1 rounded-full text-xs">{nota.intensidad}/10</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                            <div 
                              className="h-8 rounded-full barra-animada flex items-center justify-end pr-3" 
                              style={{
                                width: '0%',
                                backgroundColor: nota.color || '#000'
                              }}
                              data-ancho={`${nota.intensidad * 10}%`}
                            >
                              <span className={`font-medium text-sm ${esColorClaro(nota.color) ? 'text-[#312b2b]' : 'text-white'}`}>
                                {nota.nombre}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center">
                    <div className="mb-4 sm:mb-0 sm:mr-4">
                      <label htmlFor="cantidad" className="block text-sm font-medium text-black mb-1 font-raleway">Cantidad</label>
                      <select
                        id="cantidad"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway text-black bg-white"
                        value={cantidadSeleccionada}
                        onChange={handleCantidadChange}
                      >
                        {[...Array(Math.min(productoSeleccionado.stock, 10))].map((_, i) => (
                          <option key={i} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        // Crear un evento personalizado para añadir al carrito
                        const event = new CustomEvent('add-to-cart', {
                          detail: { producto: productoSeleccionado, cantidad: cantidadSeleccionada }
                        });
                        window.dispatchEvent(event);
                        cerrarModal();
                      }}
                      className="w-full sm:w-auto bg-[#fed856] text-[#312b2b] px-6 py-3 rounded-md font-bold hover:bg-[#e5c24c] transition-colors font-raleway"
                    >
                      Añadir al Carrito
                    </button>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-gray-600 font-raleway">
                      <span className="font-semibold">Disponibilidad:</span> {productoSeleccionado.stock > 0 ? `${productoSeleccionado.stock} unidades en stock` : 'Agotado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 