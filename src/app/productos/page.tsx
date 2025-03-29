"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { connectToDatabase } from "@/lib/mongodb";

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

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [ordenSeleccionado, setOrdenSeleccionado] = useState("nombreAsc");
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [mensajeCarrito, setMensajeCarrito] = useState<string | null>(null);
  
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
  }, []);
  
  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);
  
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
    
    // Si estamos en el modal, cerrarlo
    if (modalAbierto) {
      cerrarModal();
    }
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
  
  // Calcular total de items en el carrito
  const totalItemsCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f1d8]">
      {/* Barra de navegación */}
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
              <a href="#contacto" className="button button-small bg-[#fed856] text-[#312b2b] hover:bg-[#e5c24c] hover:text-[#312b2b] mr-2 font-raleway">
                Contacto
              </a>
              <button className="text-[#fed856] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
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
        {/* Hero de la página de productos */}
        <div className="bg-[#312b2b] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center p-4">
              <img 
                src="https://i.postimg.cc/K1KCM5K0/logo-escencias.jpg" 
                alt="Escencias Robjans Logo"
                className="h-24 mb-2 rounded-xl"
              />
              <h1 className="text-xl font-bold text-[#fed856]">Catálogo de Perfumes</h1>
              <p className="text-sm text-[#f8f1d8]">Explora nuestra exclusiva selección de fragancias</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-[#473f3f] shadow-md py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap items-center space-x-4">
                <span className="text-[#fed856] font-raleway">Filtrar por:</span>
                <select 
                  className="bg-[#312b2b] border border-[#fed856] text-[#f8f1d8] rounded-md py-2 px-3 text-sm font-raleway"
                  value={categoriaSeleccionada}
                  onChange={manejarCambioCategoria}
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select 
                  className="bg-[#312b2b] border border-[#fed856] text-[#f8f1d8] rounded-md py-2 px-3 text-sm font-raleway"
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
          </div>
        </div>

        {/* Estado de carga o error */}
        {cargando && (
          <div className="text-center py-12">
            <p className="text-lg text-[#312b2b] font-raleway">Cargando productos...</p>
          </div>
        )}
        
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-raleway">{error}</p>
              <button 
                onClick={cargarProductos}
                className="mt-2 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-raleway"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Lista de productos */}
        {!cargando && !error && (
          <div className="bg-[#f8f1d8] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {productosOrdenados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {productosOrdenados.map((producto) => (
                  <div key={producto._id} className="bg-[#312b2b] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-[#fed856]">
                    <div className="h-48 bg-[#473f3f] flex items-center justify-center overflow-hidden">
                      <img
                        src="https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg"
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-[#fed856] font-raleway">{producto.nombre}</h3>
                          <p className="text-sm text-[#f8f1d8] font-raleway">{producto.categoria}</p>
                        </div>
                        <span className="text-lg font-bold text-[#fed856] font-raleway">${producto.precio.toFixed(2)}</span>
                      </div>
                      <p className="mt-2 text-[#f8f1d8] text-sm font-raleway">{producto.descripcion}</p>
                      <p className="mt-1 text-[#f8f1d8] text-sm font-raleway">
                        <span className="text-[#fed856]">Inspirado en:</span> {producto.inspirado_en}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <button
                          onClick={() => abrirDetallesProducto(producto)}
                          className="text-[#fed856] hover:text-white text-sm font-medium font-raleway"
                        >
                          Ver detalles
                        </button>
                        <button 
                          onClick={() => añadirAlCarrito(producto, 1)}
                          className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-md text-sm hover:bg-[#e5c24c] transition-colors border border-[#fed856] font-raleway"
                        >
                          Añadir al carrito
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-[#312b2b] font-raleway">No hay productos disponibles en este momento.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Sección de Contacto con Mapa */}
      <section id="contacto" className="py-16 bg-[#312b2b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#fed856] mb-12 font-raleway">Encuéntranos</h2>
          
          <div className="md:flex md:space-x-8">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-[#473f3f] p-6 rounded-lg border border-[#fed856]">
                <h3 className="text-xl font-semibold text-[#fed856] mb-4 font-raleway">Información de Contacto</h3>
                <ul className="space-y-4 text-[#f8f1d8]">
                  <li className="flex items-center font-raleway">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#fed856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Calle Principal #123, Ciudad</span>
                  </li>
                  <li className="flex items-center font-raleway">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#fed856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>info@escenciasrobjans.com</span>
                  </li>
                  <li className="flex items-center font-raleway">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#fed856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+123 456 7890</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <h4 className="text-[#fed856] font-medium mb-3 font-raleway">Horarios de Atención</h4>
                  <p className="text-[#f8f1d8] mb-1 font-raleway">Lunes a Viernes: 9:00 AM - 7:00 PM</p>
                  <p className="text-[#f8f1d8] font-raleway">Sábados: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden h-80 border border-[#fed856]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.661460824311!2d-99.16964548517653!3d19.427023545827606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f5bd1563%3A0x6c366f0e2de02ff7!2sZocalo%2C%20Centro%20Historico%2C%20Centro%2C%2006000%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX%2C%20M%C3%A9xico!5e0!3m2!1ses-419!2sus!4v1625847915946!5m2!1ses-419!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title="Ubicación de Escencias Robjan&apos;s"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#312b2b] text-white py-12 mt-auto border-t-2 border-[#fed856]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#fed856] font-raleway">Escencias Robjan&apos;s</h3>
              <p className="text-[#f8f1d8] font-raleway">
                Tu tienda de confianza para encontrar las mejores fragancias a precios accesibles.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#fed856] font-raleway">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#contacto" className="text-[#f8f1d8] hover:text-[#fed856] transition-colors font-raleway">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#fed856] font-raleway">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-[#f8f1d8] hover:text-[#fed856] transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-[#f8f1d8] hover:text-[#fed856] transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                            <span className="font-raleway text-lg font-medium">{nota.nombre}</span>
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
                      onClick={() => añadirAlCarrito(productoSeleccionado, cantidadSeleccionada)}
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
      
      {/* Mensaje de confirmación de carrito */}
      {mensajeCarrito && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 font-raleway">
          {mensajeCarrito}
        </div>
      )}
    </div>
  );
} 