"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [total, setTotal] = useState(0);

  // Cargar carrito desde localStorage cuando el componente se monta
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        const items = JSON.parse(carritoGuardado);
        setCarrito(items);
        calcularTotal(items);
      } catch (e) {
        console.error('Error al cargar el carrito:', e);
        localStorage.removeItem('carrito');
      }
    }

    // Añadir manejador de evento personalizado para añadir productos al carrito
    const handleAddToCart = (event: AddToCartEvent) => {
      const { producto, cantidad } = event.detail;
      añadirAlCarrito(producto, cantidad);
    };

    // Agregar event listener
    window.addEventListener('add-to-cart', handleAddToCart as EventListener);

    // Limpiar event listener al desmontar
    return () => {
      window.removeEventListener('add-to-cart', handleAddToCart as EventListener);
    };
  }, []);

  // Función para añadir productos al carrito
  const añadirAlCarrito = (producto: Producto, cantidad: number) => {
    setCarrito(prevCarrito => {
      // Verificar si el producto ya está en el carrito
      const itemExistente = prevCarrito.find(item => item.producto._id === producto._id);
      
      let nuevoCarrito;
      if (itemExistente) {
        // Actualizar cantidad del item existente
        nuevoCarrito = prevCarrito.map(item => 
          item.producto._id === producto._id 
            ? { ...item, cantidad: item.cantidad + cantidad } 
            : item
        );
      } else {
        // Añadir nuevo item al carrito
        nuevoCarrito = [...prevCarrito, { producto, cantidad }];
      }
      
      // Actualizar localStorage
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
      
      // Recalcular total
      calcularTotal(nuevoCarrito);
      
      return nuevoCarrito;
    });
  };

  // Recalcular total cuando cambia el carrito
  const calcularTotal = (items: ItemCarrito[]) => {
    const nuevoTotal = items.reduce(
      (sum, item) => sum + item.producto.precio * item.cantidad,
      0
    );
    setTotal(nuevoTotal);
  };

  // Actualizar localStorage cuando cambia el carrito
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    calcularTotal(carrito);
  }, [carrito]);

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

  // Actualizar cantidad de un producto
  const actualizarCantidad = (productoId: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      // Eliminar producto si la cantidad es 0 o menor
      setCarrito(carrito.filter(item => item.producto._id !== productoId));
    } else {
      // Actualizar cantidad
      setCarrito(
        carrito.map(item =>
          item.producto._id === productoId
            ? { ...item, cantidad: nuevaCantidad }
            : item
        )
      );
    }
  };

  // Eliminar un producto del carrito
  const eliminarProducto = (productoId: string) => {
    setCarrito(carrito.filter(item => item.producto._id !== productoId));
  };

  // Vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
    setModalAbierto(false);
    document.body.style.overflow = 'auto';
  };

  // Proceder al pago (integrará con Stripe)
  const procederAlPago = () => {
    // Aquí se implementará la integración con Stripe
    alert("La funcionalidad de pago con Stripe se implementará próximamente.");
    // Podríamos redirigir a una página de checkout
    // router.push('/checkout');
  };

  // Total de items en el carrito
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

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
                    {carrito.map((item) => (
                      <div key={item.producto._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <img
                            src={item.producto.imagen || "https://i.postimg.cc/MGTww7GM/perfume-destacado.jpg"}
                            alt={item.producto.nombre}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <div>
                            <h3 className="font-medium text-[#312b2b] font-raleway">{item.producto.nombre}</h3>
                            <p className="text-sm text-gray-600 font-raleway">${item.producto.precio.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 sm:mt-0">
                          <button
                            onClick={() => actualizarCantidad(item.producto._id, item.cantidad - 1)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l"
                          >
                            -
                          </button>
                          <span className="bg-gray-100 px-4 py-1">{item.cantidad}</span>
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
                      >
                        Vaciar Carrito
                      </button>
                      <button
                        onClick={procederAlPago}
                        className="bg-[#fed856] text-[#312b2b] px-6 py-2 rounded-md font-bold hover:bg-[#e5c24c] transition-colors font-raleway"
                      >
                        Proceder al Pago
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