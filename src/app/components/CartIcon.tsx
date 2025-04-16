"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

// Definir tipos
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
  inspirado_en?: string;
  notas: Nota[];
};

type ItemCarrito = {
  producto: Producto;
  cantidad: number;
};

// Tipo para el evento personalizado
interface AddToCartEvent extends Event {
  detail: {
    producto: Producto;
    cantidad: number;
  };
}

export default function CartIcon() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { 
    carrito, 
    total, 
    totalItems, 
    actualizarCantidad, 
    eliminarProducto, 
    vaciarCarrito,
    añadirAlCarrito
  } = useCart();

  // Escuchar el evento personalizado 'add-to-cart'
  useEffect(() => {
    const handleAddToCart = (event: Event) => {
      const customEvent = event as AddToCartEvent;
      const { producto, cantidad } = customEvent.detail;
      añadirAlCarrito(producto, cantidad);
      // Opcionalmente mostrar el carrito después de añadir
      setModalAbierto(true);
    };

    // Añadir el event listener
    window.addEventListener('add-to-cart', handleAddToCart);

    // Cleanup: remover el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('add-to-cart', handleAddToCart);
    };
  }, [añadirAlCarrito]);

  // Abrir/cerrar modal del carrito
  const toggleModal = () => {
    setModalAbierto(!modalAbierto);
    // Evitar scroll cuando el modal está abierto
    if (!modalAbierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Proceder al pago con Stripe
  const procederAlPago = async () => {
    try {
      setIsLoading(true);
      
      // Preparar los datos para la API
      const checkoutData = {
        items: carrito,
        userInfo: {
          // Por ahora vacío, podríamos expandir más adelante con info del usuario
          email: '',
          phone: ''
        }
      };
      
      // Llamar a nuestra API de checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar el proceso de pago');
      }
      
      // Redirigir a la página de checkout de Stripe
      if (data.url) {
        // Cerrar el modal del carrito
        setModalAbierto(false);
        
        // Redirigir a la URL de Stripe
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error al proceder al pago:', error);
      alert('Hubo un error al procesar el pago. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button 
          onClick={toggleModal}
          className="text-[#fed856] hover:text-white flex items-center"
          aria-label="Ver carrito"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {totalItems > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-2 -right-2">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Modal del carrito */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mt-20 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-[#312b2b] font-raleway">Carrito de Compras</h2>
              <button 
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {carrito.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 font-raleway mb-4">Tu carrito está vacío</p>
                  <Link
                    href="/productos"
                    onClick={toggleModal}
                    className="inline-block bg-[#fed856] text-[#312b2b] px-4 py-2 rounded-md hover:bg-[#e5c24c] transition-colors font-raleway"
                  >
                    Ver Productos
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {carrito.map((item: ItemCarrito) => (
                      <div key={item.producto._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <img
                            src={item.producto.imagen || "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg"}
                            alt={item.producto.nombre}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <div>
                            <h3 className="font-medium text-[#312b2b] font-raleway">{item.producto.nombre}</h3>
                            <p className="text-[#545454] font-raleway">${item.producto.precio.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                          <button
                            onClick={() => actualizarCantidad(item.producto._id, item.cantidad - 1)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l"
                          >
                            -
                          </button>
                          <span className="bg-gray-100 px-4 py-1 text-[#312b2b]">{item.cantidad}</span>
                          <button
                            onClick={() => actualizarCantidad(item.producto._id, item.cantidad + 1)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r"
                          >
                            +
                          </button>
                          <button
                            onClick={() => eliminarProducto(item.producto._id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-medium text-[#312b2b] font-raleway">Total:</span>
                      <span className="text-xl font-bold text-[#312b2b] font-raleway">${total.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      <button
                        onClick={vaciarCarrito}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-raleway"
                        disabled={isLoading}
                      >
                        Vaciar Carrito
                      </button>
                      <button
                        onClick={procederAlPago}
                        className="bg-[#fed856] text-[#312b2b] px-6 py-2 rounded-md font-bold hover:bg-[#e5c24c] transition-colors font-raleway disabled:opacity-50"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Procesando...' : 'Proceder al Pago'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 