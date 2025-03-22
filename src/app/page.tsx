import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Barra de navegación */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-bold text-xl text-gray-800">Escencias Robjan's</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-800 hover:text-gray-600">Inicio</Link>
              <Link href="/productos" className="text-gray-800 hover:text-gray-600">Productos</Link>
              <Link href="/categorias" className="text-gray-800 hover:text-gray-600">Categorías</Link>
              <Link href="/nosotros" className="text-gray-800 hover:text-gray-600">Nosotros</Link>
              <Link href="/contacto" className="text-gray-800 hover:text-gray-600">Contacto</Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-800 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="text-gray-800 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-purple-100 to-pink-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center">
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Descubre tu fragancia ideal
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Exclusivas esencias que destacan tu personalidad y estilo. 
                Perfumes de alta calidad a precios accesibles.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/productos" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Ver Catálogo
                </Link>
                <Link href="/destacados" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium border border-purple-600 hover:bg-gray-50 transition-colors">
                  Destacados
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-64 md:h-auto">
                {/* Aquí iría la imagen de hero, por ahora dejamos un placeholder */}
                <div className="bg-gray-200 rounded-lg h-64 md:h-96 flex items-center justify-center">
                  <span className="text-gray-500">Imagen de perfume destacado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías destacadas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Categorías Destacadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Categoría 1 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <span className="text-gray-500">Imagen de categoría</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfumes para Mujer</h3>
                <p className="text-gray-600 mb-4">Fragancias elegantes y delicadas para cualquier ocasión.</p>
                <Link href="/categoria/mujer" className="text-purple-600 font-medium hover:underline">
                  Ver colección &rarr;
                </Link>
              </div>
            </div>
            
            {/* Categoría 2 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <span className="text-gray-500">Imagen de categoría</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfumes para Hombre</h3>
                <p className="text-gray-600 mb-4">Aromas intensos y duraderos que reflejan personalidad.</p>
                <Link href="/categoria/hombre" className="text-purple-600 font-medium hover:underline">
                  Ver colección &rarr;
                </Link>
              </div>
            </div>
            
            {/* Categoría 3 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <span className="text-gray-500">Imagen de categoría</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfumes Unisex</h3>
                <p className="text-gray-600 mb-4">Fragancias versátiles perfectas para todos los gustos.</p>
                <Link href="/categoria/unisex" className="text-purple-600 font-medium hover:underline">
                  Ver colección &rarr;
                </Link>
              </div>
            </div>
            
            {/* Categoría 4 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                <span className="text-gray-500">Imagen de categoría</span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Edición Limitada</h3>
                <p className="text-gray-600 mb-4">Colecciones exclusivas por tiempo limitado.</p>
                <Link href="/categoria/limitada" className="text-purple-600 font-medium hover:underline">
                  Ver colección &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-lg font-semibold mb-4">Escencias Robjan's</h3>
              <p className="text-gray-400">
                Tu tienda de confianza para encontrar las mejores fragancias a precios accesibles.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/productos" className="text-gray-400 hover:text-white transition-colors">Productos</Link></li>
                <li><Link href="/nosotros" className="text-gray-400 hover:text-white transition-colors">Sobre nosotros</Link></li>
                <li><Link href="/contacto" className="text-gray-400 hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="/politica-privacidad" className="text-gray-400 hover:text-white transition-colors">Política de privacidad</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Calle Principal #123</li>
                <li>info@escenciasrobjans.com</li>
                <li>+123 456 7890</li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} Escencias Robjan's. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
