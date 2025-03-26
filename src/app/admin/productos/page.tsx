"use client";

import { useState } from "react";
import Link from "next/link";

// Tipos
type Nota = {
  nombre: string;
  intensidad: number;
  color: string;
};

type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagen: string;
  inspirado_en: string;
  notas: Nota[];
};

// Datos de ejemplo
const productosIniciales: Producto[] = [
  {
    id: 1,
    nombre: "Aroma Celestial",
    categoria: "Mujer",
    precio: 69.99,
    stock: 15,
    descripcion: "Una fragancia floral con notas de jazmín y rosa.",
    imagen: "/placeholder.jpg",
    inspirado_en: "J'adore (Dior)",
    notas: [
      { nombre: "Jazmín", intensidad: 9, color: "#FFFFFF" },
      { nombre: "Rosa", intensidad: 8, color: "#FF007F" },
      { nombre: "Vainilla", intensidad: 6, color: "#F3E5AB" }
    ]
  },
  {
    id: 2,
    nombre: "Bosque Místico",
    categoria: "Hombre",
    precio: 74.99,
    stock: 20,
    descripcion: "Aroma amaderado con toques de sándalo y cedro.",
    imagen: "/placeholder.jpg",
    inspirado_en: "Sauvage (Dior)",
    notas: [
      { nombre: "Sándalo", intensidad: 8, color: "#8B4513" },
      { nombre: "Cedro", intensidad: 7, color: "#D2691E" },
      { nombre: "Bergamota", intensidad: 6, color: "#FFA500" }
    ]
  },
  {
    id: 3,
    nombre: "Brisa Marina",
    categoria: "Unisex",
    precio: 79.99,
    stock: 10,
    descripcion: "Fragancia fresca con notas de cítricos y sal marina.",
    imagen: "/placeholder.jpg",
    inspirado_en: "Light Blue (Dolce & Gabbana)",
    notas: [
      { nombre: "Limón", intensidad: 9, color: "#FFFF00" },
      { nombre: "Sal Marina", intensidad: 7, color: "#E0FFFF" },
      { nombre: "Manzana", intensidad: 5, color: "#4CC417" }
    ]
  }
];

export default function ProductosAdmin() {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  
  // Producto vacío para el formulario de creación
  const productoNuevo: Producto = {
    id: Date.now(), // Usamos timestamp como ID temporal
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
  const [formulario, setFormulario] = useState<Producto>(productoNuevo);
  const [nuevaNota, setNuevaNota] = useState<Nota>({ nombre: "", intensidad: 5, color: "#CCCCCC" });
  
  // Manejadores de eventos
  const abrirFormularioCrear = () => {
    setProductoEditando(null);
    setFormulario(productoNuevo);
    setMostrarFormulario(true);
  };
  
  const abrirFormularioEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setFormulario({...producto});
    setMostrarFormulario(true);
  };
  
  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
    setFormulario(productoNuevo);
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
      notas: formulario.notas.filter((_, i) => i !== index)
    });
  };
  
  const guardarProducto = () => {
    if (formulario.nombre.trim() === "") {
      alert("El nombre del producto es obligatorio");
      return;
    }
    
    if (productoEditando) {
      // Actualizar producto existente
      setProductos(
        productos.map(p => p.id === formulario.id ? formulario : p)
      );
    } else {
      // Agregar nuevo producto
      setProductos([...productos, formulario]);
    }
    
    cerrarFormulario();
  };
  
  const eliminarProducto = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      setProductos(productos.filter(p => p.id !== id));
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
        
        {/* Tabla de productos */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-[#fed856]">
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
                <tr key={producto.id} className="hover:bg-[#f8f1d8]">
                  <td className="px-6 py-4 whitespace-nowrap font-raleway">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-[#312b2b] rounded-full overflow-hidden">
                        <span className="text-[#fed856] flex items-center justify-center h-full text-xs">Foto</span>
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
                      href={`/admin/productos/detalle?id=${producto.id}`}
                      className="text-[#312b2b] hover:text-[#fed856] mr-4"
                    >
                      Ver Detalle
                    </Link>
                    <button
                      onClick={() => eliminarProducto(producto.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
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
                          {formulario.notas.map((nota, index) => (
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