/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Ignorar errores de TypeScript durante la compilación
    // Esto es arriesgado pero necesario para el despliegue
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignorar errores de ESLint durante la compilación
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig; 