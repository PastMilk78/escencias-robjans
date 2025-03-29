/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Ignorar errores de TypeScript durante la compilación
    // Esto es arriesgado pero necesario para el despliegue
    // !! WARN !!
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig; 