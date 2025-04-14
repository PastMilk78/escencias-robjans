import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import ProductoModel from "@/models/Producto";
import CartIcon from "@/app/components/CartIcon";

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
        
        {/* Imagen de fondo que abarca todo el espacio */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://i.postimg.cc/CSLfCjn4/image.png"
            alt="Perfume Escencias Robjans"
            className="absolute right-0 h-full w-auto object-contain"
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
        
        {/* Barra de navegación superpuesta */}
        <header className="relative z-10 py-3">
          <div className="container mx-auto flex justify-between items-center px-4">
            <div></div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar"
                  className="bg-white text-black px-4 py-2 rounded-full font-raleway w-24"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              <a 
                href="#contacto" 
                className="bg-white text-black px-6 py-2 rounded-full font-raleway"
              >
                SOBRE NOSOTROS
              </a>
              <CartIcon />
            </div>
          </div>
        </header>
        
        {/* Contenido de texto en primer plano */}
        <div className="container mx-auto px-4 py-16 h-full flex items-center relative z-10">
          <div className="md:w-1/2 text-left mt-20">
            <h1 className="text-6xl md:text-7xl font-bold mb-2 font-playfair text-white">
              Olfatea
            </h1>
            <h2 className="text-5xl md:text-6xl font-bold mb-8 font-playfair text-white">
              El Futuro de las Fragancias.
            </h2>
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
                    className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105"
                  >
                    <img
                      src={producto.imagen || "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg"}
                      alt={producto.nombre}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#312b2b] mb-2 font-raleway">
                        {producto.nombre}
                      </h3>
                      <p className="text-gray-600 mb-4 font-raleway">
                        {producto.descripcion.length > 100
                          ? `${producto.descripcion.substring(0, 100)}...`
                          : producto.descripcion}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-[#312b2b] font-raleway">
                          ${producto.precio.toFixed(2)}
                        </span>
                        <Link
                          href={`/productos/${producto._id}`}
                          className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway"
                        >
                          Ver Detalles
                        </Link>
                      </div>
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
            <div className="bg-[#312b2b] p-6 rounded-lg border border-[#fed856] text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#fed856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#fed856] mb-2 font-raleway">Precios Accesibles</h3>
              <p className="text-[#f8f1d8] font-raleway">
                Fragancias de alta calidad a una fracción del costo de las marcas originales.
              </p>
            </div>
            <div className="bg-[#312b2b] p-6 rounded-lg border border-[#fed856] text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#fed856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#fed856] mb-2 font-raleway">Alta Calidad</h3>
              <p className="text-[#f8f1d8] font-raleway">
                Utilizamos ingredientes de primera calidad para recrear tus fragancias favoritas.
              </p>
            </div>
            <div className="bg-[#312b2b] p-6 rounded-lg border border-[#fed856] text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#fed856]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#fed856] mb-2 font-raleway">Atención Personalizada</h3>
              <p className="text-[#f8f1d8] font-raleway">
                Te asesoramos para encontrar la fragancia perfecta según tus gustos y preferencias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Contacto con Mapa */}
      <section id="contacto" className="py-16 bg-[#594a42]">
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
                <li><Link href="/productos" className="text-[#f8f1d8] hover:text-[#fed856] transition-colors font-raleway">Catálogo</Link></li>
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
    </div>
  );
}
