import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import ProductoModel from "@/models/Producto";
import Header from "@/app/components/Header";
import CartIcon from "@/app/components/CartIcon";
import ResenaCarousel from "@/app/components/ResenaCarousel";

// Tipo para el producto serializado desde MongoDB
type Producto = {
  _id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagen: string;
  inspirado_en?: string;
  notas: {
    nombre: string;
    intensidad: number;
    color: string;
  }[];
};

// Función para obtener productos destacados
async function getProductosDestacados() {
  try {
    await connectToDatabase();
    // Obtener 3 productos aleatorios
    const productos = await ProductoModel.aggregate([{ $sample: { size: 3 } }]);
    return JSON.parse(JSON.stringify(productos)) as Producto[]; // Serializar para Next.js
  } catch (error) {
    console.error("Error al obtener productos destacados:", error);
    
    // Productos por defecto cuando hay error de conexión
    return [
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
      }
    ];
  }
}

export default async function Home() {
  const productosDestacados = await getProductosDestacados();
  const siteName = "Escencias Robjans";

  return (
    <div className="min-h-screen flex flex-col bg-[#8e3b00]">
      {/* Header y Hero unidos con imagen de fondo */}
      <div className="relative min-h-[100vh] overflow-hidden">
        {/* Fondo base */}
        <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-r from-[#8e3b00] to-[#a03e00]"></div>
        
        {/* Overlay con efecto de gradiente */}
        <div className="absolute inset-0 w-full h-full z-0 bg-gradient-to-r from-[#8e3b00]/90 to-transparent"></div>
        
        {/* Imagen de fondo que abarca todo el espacio */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://i.postimg.cc/XYc9q0v6/image.png"
            alt="Perfume Escencias Robjans"
            className="absolute right-0 h-full w-auto object-contain animate-fade-in-right"
            style={{ 
              maxHeight: 'none',
              minHeight: '100%',
              maxWidth: 'none',
              width: 'auto',
              top: '50%', 
              transform: 'translateY(-50%)'
            }}
          />
        </div>
        
        {/* Integración del nuevo componente de header */}
        <Header />
        
        {/* Contenido de texto en primer plano */}
        <div className="container mx-auto px-6 pt-32 pb-16 h-full flex flex-col items-start relative z-10">
          {/* Logo agregado en la parte superior */}
          <div className="mb-12 animate-fade-in-top">
            <img 
              src="https://i.postimg.cc/T3QxB7Tv/logo-escencias.jpg"
              alt="Logo Escencias Robjans"
              className="h-56 w-auto rounded-3xl shadow-xl"
            />
          </div>
          
          {/* Texto principal movido más abajo */}
          <div className="md:w-1/2 text-left mt-24 animate-fade-in-left">
            <h1 className="text-6xl md:text-7xl font-bold mb-2 font-playfair text-white drop-shadow-lg">
              Olfatea
            </h1>
            <h2 className="text-5xl md:text-6xl font-bold mb-10 font-playfair text-white drop-shadow-lg">
              El Futuro de las Fragancias.
            </h2>
            <Link 
              href="/productos" 
              className="inline-block bg-[#fed856] text-[#312b2b] px-8 py-3 rounded-full font-bold hover:bg-white transition-colors font-raleway mt-6 transform hover:scale-105 transition-transform shadow-lg"
            >
              DESCUBRIR FRAGANCIAS
            </Link>
          </div>
        </div>
      </div>

      {/* Sección de Productos Destacados */}
      <section className="py-16 bg-[#594a42]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center font-bold text-[#fed856] mb-12 font-playfair">
            Productos Destacados
          </h2>
          
          {productosDestacados.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600 font-raleway">Cargando productos destacados...</p>
            </div>
          ) : (
            <>
              {/* Vista previa de productos destacados (3 productos) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {productosDestacados.map((producto) => (
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
                        {producto.inspirado_en && (
                          <span className="text-sm text-gray-600 font-raleway">
                            Inspirado en {producto.inspirado_en}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#312b2b] mb-2 font-raleway">
                        {producto.nombre}
                      </h3>
                      <p className="text-gray-600 mb-4 font-raleway">
                        {producto.descripcion.length > 100
                          ? `${producto.descripcion.substring(0, 100)}...`
                          : producto.descripcion}
                      </p>
                      <Link
                        href={`/productos/${producto._id}`}
                        className="w-full block text-center bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Botón para ver todos los productos */}
              <div className="text-center mt-8">
                <Link
                  href="/productos"
                  className="inline-block bg-[#312b2b] text-[#fed856] px-6 py-3 rounded-lg font-bold hover:bg-[#473f3f] transition-colors font-raleway"
                >
                  Ver Todos los Productos
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Sección de Atributos */}
      <section className="py-16 bg-[#473f3f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#fed856] mb-12 font-raleway">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#312b2b] p-8 rounded-lg border-2 border-[#fed856] text-center transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg">
              <div className="flex justify-center mb-6 transform transition-transform duration-500 hover:rotate-12">
                <div className="bg-[#fed856] p-4 rounded-full w-20 h-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#312b2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#fed856] mb-4 font-raleway">Precios Accesibles</h3>
              <p className="text-[#f8f1d8] font-raleway">
                Fragancias de alta calidad a una fracción del costo de las marcas originales.
              </p>
            </div>
            <div className="bg-[#312b2b] p-8 rounded-lg border-2 border-[#fed856] text-center transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg">
              <div className="flex justify-center mb-6 transform transition-transform duration-500 hover:rotate-12">
                <div className="bg-[#fed856] p-4 rounded-full w-20 h-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#312b2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#fed856] mb-4 font-raleway">Alta Calidad</h3>
              <p className="text-[#f8f1d8] font-raleway">
                Utilizamos ingredientes de primera calidad para recrear tus fragancias favoritas.
              </p>
            </div>
            <div className="bg-[#312b2b] p-8 rounded-lg border-2 border-[#fed856] text-center transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg">
              <div className="flex justify-center mb-6 transform transition-transform duration-500 hover:rotate-12">
                <div className="bg-[#fed856] p-4 rounded-full w-20 h-20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#312b2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#fed856] mb-4 font-raleway">Atención Personalizada</h3>
              <p className="text-[#f8f1d8] font-raleway">
                Te asesoramos para encontrar la fragancia perfecta según tus gustos y preferencias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Opiniones de Clientes */}
      <section className="py-16 bg-[#594a42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#fed856] mb-12 font-raleway relative">
            Lo que dicen nuestros clientes
            <span className="block w-24 h-1 bg-[#fed856] mx-auto mt-4"></span>
          </h2>
          
          <div className="mt-8">
            <ResenaCarousel />
          </div>
        </div>
      </section>

      {/* Sección de Contacto con Mapa */}
      <section id="contacto" className="py-16 bg-[#594a42]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#fed856] mb-12 font-raleway relative">
            Encuéntranos
            <span className="block w-24 h-1 bg-[#fed856] mx-auto mt-4"></span>
          </h2>
          
          <div className="md:flex md:space-x-8">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-[#473f3f] p-8 rounded-lg border-2 border-[#fed856] shadow-xl transform transition-transform hover:scale-105">
                <h3 className="text-2xl font-semibold text-[#fed856] mb-6 font-raleway">Información de Contacto</h3>
                <ul className="space-y-6 text-[#f8f1d8]">
                  <li className="flex items-center font-raleway">
                    <div className="bg-[#fed856] p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#312b2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-lg">Querétaro SN20, Centro, 37800 Dolores Hidalgo Cuna de la Independencia Nacional, Gto.</span>
                  </li>
                  <li className="flex items-center font-raleway">
                    <div className="bg-[#fed856] p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#312b2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-lg">escenciasrobjans@gmail.com</span>
                  </li>
                  <li className="flex items-center font-raleway">
                    <div className="bg-[#fed856] p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#312b2b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-lg">418 305 6738</span>
                  </li>
                </ul>
                <div className="mt-8 p-6 bg-[#312b2b] rounded-lg border border-[#fed856]">
                  <h4 className="text-xl text-[#fed856] font-medium mb-4 font-raleway">Horarios de Atención</h4>
                  <p className="text-[#f8f1d8] mb-3 font-raleway flex items-center">
                    <span className="inline-block bg-[#fed856] w-3 h-3 rounded-full mr-2"></span>
                    Lunes a Sábado: 10:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden h-96 border-2 border-[#fed856] shadow-xl transform transition-transform hover:scale-105">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d930.8123612065694!2d-100.93353407078688!3d21.159112095411456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842b3f071b338b0f%3A0xa8fa347ed3e05c17!2sQuer%C3%A9taro%2020%2C%20Centro%2C%2037800%20Dolores%20Hidalgo%20Cuna%20de%20la%20Independencia%20Nacional%2C%20Gto.!5e0!3m2!1ses-419!2smx!4v1714134553399!5m2!1ses-419!2smx"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Escencias Robjan&apos;s"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                    href="/productos" 
                    className="text-[#f8f1d8] hover:text-[#fed856] transition-colors font-raleway flex items-center group"
                  >
                    <span className="inline-block w-2 h-2 bg-[#fed856] mr-2 rounded-full group-hover:w-3 transition-all duration-300"></span>
                    Catálogo de Perfumes
                  </Link>
                </li>
                <li>
                  <a 
                    href="#contacto" 
                    className="text-[#f8f1d8] hover:text-[#fed856] transition-colors font-raleway flex items-center group"
                  >
                    <span className="inline-block w-2 h-2 bg-[#fed856] mr-2 rounded-full group-hover:w-3 transition-all duration-300"></span>
                    Información de Contacto
                  </a>
                </li>
                <li>
                  <Link 
                    href="/productos" 
                    className="text-[#f8f1d8] hover:text-[#fed856] transition-colors font-raleway flex items-center group"
                  >
                    <span className="inline-block w-2 h-2 bg-[#fed856] mr-2 rounded-full group-hover:w-3 transition-all duration-300"></span>
                    Novedades
                  </Link>
                </li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-6 text-[#fed856] font-raleway">Síguenos</h3>
              <div className="flex justify-center md:justify-start space-x-6">
                <a 
                  href="https://www.facebook.com/share/1ABvtdNdz4/?mibextid=wwXIfr" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#473f3f] hover:bg-[#fed856] transition-colors p-3 rounded-full group"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6 text-[#f8f1d8] group-hover:text-[#312b2b] transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/explore/locations/505829956452206/perfumeria-esencias-robjans/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#473f3f] hover:bg-[#fed856] transition-colors p-3 rounded-full group"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6 text-[#f8f1d8] group-hover:text-[#312b2b] transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://wa.me/524183056738" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#473f3f] hover:bg-[#fed856] transition-colors p-3 rounded-full group"
                >
                  <span className="sr-only">WhatsApp</span>
                  <svg className="h-6 w-6 text-[#f8f1d8] group-hover:text-[#312b2b] transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
              <div className="mt-6">
                <p className="text-[#f8f1d8] font-raleway">
                  Suscríbete a nuestro boletín para recibir ofertas exclusivas
                </p>
                <div className="mt-3 flex">
                  <input 
                    type="email" 
                    placeholder="Tu correo electrónico" 
                    className="bg-[#473f3f] border border-[#fed856] rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] text-white w-full"
                  />
                  <button className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-r-md hover:bg-[#e5c24c] transition-colors font-bold">
                    Enviar
                  </button>
                </div>
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
