"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Tipos
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

export default function ProductosAdmin() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  
  // Producto vacío para el formulario de creación
  const productoNuevo: Omit<Producto, '_id'> = {
    nombre: "",
    categoria: "Unisex",
    precio: 0,
    stock: 0,
    descripcion: "",
    imagen: "/placeholder.jpg",
    inspirado_en: "",
    notas: []
  };
  
  // Estado para el formulario
  const [formulario, setFormulario] = useState<any>(productoNuevo);
  const [nuevaNota, setNuevaNota] = useState<Nota>({ nombre: "", intensidad: 5, color: "#CCCCCC" });
  
  // Cargar productos desde la API
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
    } catch (err: any) {
      console.error('Error al obtener productos:', err);
      setError(err.message || 'Error al cargar productos');
    } finally {
      setCargando(false);
    }
  };
  
  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);
  
  // Manejadores de eventos
  const abrirFormularioCrear = () => {
    setProductoEditando(null);
    setFormulario(productoNuevo);
    setImagenPreview(null);
    setMostrarFormulario(true);
  };
  
  const abrirFormularioEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setFormulario({...producto});
    setImagenPreview(producto.imagen);
    setMostrarFormulario(true);
  };
  
  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
    setFormulario(productoNuevo);
    setImagenPreview(null);
  };
  
  const manejarCambioFormulario = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Convertir números si es necesario
    if (name === "precio" || name === "stock") {
      setFormulario({
        ...formulario,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormulario({
        ...formulario,
        [name]: value
      });
    }
  };

  const manejarCambioImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultado = reader.result as string;
        setImagenPreview(resultado);
        setFormulario({
          ...formulario,
          imagen: resultado
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const manejarCambioNota = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevaNota({
      ...nuevaNota,
      [name]: name === "intensidad" ? parseInt(value) || 1 : value
    });
  };
  
  const agregarNota = () => {
    if (nuevaNota.nombre.trim()) {
      setFormulario({
        ...formulario,
        notas: [...formulario.notas, {...nuevaNota}]
      });
      setNuevaNota({ nombre: "", intensidad: 5, color: "#CCCCCC" });
    }
  };
  
  const eliminarNota = (index: number) => {
    setFormulario({
      ...formulario,
      notas: formulario.notas.filter((_: Nota, i: number) => i !== index)
    });
  };
  
  const guardarProducto = async () => {
    if (formulario.nombre.trim() === "") {
      alert("El nombre del producto es obligatorio");
      return;
    }
    
    try {
      let respuesta;
      
      if (productoEditando) {
        // Actualizar producto existente
        respuesta = await fetch(`/api/productos/${productoEditando._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formulario)
        });
      } else {
        // Agregar nuevo producto
        respuesta = await fetch('/api/productos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formulario)
        });
      }
      
      if (!respuesta.ok) {
        throw new Error('Error al guardar el producto');
      }
      
      // Recargar productos
      await cargarProductos();
      cerrarFormulario();
      
    } catch (err: any) {
      console.error('Error al guardar producto:', err);
      alert(err.message || 'Error al guardar el producto');
    }
  };
  
  const eliminarProducto = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const respuesta = await fetch(`/api/productos/${id}`, {
          method: 'DELETE'
        });
        
        if (!respuesta.ok) {
          throw new Error('Error al eliminar el producto');
        }
        
        // Recargar productos
        await cargarProductos();
        
      } catch (err: any) {
        console.error('Error al eliminar producto:', err);
        alert(err.message || 'Error al eliminar el producto');
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f1d8]">
      {/* Barra de navegación */}
      <header className="bg-[#312b2b] shadow-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <Link href="/" className="h-12 w-36">
                <img 
                  src="/images/logo-escencias.jpg" 
                  alt="Escencias Robjan's" 
                  className="h-full object-contain"
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#312b2b] font-raleway">
            Gestión de Productos
          </h1>
          <button
            onClick={abrirFormularioCrear}
            className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway"
          >
            Nuevo Producto
          </button>
        </div>
        
        {/* Estado de carga o error */}
        {cargando && (
          <div className="text-center py-8">
            <p className="text-lg text-[#312b2b] font-raleway">Cargando productos...</p>
          </div>
        )}
        
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
          <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-[#fed856]">
            {productos.length > 0 ? (
              <table className="min-w-full divide-y divide-[#fed856]">
                <thead className="bg-[#312b2b]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#fed856] uppercase tracking-wider font-raleway">
                      Producto
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#fed856] uppercase tracking-wider font-raleway">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#fed856]">
                  {productos.map((producto) => (
                    <tr key={producto._id} className="hover:bg-[#f8f1d8]">
                      <td className="px-6 py-4 whitespace-nowrap font-raleway">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden">
                            {producto.imagen.startsWith("data:") ? (
                              <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
                            ) : (
                              <div className="bg-[#312b2b] h-full w-full flex items-center justify-center">
                                <span className="text-[#fed856] text-xs">Foto</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#312b2b]">
                              {producto.nombre}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#312b2b] font-raleway">
                        {producto.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#312b2b] font-raleway">
                        ${producto.precio.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#312b2b] font-raleway">
                        {producto.stock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#312b2b] font-raleway">
                        {producto.inspirado_en}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-raleway">
                        <button
                          onClick={() => abrirFormularioEditar(producto)}
                          className="text-[#312b2b] hover:text-[#fed856] mr-4"
                        >
                          Editar
                        </button>
                        <Link
                          href={`/admin/productos/detalle?id=${producto._id}`}
                          className="text-[#312b2b] hover:text-[#fed856] mr-4"
                        >
                          Ver Detalle
                        </Link>
                        <button
                          onClick={() => eliminarProducto(producto._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#312b2b] font-raleway">No hay productos disponibles. ¡Crea el primero!</p>
              </div>
            )}
          </div>
        )}
        
        {/* Formulario modal */}
        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-[#312b2b] font-raleway">
                {productoEditando ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                    Nombre*
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={manejarCambioFormulario}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                    Categoría
                  </label>
                  <select
                    name="categoria"
                    value={formulario.categoria}
                    onChange={manejarCambioFormulario}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Mujer">Mujer</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={formulario.precio}
                    onChange={manejarCambioFormulario}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formulario.stock}
                    onChange={manejarCambioFormulario}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={manejarCambioFormulario}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                    Inspirado en
                  </label>
                  <input
                    type="text"
                    name="inspirado_en"
                    value={formulario.inspirado_en}
                    onChange={manejarCambioFormulario}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                    Imagen del producto
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={manejarCambioImagen}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  {imagenPreview && (
                    <div className="mt-2 w-32 h-32 overflow-hidden border border-gray-300 rounded-md">
                      <img 
                        src={imagenPreview} 
                        alt="Vista previa" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                </div>
                
                {/* Sección de notas */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-medium mb-2 text-[#312b2b] font-raleway">
                    Notas del Perfume
                  </h3>
                  
                  <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={nuevaNota.nombre}
                          onChange={manejarCambioNota}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                          Intensidad (1-10)
                        </label>
                        <input
                          type="number"
                          name="intensidad"
                          value={nuevaNota.intensidad}
                          onChange={manejarCambioNota}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          min="1"
                          max="10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                          Color
                        </label>
                        <input
                          type="color"
                          name="color"
                          value={nuevaNota.color}
                          onChange={manejarCambioNota}
                          className="w-full p-1 h-10 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={agregarNota}
                      className="mt-3 bg-[#312b2b] text-white px-4 py-2 rounded-md hover:bg-[#473f3f] transition-colors font-raleway"
                    >
                      Añadir Nota
                    </button>
                  </div>
                  
                  {/* Lista de notas */}
                  {formulario.notas.length > 0 && (
                    <div className="mt-4">
                      <table className="min-w-full divide-y divide-gray-200">
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
                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-raleway">
                              Acción
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {formulario.notas.map((nota: Nota, index: number) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-raleway">
                                {nota.nombre}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-raleway">
                                {nota.intensidad}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div
                                    className="h-6 w-6 rounded-full mr-2"
                                    style={{ backgroundColor: nota.color }}
                                  ></div>
                                  <span className="text-sm text-gray-900 font-raleway">{nota.color}</span>
                                </div>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <button
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
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors font-raleway"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={guardarProducto}
                  className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway"
                >
                  Guardar
                </button>
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