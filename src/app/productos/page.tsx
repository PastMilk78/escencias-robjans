import Link from "next/link";

// Datos de ejemplo para los productos
const productos = [
  {
    id: 1,
    nombre: "Aroma Celestial",
    categoria: "Mujer",
    precio: 69.99,
    descripcion: "Una fragancia floral con notas de jazmín y rosa.",
    imagen: "/placeholder.jpg"
  },
  {
    id: 2,
    nombre: "Bosque Místico",
    categoria: "Hombre",
    precio: 74.99,
    descripcion: "Aroma amaderado con toques de sándalo y cedro.",
    imagen: "/placeholder.jpg"
  },
  {
    id: 3,
    nombre: "Brisa Marina",
    categoria: "Unisex",
    precio: 79.99,
    descripcion: "Fragancia fresca con notas de cítricos y sal marina.",
    imagen: "/placeholder.jpg"
  },
  {
    id: 4,
    nombre: "Pasión Nocturna",
    categoria: "Mujer",
    precio: 84.99,
    descripcion: "Aroma sensual con vainilla y ámbar.",
    imagen: "/placeholder.jpg"
  },
  {
    id: 5,
    nombre: "Elegancia Urbana",
    categoria: "Hombre",
    precio: 89.99,
    descripcion: "Fragancia sofisticada con notas especiadas y cuero.",
    imagen: "/placeholder.jpg"
  },
  {
    id: 6,
    nombre: "Aventura Tropical",
    categoria: "Unisex",
    precio: 69.99,
    descripcion: "Aroma exótico con notas de frutas tropicales.",
    imagen: "/placeholder.jpg"
  },
  {
    id: 7,
    nombre: "Seducción Dorada",
    categoria: "Mujer",
    precio: 99.99,
    descripcion: "Fragancia intensa con notas de ámbar y flores exóticas.",
    imagen: "/placeholder.jpg"
  },
  {
    id: 8,
    nombre: "Imperio Azul",
    categoria: "Hombre",
    precio: 94.99,
    descripcion: "Aroma fresco y potente con toques de lavanda y bergamota.",
    imagen: "/placeholder.jpg"
  }
];

export default function ProductosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f1d8]">
      {/* Barra de navegación */}
      <header className="bg-[#312b2b] shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="font-bold text-xl text-[#fed856]">Escencias Robjan&apos;s</Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/contacto" className="text-[#fed856] hover:text-white">Contacto</Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-[#fed856] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="text-[#fed856] hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero de la página de productos */}
        <div className="bg-[#312b2b] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-[#fed856] sm:text-4xl">
                Nuestros Perfumes
              </h1>
              <p className="mt-4 text-lg text-[#f8f1d8]">
                Explora nuestra colección de fragancias exclusivas
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-[#473f3f] shadow-md py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap items-center space-x-4">
                <span className="text-[#fed856]">Filtrar por:</span>
                <select className="bg-[#312b2b] border border-[#fed856] text-[#f8f1d8] rounded-md py-2 px-3 text-sm">
                  <option>Todos</option>
                  <option>Mujer</option>
                  <option>Hombre</option>
                  <option>Unisex</option>
                </select>
                <select className="bg-[#312b2b] border border-[#fed856] text-[#f8f1d8] rounded-md py-2 px-3 text-sm">
                  <option>Precio</option>
                  <option>Menor a mayor</option>
                  <option>Mayor a menor</option>
                </select>
              </div>
              <div className="mt-4 sm:mt-0">
                <span className="text-[#fed856] mr-2">Mostrar:</span>
                <select className="bg-[#312b2b] border border-[#fed856] text-[#f8f1d8] rounded-md py-2 px-3 text-sm">
                  <option>12</option>
                  <option>24</option>
                  <option>36</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="bg-[#f8f1d8] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {productos.map((producto) => (
              <div key={producto.id} className="bg-[#312b2b] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-[#fed856]">
                <div className="h-64 bg-[#473f3f] flex items-center justify-center">
                  <span className="text-[#fed856]">Imagen de producto</span>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-[#fed856]">{producto.nombre}</h3>
                      <p className="text-sm text-[#f8f1d8]">{producto.categoria}</p>
                    </div>
                    <span className="text-lg font-bold text-[#fed856]">${producto.precio}</span>
                  </div>
                  <p className="mt-2 text-[#f8f1d8] text-sm">{producto.descripcion}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <Link href={`/productos/${producto.id}`} className="text-[#fed856] hover:text-white text-sm font-medium">
                      Ver detalles
                    </Link>
                    <button className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-md text-sm hover:bg-[#e5c24c] transition-colors border border-[#fed856]">
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center">
              <button className="px-3 py-2 border border-[#fed856] bg-[#312b2b] text-[#fed856] rounded-l-md hover:bg-[#473f3f]">
                Anterior
              </button>
              <button className="px-3 py-2 border-t border-b border-[#fed856] bg-[#fed856] text-[#312b2b]">
                1
              </button>
              <button className="px-3 py-2 border-t border-b border-[#fed856] bg-[#312b2b] text-[#fed856] hover:bg-[#473f3f]">
                2
              </button>
              <button className="px-3 py-2 border-t border-b border-[#fed856] bg-[#312b2b] text-[#fed856] hover:bg-[#473f3f]">
                3
              </button>
              <button className="px-3 py-2 border border-[#fed856] bg-[#312b2b] text-[#fed856] rounded-r-md hover:bg-[#473f3f]">
                Siguiente
              </button>
            </nav>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#312b2b] text-white py-12 mt-auto border-t-2 border-[#fed856]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#fed856]">Escencias Robjan&apos;s</h3>
              <p className="text-[#f8f1d8]">
                Tu tienda de confianza para encontrar las mejores fragancias a precios accesibles.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#fed856]">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/contacto" className="text-[#f8f1d8] hover:text-[#fed856] transition-colors">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#fed856]">Contacto</h3>
              <ul className="space-y-2 text-[#f8f1d8]">
                <li>Calle Principal #123</li>
                <li>info@escenciasrobjans.com</li>
                <li>+123 456 7890</li>
              </ul>
              <div className="flex space-x-4 mt-4">
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
            <p className="text-[#f8f1d8]">&copy; {new Date().getFullYear()} Escencias Robjan&apos;s. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 