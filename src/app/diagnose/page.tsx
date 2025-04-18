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
      <h1 className="text-2xl font-bold mb-4">Diagnóstico del Sistema</h1>
      
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
      
      {/* Formulario para crear reseñas */}
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Crear Nueva Reseña</h2>
        <form onSubmit={handleResenaSubmit}>
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700 font-medium mb-2">
              Nombre del Cliente
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formResena.nombre}
              onChange={handleResenaInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="comentario" className="block text-gray-700 font-medium mb-2">
              Comentario
            </label>
            <textarea
              id="comentario"
              name="comentario"
              value={formResena.comentario}
              onChange={handleResenaInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label htmlFor="puntuacion" className="block text-gray-700 font-medium mb-2">
              Puntuación (1-5 estrellas)
            </label>
            <select
              id="puntuacion"
              name="puntuacion"
              value={formResena.puntuacion}
              onChange={handleResenaInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 Estrella</option>
              <option value={2}>2 Estrellas</option>
              <option value={3}>3 Estrellas</option>
              <option value={4}>4 Estrellas</option>
              <option value={5}>5 Estrellas</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={resenaLoading}
            >
              {resenaLoading ? 'Creando...' : 'Crear Reseña'}
            </button>
            
            {resenaResult.message && (
              <div className={`ml-4 ${resenaResult.success ? 'text-green-600' : 'text-red-600'}`}>
                {resenaResult.message}
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8">
        <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
} 