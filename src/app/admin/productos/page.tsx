"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Tipo de datos para productos
type Nota = {
  nombre: string;
  intensidad: number;
  color: string;
};

type Producto = {
  _id?: string;
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
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
  const [notaActual, setNotaActual] = useState<Nota>({ nombre: '', intensidad: 5, color: '#000000' });
  const [sugerenciasNotas, setSugerenciasNotas] = useState<string[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [notasHistoricas, setNotasHistoricas] = useState<string[]>([
    'Vainilla', 'Frutos Rojos', 'Cítrico', 'Madera', 'Flores', 'Especias', 'Almizcle',
    'Pachulí', 'Mandarina', 'Bergamota', 'Bambú', 'Cedro', 'Manzana', 'Limón', 'Ámbar',
    'Rosa', 'Peonía', 'Jazmín', 'Lavanda', 'Sándalo', 'Canela', 'Jengibre', 'Cardamomo'
  ]);
  
  // Valores por defecto para un nuevo producto
  const productoNuevo: Producto = {
    nombre: '',
    categoria: 'Mujer',
    precio: 0,
    stock: 0,
    descripcion: '',
    imagen: 'https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg',
    inspirado_en: '',
    notas: []
  };

  // Referencia para el input de búsqueda de notas
  const notaInputRef = useRef<HTMLInputElement>(null);
  
  // Cargar productos desde MongoDB
  const cargarProductos = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const data = await fetch('/api/productos');
      
      if (!data.ok) {
        throw new Error('Error al cargar productos desde la API');
      }
      
      const productos = await data.json();
      setProductos(productos.productos);
      
      // Recopilar notas históricas de todos los productos
      const todasLasNotas = new Set<string>(notasHistoricas);
      productos.productos.forEach((producto: Producto) => {
        producto.notas.forEach(nota => {
          todasLasNotas.add(nota.nombre);
        });
      });
      setNotasHistoricas(Array.from(todasLasNotas));
      
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
  
  // Función para mostrar el formulario de nuevo producto
  const nuevoProducto = () => {
    setProductoEditando({...productoNuevo});
    setMostrarFormulario(true);
  };
  
  // Función para editar un producto
  const editarProducto = (producto: Producto) => {
    setProductoEditando({...producto});
    setMostrarFormulario(true);
  };
  
  // Función para eliminar un producto
  const eliminarProducto = async (id: string) => {
    if (window.confirm('¿Está seguro que desea eliminar este producto?')) {
      try {
        const res = await fetch(`/api/productos/${id}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          throw new Error('Error al eliminar el producto');
        }
        
        setMensaje('Producto eliminado con éxito');
        setTimeout(() => {
          setMensaje(null);
        }, 3000);
        
        // Recargar productos
        cargarProductos();
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el producto');
      }
    }
  };
  
  // Función para manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (productoEditando) {
      setProductoEditando({
        ...productoEditando,
        [name]: name === 'precio' || name === 'stock' ? parseFloat(value) : value
      });
    }
  };
  
  // Función para manejar cambios en el formulario de nota
  const handleNotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'nombre') {
      setNotaActual({...notaActual, [name]: value});
      
      // Buscar coincidencias para sugerencias
      if (value.length > 0) {
        const coincidencias = notasHistoricas.filter(nota => 
          nota.toLowerCase().includes(value.toLowerCase())
        );
        setSugerenciasNotas(coincidencias);
        setMostrarSugerencias(coincidencias.length > 0);
      } else {
        setSugerenciasNotas([]);
        setMostrarSugerencias(false);
      }
    } else {
      setNotaActual({
        ...notaActual, 
        [name]: name === 'intensidad' ? parseInt(value) : value
      });
    }
  };
  
  // Función para seleccionar una sugerencia
  const seleccionarSugerencia = (nombreNota: string) => {
    // Buscar si esta nota ya existe para obtener su color habitual
    const notaHistorica = productos.flatMap(p => p.notas).find(n => n.nombre === nombreNota);
    
    setNotaActual({
      ...notaActual,
      nombre: nombreNota,
      color: notaHistorica?.color || notaActual.color
    });
    setMostrarSugerencias(false);
    // Enfocar el input de intensidad después de seleccionar
    if (notaInputRef.current) {
      notaInputRef.current.focus();
    }
  };
  
  // Función para agregar una nota al producto
  const agregarNota = () => {
    if (notaActual.nombre.trim() === '') {
      alert('Debe ingresar un nombre para la nota');
      return;
    }
    
    if (productoEditando) {
      // Verificar si la nota ya existe
      const notaExistente = productoEditando.notas.findIndex(
        nota => nota.nombre.toLowerCase() === notaActual.nombre.toLowerCase()
      );
      
      if (notaExistente >= 0) {
        // Si existe, actualizar su intensidad y color
        const notasActualizadas = [...productoEditando.notas];
        notasActualizadas[notaExistente] = {...notaActual};
        setProductoEditando({
          ...productoEditando,
          notas: notasActualizadas
        });
      } else {
        // Si no existe, agregar la nueva nota
        setProductoEditando({
          ...productoEditando,
          notas: [...productoEditando.notas, {...notaActual}]
        });
        
        // Añadir la nota al historial si no existe
        if (!notasHistoricas.includes(notaActual.nombre)) {
          setNotasHistoricas([...notasHistoricas, notaActual.nombre]);
        }
      }
      
      // Limpiar el formulario de nota
      setNotaActual({ nombre: '', intensidad: 5, color: '#000000' });
    }
  };
  
  // Función para eliminar una nota del producto
  const eliminarNota = (index: number) => {
    if (productoEditando) {
      const notasActualizadas = [...productoEditando.notas];
      notasActualizadas.splice(index, 1);
      setProductoEditando({
        ...productoEditando,
        notas: notasActualizadas
      });
    }
  };
  
  // Función para guardar el producto
  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productoEditando) return;
    
    try {
      const method = productoEditando._id ? 'PUT' : 'POST';
      const url = productoEditando._id ? `/api/productos/${productoEditando._id}` : '/api/productos';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productoEditando),
      });
      
      if (!res.ok) {
        throw new Error('Error al guardar el producto');
      }
      
      setMensaje(productoEditando._id ? 'Producto actualizado con éxito' : 'Producto creado con éxito');
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
      
      // Ocultar formulario y recargar productos
      setMostrarFormulario(false);
      setProductoEditando(null);
      cargarProductos();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto');
    }
  };
  
  // Función para cancelar la edición
  const cancelarEdicion = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
  };

  return (
    <div className="min-h-screen bg-[#f8f1d8] p-8">
      <h1 className="text-3xl font-bold text-[#312b2b] mb-8 font-raleway">Administración de Productos</h1>
      
      {mensaje && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 font-raleway">
          <p>{mensaje}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 font-raleway">
          <p>{error}</p>
        </div>
      )}
      
      {!mostrarFormulario && (
        <div className="mb-6">
          <button 
            className="bg-[#fed856] text-[#312b2b] px-4 py-2 rounded font-bold hover:bg-[#e5c24c] transition-colors font-raleway"
            onClick={nuevoProducto}
          >
            Nuevo Producto
          </button>
        </div>
      )}
      
      {cargando ? (
        <div className="text-center py-12">
          <p className="text-lg text-[#312b2b] font-raleway">Cargando productos...</p>
        </div>
      ) : !mostrarFormulario ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
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
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos.map((producto) => (
                <tr key={producto._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full object-cover" src={producto.imagen} alt={producto.nombre} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 font-raleway">{producto.nombre}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-raleway">{producto.categoria}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-raleway">${producto.precio.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-raleway">{producto.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => editarProducto(producto)}
                      className="text-[#312b2b] hover:text-[#473f3f] mr-3 font-raleway"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(producto._id as string)}
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
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#312b2b] mb-6 font-raleway">
            {productoEditando && productoEditando._id ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          
          <form onSubmit={guardarProducto}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={productoEditando?.nombre || ''}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-[#fed856] focus:border-[#fed856] block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                  Categoría
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={productoEditando?.categoria || ''}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-[#fed856] focus:border-[#fed856] block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="Mujer">Mujer</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                  Precio
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  value={productoEditando?.precio || 0}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="shadow-sm focus:ring-[#fed856] focus:border-[#fed856] block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={productoEditando?.stock || 0}
                  onChange={handleChange}
                  min="0"
                  className="shadow-sm focus:ring-[#fed856] focus:border-[#fed856] block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={productoEditando?.descripcion || ''}
                  onChange={handleChange}
                  rows={3}
                  className="shadow-sm focus:ring-[#fed856] focus:border-[#fed856] block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                  URL de la Imagen
                </label>
                <input
                  type="text"
                  id="imagen"
                  name="imagen"
                  value={productoEditando?.imagen || ''}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-[#fed856] focus:border-[#fed856] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="inspirado_en" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                  Inspirado en
                </label>
                <input
                  type="text"
                  id="inspirado_en"
                  name="inspirado_en"
                  value={productoEditando?.inspirado_en || ''}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-[#fed856] focus:border-[#fed856] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-medium text-[#312b2b] mb-4 font-raleway">Notas de Fragancia</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <label htmlFor="nota_nombre" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                      Nombre de la Nota
                    </label>
                    <input
                      type="text"
                      id="nota_nombre"
                      name="nombre"
                      value={notaActual.nombre}
                      onChange={handleNotaChange}
                      className="shadow-sm focus:ring-[#fed856] focus:border-[#fed856] block w-full sm:text-sm border-gray-300 rounded-md"
                      autoComplete="off"
                    />
                    
                    {/* Sugerencias de notas */}
                    {mostrarSugerencias && sugerenciasNotas.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-y-auto">
                        {sugerenciasNotas.map((sugerencia, index) => (
                          <div 
                            key={index}
                            onClick={() => seleccionarSugerencia(sugerencia)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-raleway"
                          >
                            {sugerencia}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="nota_intensidad" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                      Intensidad (1-10)
                    </label>
                    <input
                      type="number"
                      id="nota_intensidad"
                      name="intensidad"
                      value={notaActual.intensidad}
                      onChange={handleNotaChange}
                      min="1"
                      max="10"
                      className="shadow-sm focus:ring-[#fed856] focus:border-[#fed856] block w-full sm:text-sm border-gray-300 rounded-md"
                      ref={notaInputRef}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="nota_color" className="block text-sm font-medium text-gray-700 mb-1 font-raleway">
                      Color
                    </label>
                    <input
                      type="color"
                      id="nota_color"
                      name="color"
                      value={notaActual.color}
                      onChange={handleNotaChange}
                      className="h-10 w-full rounded-md cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mb-6">
                  <button
                    type="button"
                    onClick={agregarNota}
                    className="bg-[#312b2b] text-white px-4 py-2 rounded font-medium hover:bg-[#473f3f] transition-colors font-raleway"
                  >
                    Agregar Nota
                  </button>
                </div>
                
                {productoEditando && productoEditando.notas.length > 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-[#312b2b] mb-3 font-raleway">Notas Agregadas</h4>
                    <div className="space-y-3">
                      {productoEditando.notas.map((nota, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                          <div className="flex items-center">
                            <div
                              className="w-6 h-6 rounded-full mr-3"
                              style={{ backgroundColor: nota.color }}
                            ></div>
                            <span className="font-medium font-raleway">{nota.nombre}</span>
                            <span className="ml-2 text-sm text-gray-500 font-raleway">({nota.intensidad}/10)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => eliminarNota(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 font-raleway">No hay notas agregadas aún</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-8 space-x-3">
              <button
                type="button"
                onClick={cancelarEdicion}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-400 transition-colors font-raleway"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#fed856] text-[#312b2b] px-6 py-2 rounded font-bold hover:bg-[#e5c24c] transition-colors font-raleway"
              >
                Guardar Producto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 