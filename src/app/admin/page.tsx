import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f1d8]">
      {/* Barra de navegación */}
      <header className="bg-[#312b2b] shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className="h-12 w-36">
                <img 
                  src="https://i.postimg.cc/K1KCM5K0/logo-escencias.jpg" 
                  alt="Escencias Robjan&apos;s" 
                  className="h-full object-contain rounded-xl"
                />
              </Link>
              <span className="text-xl text-[#fed856] font-raleway">Panel de Administración</span>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[#312b2b] mb-8 font-raleway">Panel de Administración</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Tarjeta de Productos */}
          <div className="bg-[#312b2b] rounded-lg shadow-md p-6 border border-[#fed856]">
            <h2 className="text-xl font-semibold text-[#fed856] mb-4 font-raleway">Gestión de Productos</h2>
            <p className="text-[#f8f1d8] mb-6 font-raleway">
              Administra el catálogo de perfumes: añadir, editar, eliminar productos y gestionar inventario.
            </p>
            <Link 
              href="/admin/productos" 
              className="block text-center bg-[#fed856] text-[#312b2b] py-2 px-4 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway"
            >
              Gestionar Productos
            </Link>
          </div>
          
          {/* Tarjeta de Ventas */}
          <div className="bg-[#312b2b] rounded-lg shadow-md p-6 border border-[#fed856]">
            <h2 className="text-xl font-semibold text-[#fed856] mb-4 font-raleway">Reportes de Ventas</h2>
            <p className="text-[#f8f1d8] mb-6 font-raleway">
              Visualiza reportes de ventas, estadísticas y tendencias para analizar el rendimiento.
            </p>
            <Link 
              href="#" 
              className="block text-center bg-[#fed856] text-[#312b2b] py-2 px-4 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway"
            >
              Ver Reportes
            </Link>
          </div>
          
          {/* Tarjeta de Configuración */}
          <div className="bg-[#312b2b] rounded-lg shadow-md p-6 border border-[#fed856]">
            <h2 className="text-xl font-semibold text-[#fed856] mb-4 font-raleway">Configuración</h2>
            <p className="text-[#f8f1d8] mb-6 font-raleway">
              Administra la configuración general de la tienda, usuarios y permisos.
            </p>
            <Link 
              href="#" 
              className="block text-center bg-[#fed856] text-[#312b2b] py-2 px-4 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway"
            >
              Configurar
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#312b2b] text-white py-8 mt-auto border-t-2 border-[#fed856]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#f8f1d8] font-raleway">
            &copy; {new Date().getFullYear()} Escencias Robjan&apos;s - Panel de Administración
          </p>
        </div>
      </footer>
    </div>
  );
} 