"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DiagnosePage() {
  const [mongoStatus, setMongoStatus] = useState<any>(null);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [productoDetalle, setProductoDetalle] = useState<any>(null);
  const [productoLoading, setProductoLoading] = useState(false);
  const [productoError, setProductoError] = useState<string | null>(null);
  
  // Estado para el formulario de reseñas
  const [formResena, setFormResena] = useState({
    nombre: '',
    comentario: '',
    puntuacion: 5
  });
  const [resenaResult, setResenaResult] = useState<{success?: boolean, message?: string}>({});
  const [resenaLoading, setResenaLoading] = useState(false);
  const [resenas, setResenas] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verificar la conexión a MongoDB
        const mongoResponse = await fetch('/api/diagnose');
        const mongoData = await mongoResponse.json();
        setMongoStatus(mongoData);

        // Cargar productos
        const productosResponse = await fetch('/api/productos');
        const productosData = await productosResponse.json();
        setProductos(productosData.productos || []);
        
        // Cargar reseñas existentes
        const resenasResponse = await fetch('/api/resenas');
        const resenasData = await resenasResponse.json();
        setResenas(resenasData.resenas || []);
      } catch (err) {
        setError('Error al cargar datos: ' + String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cargarProducto = async (id: string) => {
    setSelectedProductId(id);
    setProductoLoading(true);
    setProductoError(null);
    setProductoDetalle(null);

    try {
      const response = await fetch(`/api/productos/${id}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setProductoDetalle(data.producto);
    } catch (err) {
      setProductoError('Error al cargar el producto: ' + String(err));
    } finally {
      setProductoLoading(false);
    }
  };
  
  // Manejar cambios en el formulario de reseñas
  const handleResenaInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormResena({
      ...formResena,
      [name]: name === 'puntuacion' ? parseInt(value) : value
    });
  };
  
  // Enviar formulario de reseñas
  const handleResenaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResenaLoading(true);
    setResenaResult({});
    
    try {
      const response = await fetch('/api/resenas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formResena)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la reseña');
      }
      
      setResenaResult({
        success: true,
        message: 'Reseña creada exitosamente'
      });
      
      // Limpiar el formulario
      setFormResena({
        nombre: '',
        comentario: '',
        puntuacion: 5
      });
      
      // Recargar las reseñas para ver la actualización
      const resenasResponse = await fetch('/api/resenas');
      const resenasData = await resenasResponse.json();
      setResenas(resenasData.resenas || []);
    } catch (err) {
      setResenaResult({
        success: false,
        message: String(err)
      });
    } finally {
      setResenaLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Estado de MongoDB</h2>
          {loading ? (
            <p>Cargando estado de MongoDB...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div>
              <div className="mb-2">
                <span className="font-medium">Estado: </span>
                {mongoStatus?.connected ? (
                  <span className="text-green-600">Conectado</span>
                ) : (
                  <span className="text-red-600">No conectado</span>
                )}
              </div>
              <div className="mb-2">
                <span className="font-medium">Mensaje: </span>
                <span>{mongoStatus?.message}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Colecciones: </span>
                <span>{mongoStatus?.collections?.join(', ') || 'Ninguna'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Lista de Productos</h2>
          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : productos.length === 0 ? (
            <p>No se encontraron productos</p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              <ul className="divide-y">
                {productos.map((producto) => (
                  <li key={producto._id} className="py-2">
                    <button 
                      onClick={() => cargarProducto(producto._id)}
                      className="text-blue-600 hover:underline"
                    >
                      {producto.nombre} - ${producto.precio.toFixed(2)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {selectedProductId && (
        <div className="mt-8 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Detalles del Producto</h2>
          <div className="mb-2">
            <span className="font-medium">ID seleccionado: </span>
            <span>{selectedProductId}</span>
          </div>
          
          {productoLoading ? (
            <p>Cargando detalles del producto...</p>
          ) : productoError ? (
            <div className="text-red-600">
              <p>{productoError}</p>
              <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify({ id: selectedProductId }, null, 2)}
              </pre>
            </div>
          ) : productoDetalle ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <img 
                    src={productoDetalle.imagen || 'https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg'} 
                    alt={productoDetalle.nombre}
                    className="w-full h-auto rounded"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{productoDetalle.nombre}</h3>
                  <p className="text-gray-600 mb-2">Inspirado en: {productoDetalle.inspirado_en}</p>
                  <p className="mb-2">{productoDetalle.descripcion}</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-100 p-2 rounded">
                      <span className="font-medium">Precio: </span>
                      <span>${productoDetalle.precio.toFixed(2)}</span>
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                      <span className="font-medium">Stock: </span>
                      <span>{productoDetalle.stock} unidades</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Notas:</h4>
                    <div className="space-y-2">
                      {productoDetalle.notas?.map((nota: any, index: number) => (
                        <div key={index} className="bg-gray-100 p-2 rounded">
                          <div className="flex justify-between">
                            <span>{nota.nombre}</span>
                            <span>Intensidad: {nota.intensidad}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <pre className="mt-4 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                {JSON.stringify(productoDetalle, null, 2)}
              </pre>
            </div>
          ) : (
            <p>Selecciona un producto para ver los detalles</p>
          )}
        </div>
      )}
      
      {/* Sección de Reseñas */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario para crear reseñas */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
          <h2 className="text-2xl font-semibold mb-4 text-center">Administrar Reseñas</h2>
          <p className="text-gray-600 mb-6 text-center">
            Agrega nuevas reseñas de clientes que se mostrarán en la página principal
          </p>
          
          <form onSubmit={handleResenaSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-gray-700 font-medium mb-2">
                Nombre del Cliente
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formResena.nombre}
                onChange={handleResenaInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Ej: María López"
              />
            </div>
            
            <div>
              <label htmlFor="comentario" className="block text-gray-700 font-medium mb-2">
                Comentario
              </label>
              <textarea
                id="comentario"
                name="comentario"
                value={formResena.comentario}
                onChange={handleResenaInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="Escribe aquí la opinión del cliente..."
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="puntuacion" className="block text-gray-700 font-medium mb-2">
                Puntuación (1-5 estrellas)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => setFormResena({...formResena, puntuacion: valor})}
                    className="focus:outline-none"
                  >
                    <svg 
                      className={`w-8 h-8 ${formResena.puntuacion >= valor ? 'text-yellow-500' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </button>
                ))}
                <span className="ml-2 text-gray-600">({formResena.puntuacion} estrellas)</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 font-medium"
                disabled={resenaLoading}
              >
                {resenaLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                ) : 'Guardar Reseña'}
              </button>
            </div>
            
            {resenaResult.message && (
              <div className={`p-4 rounded-lg ${resenaResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {resenaResult.message}
              </div>
            )}
          </form>
        </div>
        
        {/* Lista de reseñas existentes */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
          <h2 className="text-2xl font-semibold mb-4 text-center">Reseñas Existentes</h2>
          <p className="text-gray-600 mb-6 text-center">
            Reseñas que actualmente se muestran en la página principal
          </p>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : resenas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay reseñas registradas todavía
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {resenas.map((resena) => (
                <div key={resena._id} className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < resena.puntuacion ? 'text-yellow-500' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <span className="ml-auto text-sm text-gray-500">
                      {new Date(resena.fecha).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 italic mb-2">"{resena.comentario}"</p>
                  <p className="text-gray-900 font-medium">- {resena.nombre}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
} 