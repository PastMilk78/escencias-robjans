"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

// Definir la interfaz del contexto
interface CartContextType {
  carrito: ItemCarrito[];
  totalItems: number;
  total: number;
  añadirAlCarrito: (producto: Producto, cantidad: number) => void;
  actualizarCantidad: (productoId: string, nuevaCantidad: number) => void;
  eliminarProducto: (productoId: string) => void;
  vaciarCarrito: () => void;
}

// Crear el contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Proveedor del contexto
export function CartProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [total, setTotal] = useState(0);

  // Cargar carrito desde localStorage cuando el componente se monta
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        const items = JSON.parse(carritoGuardado);
        // Filtrar items inválidos
        const itemsValidos = items.filter((item: any) => item && item.producto && item.producto._id);
        setCarrito(itemsValidos);
        calcularTotal(itemsValidos);
      } catch (e) {
        console.error('Error al cargar el carrito:', e);
        localStorage.removeItem('carrito');
      }
    }
  }, []);

  // Función para añadir productos al carrito
  const añadirAlCarrito = (producto: Producto, cantidad: number) => {
    setCarrito(prevCarrito => {
      // Verificar si el producto ya está en el carrito
      const itemExistente = prevCarrito.find(item => item.producto._id === producto._id);
      
      // Calcular la cantidad total considerando lo que ya está en el carrito
      const cantidadActual = itemExistente ? itemExistente.cantidad : 0;
      const nuevaCantidadTotal = cantidadActual + cantidad;
      
      // Verificar si hay suficiente stock
      if (nuevaCantidadTotal > producto.stock) {
        alert(`Solo hay ${producto.stock} unidades disponibles de este producto.`);
        // Si hay un item existente, mantenerlo con su cantidad actual
        return prevCarrito;
      }
      
      let nuevoCarrito;
      if (itemExistente) {
        // Actualizar cantidad del item existente
        nuevoCarrito = prevCarrito.map(item => 
          item.producto._id === producto._id 
            ? { ...item, cantidad: nuevaCantidadTotal } 
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

  // Actualizar cantidad de un producto
  const actualizarCantidad = (productoId: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      // Eliminar producto si la cantidad es 0 o menor
      setCarrito(carrito.filter(item => item.producto._id !== productoId));
    } else {
      // Verificar si hay suficiente stock antes de actualizar
      const item = carrito.find(item => item.producto._id === productoId);
      if (item && nuevaCantidad > item.producto.stock) {
        alert(`Solo hay ${item.producto.stock} unidades disponibles de este producto.`);
        return;
      }
      
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
  };

  // Total de items en el carrito
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <CartContext.Provider 
      value={{ 
        carrito, 
        totalItems, 
        total, 
        añadirAlCarrito, 
        actualizarCantidad, 
        eliminarProducto, 
        vaciarCarrito 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
} 