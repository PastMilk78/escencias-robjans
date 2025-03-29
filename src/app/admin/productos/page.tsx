"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Tipo de datos para notas y productos
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

export default function ProductosAdminPage() {
  const searchParams = useSearchParams();
  const idEditar = searchParams.get('edit');
  
  // Estados
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el formulario
  const [formulario, setFormulario] = useState<Omit<Producto, '_id'>>({
    nombre: "",
    categoria: "Mujer",
    precio: 0,
    stock: 0,
    descripcion: "",
    imagen: "",
    inspirado_en: "",
    notas: []
  });
  
  const [productoEditando, setProductoEditando] = useState<string | null>(null);
  const [nuevaNota, setNuevaNota] = useState<Nota>({ nombre: "", intensidad: 5, color: "#CCCCCC" });
  
  // Cargar productos desde API
  const cargarProductos = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const respuesta = await fetch('/api/productos');
      if (!respuesta.ok) {
        throw new Error('Error al cargar productos');
      }
      
      const datos = await respuesta.json();
      setProductos(datos.productos);
    } catch (err: Error | unknown) {
      console.error('Error al obtener productos:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setCargando(false);
    }
  };
  
  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);
  
  // Cargar producto para editar si se especifica en la URL
  useEffect(() => {
    if (idEditar) {
      const cargarProductoParaEditar = async () => {
        try {
          const respuesta = await fetch(`/api/productos/${idEditar}`);
          if (!respuesta.ok) {
            throw new Error('Error al cargar el producto para editar');
          }
          
          const datos = await respuesta.json();
          
          setFormulario({
            nombre: datos.producto.nombre,
            categoria: datos.producto.categoria,
            precio: datos.producto.precio,
            stock: datos.producto.stock,
            descripcion: datos.producto.descripcion,
            imagen: datos.producto.imagen,
            inspirado_en: datos.producto.inspirado_en,
            notas: datos.producto.notas
          });
          
          setProductoEditando(idEditar);
          setMostrarModal(true);
        } catch (err: Error | unknown) {
          console.error('Error al cargar producto para editar:', err);
          alert(err instanceof Error ? err.message : 'Error al cargar el producto para editar');
        }
      };
      
      cargarProductoParaEditar();
    }
  }, [idEditar]);
  
  // Guardar producto (crear o actualizar)
  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = productoEditando 
        ? `/api/productos/${productoEditando}` 
        : '/api/productos';
      
      const metodo = productoEditando ? 'PUT' : 'POST';
      
      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formulario)
      });
      
      if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.error || 'Error al guardar el producto');
      }
      
      // Recargar productos y cerrar modal
      await cargarProductos();
      cerrarModal();
      
    } catch (err: Error | unknown) {
      console.error('Error al guardar producto:', err);
      alert(err instanceof Error ? err.message : 'Error al guardar el producto');
    }
  };
  
  // Eliminar producto
  const eliminarProducto = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    try {
      const respuesta = await fetch(`/api/productos/${id}`, {
        method: 'DELETE'
      });
      
      if (!respuesta.ok) {
        const error = await respuesta.json();
        throw new Error(error.error || 'Error al eliminar el producto');
      }
      
      await cargarProductos();
      
    } catch (err: Error | unknown) {
      console.error('Error al eliminar producto:', err);
      alert(err instanceof Error ? err.message : 'Error al eliminar el producto');
    }
  };
  
  // Manejar cambio en el formulario
  const manejarCambioFormulario = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Convertir a número si es precio o stock
    if (type === 'number') {
      setFormulario({
        ...formulario,
        [name]: parseFloat(value)
      });
    } else {
      setFormulario({
        ...formulario,
        [name]: value
      });
    }
  };
  
  // Manejar carga de imágenes
  const manejarCargaImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormulario({
        ...formulario,
        imagen: reader.result as string
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  // Manejar cambio en la nota
  const manejarCambioNota = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convertir a número si es intensidad
    if (name === 'intensidad') {
      setNuevaNota({
        ...nuevaNota,
        intensidad: parseInt(value, 10)
      });
    } else {
      setNuevaNota({
        ...nuevaNota,
        [name]: value
      });
    }
  };
  
  // Agregar nota al formulario
  const agregarNota = () => {
    if (nuevaNota.nombre.trim()) {
      setFormulario({
        ...formulario,
        notas: [...formulario.notas, {...nuevaNota}]
      });
      setNuevaNota({ nombre: "", intensidad: 5, color: "#CCCCCC" });
    }
  };
  
  // Eliminar nota del formulario
  const eliminarNota = (index: number) => {
    setFormulario({
      ...formulario,
      notas: formulario.notas.filter((_: Nota, i: number) => i !== index)
    });
  };
  
  // Abrir modal para crear nuevo producto
  const abrirModalCrear = () => {
    setFormulario({
      nombre: "",
      categoria: "Mujer",
      precio: 0,
      stock: 0,
      descripcion: "",
      imagen: "",
      inspirado_en: "",
      notas: []
    });
    setProductoEditando(null);
    setMostrarModal(true);
  };
  
  // Cerrar modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoEditando(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f1d8]">
      {/* Barra de navegación */}
      <header className="bg-[#312b2b] shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className="h-24 w-auto">
                <img 
                  src="/images/logo-escencias.jpg" 
                  alt="Escencias Robjan&apos;s" 
                  className="h-full object-contain rounded-xl"
                />
              </Link>
              <span className="text-xl text-[#fed856] font-raleway">
                Panel de Administración
              </span>
            </div>
            <div>
              <Link
                href="/admin"
                className="text-[#fed856] hover:text-white transition-colors font-raleway"
              >
                Volver al Panel
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#312b2b] font-raleway">
            Gestión de Productos
          </h1>
          <button
            onClick={abrirModalCrear}
            className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway"
          >
            Nuevo Producto
          </button>
        </div>
        
        {/* Estado de carga */}
        {cargando && (
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <p className="text-[#312b2b] text-lg font-raleway">Cargando productos...</p>
          </div>
        )}
        
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-raleway">{error}</p>
            <button 
              onClick={cargarProductos}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-raleway"
            >
              Reintentar
            </button>
          </div>
        )}
        
        {/* Tabla de productos */}
        {!cargando && !error && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {productos.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#312b2b]">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#fed856] uppercase tracking-wider font-raleway">
                        Nombre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#fed856] uppercase tracking-wider font-raleway">
                        Categoría
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#fed856] uppercase tracking-wider font-raleway">
                        Precio
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#fed856] uppercase tracking-wider font-raleway">
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#fed856] uppercase tracking-wider font-raleway">
                        Inspirado en
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#fed856] uppercase tracking-wider font-raleway">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {productos.map((producto) => (
                      <tr key={producto._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-raleway">
                          {producto.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-raleway">
                          {producto.categoria}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-raleway">
                          ${producto.precio.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-raleway">
                          {producto.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-raleway">
                          {producto.inspirado_en}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/admin/productos/detalle?id=${producto._id}`}
                            className="text-indigo-600 hover:text-indigo-900 mr-4 font-raleway"
                          >
                            Ver
                          </Link>
                          <Link
                            href={`/admin/productos?edit=${producto._id}`}
                            className="text-[#fed856] hover:text-[#e5c24c] mr-4 font-raleway"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => eliminarProducto(producto._id)}
                            className="text-red-600 hover:text-red-900 font-raleway"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-[#312b2b] font-raleway">No hay productos registrados. ¡Crea el primero!</p>
              </div>
            )}
          </div>
        )}
        
        {/* Modal de formulario */}
        {mostrarModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#312b2b] font-raleway">
                    {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
                  </h2>
                  <button 
                    onClick={cerrarModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={guardarProducto}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2 font-raleway" htmlFor="nombre">
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={manejarCambioFormulario}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2 font-raleway" htmlFor="categoria">
                        Categoría
                      </label>
                      <select
                        id="categoria"
                        name="categoria"
                        value={formulario.categoria}
                        onChange={manejarCambioFormulario}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway"
                      >
                        <option value="Mujer" className="bg-[#473f3f] text-white">Mujer</option>
                        <option value="Hombre" className="bg-[#473f3f] text-white">Hombre</option>
                        <option value="Unisex" className="bg-[#473f3f] text-white">Unisex</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2 font-raleway" htmlFor="precio">
                        Precio
                      </label>
                      <input
                        type="number"
                        id="precio"
                        name="precio"
                        value={formulario.precio}
                        onChange={manejarCambioFormulario}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2 font-raleway" htmlFor="stock">
                        Stock
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formulario.stock}
                        onChange={manejarCambioFormulario}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway"
                        min="0"
                        step="1"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2 font-raleway" htmlFor="descripcion">
                        Descripción
                      </label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formulario.descripcion}
                        onChange={manejarCambioFormulario}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway"
                        rows={3}
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2 font-raleway" htmlFor="imagen">
                        Imagen del producto
                      </label>
                      <div className="flex flex-col space-y-2">
                        <input
                          type="file"
                          id="imagen-upload"
                          accept="image/*"
                          onChange={manejarCargaImagen}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway bg-[#473f3f] text-white"
                        />
                        <div className="text-gray-500 text-sm italic font-raleway">o</div>
                        <input
                          type="text"
                          id="imagen"
                          name="imagen"
                          value={formulario.imagen}
                          onChange={manejarCambioFormulario}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway"
                          placeholder="URL o data URL de la imagen"
                        />
                        {formulario.imagen && (
                          <div className="mt-2 w-full flex justify-center">
                            <div className="w-32 h-32 overflow-hidden rounded-md border border-gray-300">
                              <img 
                                src={formulario.imagen} 
                                alt="Vista previa" 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2 font-raleway" htmlFor="inspirado_en">
                        Inspirado en
                      </label>
                      <input
                        type="text"
                        id="inspirado_en"
                        name="inspirado_en"
                        value={formulario.inspirado_en}
                        onChange={manejarCambioFormulario}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#fed856] font-raleway"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Sección de notas */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-[#312b2b] mb-4 font-raleway">
                      Notas del Perfume
                    </h3>
                    
                    {/* Lista de notas actuales */}
                    {formulario.notas.length > 0 && (
                      <div className="mb-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 mb-4">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-raleway">
                                Nota
                              </th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-raleway">
                                Intensidad
                              </th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-raleway">
                                Color
                              </th>
                              <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-raleway">
                                Acción
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {formulario.notas.map((nota, index) => (
                              <tr key={index}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 font-raleway">
                                  {nota.nombre}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 font-raleway">
                                  {nota.intensidad}/10
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div
                                      className="h-5 w-5 rounded-full mr-2"
                                      style={{ backgroundColor: nota.color }}
                                    ></div>
                                    <span className="text-sm text-gray-500 font-raleway">{nota.color}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    type="button"
                                    onClick={() => eliminarNota(index)}
                                    className="text-red-600 hover:text-red-900 font-raleway"
                                  >
                                    Eliminar
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    
                    {/* Formulario para agregar nueva nota */}
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-bold text-gray-700 mb-3 font-raleway">Agregar nueva nota</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-gray-700 text-xs mb-1 font-raleway" htmlFor="notaNombre">
                            Nombre
                          </label>
                          <input
                            type="text"
                            id="notaNombre"
                            name="nombre"
                            value={nuevaNota.nombre}
                            onChange={manejarCambioNota}
                            className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#fed856] font-raleway"
                            placeholder="Ej: Vainilla"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 text-xs mb-1 font-raleway" htmlFor="notaIntensidad">
                            Intensidad (1-10)
                          </label>
                          <input
                            type="range"
                            id="notaIntensidad"
                            name="intensidad"
                            value={nuevaNota.intensidad}
                            onChange={manejarCambioNota}
                            min="1"
                            max="10"
                            className="w-full"
                          />
                          <div className="text-center text-xs text-gray-500 font-raleway">
                            {nuevaNota.intensidad}/10
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 text-xs mb-1 font-raleway" htmlFor="notaColor">
                            Color
                          </label>
                          <div className="flex items-center">
                            <input
                              type="color"
                              id="notaColor"
                              name="color"
                              value={nuevaNota.color}
                              onChange={manejarCambioNota}
                              className="w-12 h-8 border border-gray-300 rounded"
                            />
                            <input
                              type="text"
                              name="color"
                              value={nuevaNota.color}
                              onChange={manejarCambioNota}
                              className="ml-2 flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#fed856] font-raleway"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-right">
                        <button
                          type="button"
                          onClick={agregarNota}
                          className="bg-[#312b2b] text-white px-3 py-1 rounded-md text-sm hover:bg-[#473f3f] transition-colors font-raleway"
                        >
                          Agregar Nota
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-8">
                    <button
                      type="button"
                      onClick={cerrarModal}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-4 hover:bg-gray-400 transition-colors font-raleway"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway"
                    >
                      {productoEditando ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
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