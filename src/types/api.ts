// Definición de tipos para los parámetros de rutas dinámicas
export type RouteSegmentProps<T> = {
  params: T;
};

// Parámetros para la ruta de producto por ID
export type ProductoParams = {
  id: string;
}; 